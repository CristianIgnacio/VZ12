import Tools from '../../util/tools.js';

// Obbtener un token
function getToken($http, $q, OAUTH_KEY, URL) {
  return $http({
    method: 'POST',
    url: URL,
    headers: {
      'Authorization': OAUTH_KEY,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: 'grant_type=client_credentials'
  }).then(response => {
    const data = response.data;
    if (data.access_token) {
      return data.access_token;
    } else {
      return $q.reject("No se pudo obtener el token. Es posible que necesites client_id y client_secret.");
    }
  }).catch(error => {
    console.error("Error obteniendo el token:", error);
    return $q.reject(error);
  });
}

// Llamado a la bd segun un url limit
function doRequest($http, $q, URL, LIMIT, OAUTH_KEY, URL_token) {
  let totalRecords = 0;
  let allResults = [];

  return getToken($http, $q, OAUTH_KEY, URL_token).then(token => {
    // Obtener el total de registros
    return $http({
      method: 'GET',
      url: `${URL}?page=1&limit=1`,
      headers: {
        'Accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      totalRecords = response.data.results.row.total;

      // Calculate total pages
      const totalPages = Math.ceil(totalRecords / LIMIT);
      let promises = [];

      for (let page = 1; page <= totalPages; page++) {
        let req = $http({
          method: 'GET',
          url: `${URL}?page=${page}&limit=${LIMIT}`,
          headers: {
            'Accept': '*/*',
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          allResults.push(...response.data.results.row);
        });
        promises.push(req);
      }

      return $q.all(promises).then(() => allResults);
    });
  });
}

// Parse de las llamadas de bencina
var parseBenci = function(newData, value) {
  const fuelTypeMap = {
    '93': 14, 'A93': 14, 
    'DI': 15, 'ADI': 15, 
    '95': 16, 'A95': 16, 
    'GLP': 17, 
    'GNC': 18,
    '97': 19, 'A97': 19 
  };

  // Obtener el tipo de combustible en clave numérica agrupada
  let tipoCombustible = fuelTypeMap[String(value['combustible'])];
  
  // ¿Es autoservicio?
  let isAutoservicio = String(value['combustible']).startsWith('A'); 
  let new_codigo = value['codigo'] + (isAutoservicio ? "_A" : ""); 
 
  let codigo = new_codigo

  if (!(codigo in newData)) {
    newData[codigo] = {
      name: value['marca'],  // marca
      direction: value['direccion'], // latitud y longitud
      coordenada: Tools.ddToDms(value['latitud'],value['longitud']), 
      commune: value['nombre_comuna'], 
      autoservicio: isAutoservicio ? true : false, // Tipo de atención
      prices: {                 // where && tools.filterInt
        14: 0,  // 93
        15: 0,  // DIESEL
        16: 0,  // 95
        17: 0,  // GLP
        18: 0,  // GNC
        19: 0,  // 97
        20: 0   // kerosene
      },
      update: new Date( value['fecha_actualizacion'].replace(" ", "T") ) // solo fecha
    };
  }

  // Si el tipo de combustible es válido, sumamos su precio a la clave correspondiente
  if (tipoCombustible !== undefined) {
    let precio = value['precio'];
    newData[codigo].prices[tipoCombustible] = precio;
  }
}

// Parse de las llamadas de kerosen
var parseKero = function(newData, value) {

  let isAutoservicio = value['tipo_atencion'] === "Autoservicio" ? true : false
  let new_codigo = value['codigo'] + (isAutoservicio ? "_A" : "");

  let codigo = new_codigo

  if (!(codigo in newData)) {
    newData[codigo] = {
      name: value['marca'],  // marca
      direction: value['direccion'], // latitud y longitud
      coordenada: Tools.ddToDms(value['latitud'],value['longitud']), 
      commune: value['nombre_comuna'], 
      autoservicio: isAutoservicio,  // tipo_de_atencion: 2 valores
      prices: {
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: value['precio'] //toold.filterInt
      },
      update: new Date( value['fecha_actualizacion'].replace(" ", "T") )
    };
  } else {
    newData[codigo].prices['20'] = value['precio']
  }
}

export default app => {
  app.factory('BencinaService', function ($http, $q, URL_TOKEN, URL_BASE, BENCINA_EXT, KEROSENE_EXT, LIMIT_REQUEST, OAUTH_KEY) {

    const vm = this;

    vm.bencinaFactory = {};
    
    vm.bencinaFactory.getData = () => {
      return doRequest($http, $q, URL_BASE + BENCINA_EXT, LIMIT_REQUEST, OAUTH_KEY, URL_TOKEN).then((response) => {
        let data    = response;
        let newData = {};

        data.forEach((value, index) => {
          
          if (index) {
            parseBenci(newData, value)
          }
        });

        return doRequest($http, $q, URL_BASE + KEROSENE_EXT, LIMIT_REQUEST, OAUTH_KEY, URL_TOKEN).then((response) => {
          let data    = response;

          data.forEach((value, index) => {
            if (index) {
              parseKero(newData, value)
            }
          });

          let answer = []
          for (var key in newData) {
            answer.push(newData[key])
          }

          return answer;
        });
      });
    };
    
    return vm.bencinaFactory;
  })
}
