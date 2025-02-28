import Tools from '../../util/tools.js';



var URL_TOKEN = "https://apim.ea.cne.cl:9444/oauth2/token";
var CORS = "https://cors-anywhere.herokuapp.com/"+ URL_TOKEN
var URL_BASE = "https://apim.ea.cne.cl:8244/combustible_en_linea/v1/"
var URL_BENCI = "https://apim.ea.cne.cl:8244/combustible_en_linea/v1/bencina"
var URL_KERO = "https://apim.ea.cne.cl:8244/combustible_en_linea/v1/kerosene"

var LIMIT = "1000";

var URL = URL_BENCI

var TOKEN = "eyJ4NXQiOiJPREJtTVRVMFpqSmpPREprTkdZMVpUaG1ZamsyWVRZek56UmpZekl6TVRCbFlqRTBNV0prWTJJeE5qZzNPRGRqWVdRNVpXWmhOV0kwTkRBM1pqTTROUSIsImtpZCI6Ik9EQm1NVFUwWmpKak9ESmtOR1kxWlRobVlqazJZVFl6TnpSall6SXpNVEJsWWpFME1XSmtZMkl4TmpnM09EZGpZV1E1WldaaE5XSTBOREEzWmpNNE5RX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIzZThjN2RmYS00M2Y5LTQ4ZGYtOGEzYi0yODNmNTU5YzE2MzIiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6InFFbGRtRl9oeTZZdHVhWWdRV2JXeUpkblFCWWEiLCJuYmYiOjE3NDA2ODgxNjUsImF6cCI6InFFbGRtRl9oeTZZdHVhWWdRV2JXeUpkblFCWWEiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczovL2FwaW0uZWEuY25lLmNsOjk0NDQvb2F1dGgyL3Rva2VuIiwiZXhwIjoxNzQwNjkxNzY1LCJpYXQiOjE3NDA2ODgxNjUsImp0aSI6IjU1YzUyZWM2LWZhODYtNDgwMC05OWI5LTQwNTgwNmQwMWQ5YSIsImNsaWVudF9pZCI6InFFbGRtRl9oeTZZdHVhWWdRV2JXeUpkblFCWWEifQ.CFIBGt5GfQsWf5jvQCUKDoGRstRP1eOFXfyi0tI6U20mAwrLvB9jT4ZNR40A9C3qt32AujiKutXZ40Hre61YdLWVBsraJztJ8GbmYavYOOwU_5XNmdcLChZjMDrDskBG7g8_02Doh2aMG-YarE73Ek7_61AAgEjPLG_xvWonqyqAr8p53OZmVVaFSzssm2deeHkjmqqUfL0gNyoG6VLMC4UBhHgfRN8wvv4IXYYw9m7d4FPPIMyODT9vL7-xSppP4iBXl4cMQyw9ZqoiCgSTMJUK1_A7qsV8FJSZ1wkrzIDYNzZ-hDVIBGYopTfLYbs9zlJokKn2GvZpMkY-80Uq6Q"


// var settings = {
//   "url": "https://apim.ea.cne.cl:9444/oauth2/token",
//   "method": "POST",
//   "timeout": 0,
//   "headers": {
//     "Authorization": "Basic cUVsZG1GX2h5Nll0dWFZZ1FXYld5SmRuUUJZYTowWFFadXhZZDVHV0FadVZKazJBM2t3dzhCMXNh",
//     "Content-Type": "application/x-www-form-urlencoded"
//   },
//   "data": {
//     "grant_type": "client_credentials"
//   }
// };
 
// $.ajax(settings).done(function (response) {
//   console.log(response);
// });

// $http.post('https://cors-anywhere.herokuapp.com/https://apim.ea.cne.cl:9444/oauth2/token', 'grant_type=client_credentials', {
//   headers: {
//     "Authorization": "Basic cUVsZG1GX2h5Nll0dWFZZ1FXYld5SmRuUUJZYTowWFFadXhZZDVHV0FadVZKazJBM2t3dzhCMXNh",
//     "Content-Type": "application/x-www-form-urlencoded"
//   }
// }).then(function (response) {
//   console.log(response.data);
// }).catch(function (error) {
//   console.log("Error:", error);
// });

function getToken() {
  return fetch(CORS, {
      method: "POST",
      headers: {
          "Authorization": "Basic cUVsZG1GX2h5Nll0dWFZZ1FXYld5SmRuUUJZYTowWFFadXhZZDVHV0FadVZKazJBM2t3dzhCMXNh",
          "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
          "grant_type": "client_credentials"
      })
  })
  .then(response => response.json())
  .then(data => {
      // console.log(data);
      if (data.access_token) {
          // console.log("Token obtenido:", data.access_token);
          return data.access_token;
      } else {
          throw new Error("No se pudo obtener el token. Es posible que necesites client_id y client_secret.");
      }
  })
  .catch(error => console.error("Error obteniendo el token:", error));
}

function doRequest(URL) {
  let totalRecords = 0;
  let allResults = [];

  return getToken().then(token => {
      // Read total records
      return fetch(`${URL}?page=1&limit=1`, {
          headers: {
              'Accept': '*/*',
              'Authorization': `Bearer ${token}`
          }
      })
      .then(response => response.json())
      .then(result => {
          totalRecords = result.results.row.total;

          // Calculate total pages
          const totalPages = Math.ceil(totalRecords / LIMIT)
          // const totalPages = 1
          let promises = [];

          // Fetch data incrementally
          for (let page = 1; page <= totalPages; page++) {
              let promise = fetch(`${URL}?page=${page}&limit=${LIMIT}`, {
                  headers: {
                      'Accept': '*/*',
                      'Authorization': `Bearer ${token}`
                  }
              })
              .then(response => response.json())
              .then(result => {
                  allResults.push(...result.results.row);
              });

              promises.push(promise);
          }

          console.log("AVANZANDO ....")
          return Promise.all(promises);

        })
      .then(() =>  allResults)
  });
}

// console.log("limit: " + LIMIT)
// const result = getToken();
// const result = doRequest(URL);
// console.log(result);
// console.log(result);

// getToken()


// console.log(0 + " : " + value['codigo'])
// console.log(1 + " : " + value['codigo_comuna'])
// console.log(2 + " : " + value['codigo_region'])
// console.log(3 + " : " + value['combustible'])
// console.log(4 + " : " + value['direccion'])
// console.log(5 + " : " + value['fecha_actualizacion'])
// console.log(6 + " : " + value['hora_actualizacion'])
// console.log(7 + " : " + value['latitud'])
// console.log(8 + " : " + value['logo'])
// console.log(9 + " : " + value['longitud'])
// console.log(10 + " : " + value['marca'])
// console.log(11 + " : " + value['nombre_comuna'])
// console.log(12 + " : " + value['nombre_region'])
// console.log(13 + " : " + value['precio'])
// console.log(14 + " : " + value['razon_social'])
// console.log(15 + " : " + value['tipo_atencion'])
// console.log(16 + " : " + value['total'])
// console.log(17 + " : " + value['unidad_cobro'])

var parseBenci = function(newData, value) {
  const fuelTypeMap = {
    '93': 14, 'A93': 14, 
    'DI': 15, 'ADI': 15, 
    '95': 16, 'A95': 16, 
    'GLP': 17, 
    'GNC': 18,
    '97': 19, 'A97': 19 
  };

  // if (!(value['codigo'] in newData)) {
  //   console.log("ENTRE 1")
  //   newData[value['codigo']] = {}
  // }

  // console.log("COMPROBANDO: " + value['codigo'] + " "+ value['combustible']);

  if (!(value['codigo'] in newData)) {
    console.log("ENTRE 2")
    newData[value['codigo']] = {
      name: value['marca'],  // marca
      direction: value['direccion'], // latitud y longitud
      coordenada: Tools.ddToDms(value['latitud'],value['longitud']), 
      commune: value['nombre_comuna'], 
      autoservicio: value['tipo_atencion'],  // tipo_de_atencion: 2 valores
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

  // Obtener el tipo de combustible en clave numérica agrupada
  let tipoCombustible = fuelTypeMap[String(value['combustible'])];

  // Si el tipo de combustible es válido, sumamos su precio a la clave correspondiente
  if (tipoCombustible !== undefined) {
    let precio = value['precio'];
    newData[value['codigo']].prices[tipoCombustible] = precio;
  }

}

var parseKero= function(newData, value) {
  if (!(value['codigo'] in newData)) {
    newData[value['codigo']] = {
      name: value['marca'],  // marca
      direction: value['direccion'], // latitud y longitud
      coordenada: Tools.ddToDms(value['latitud'],value['longitud']), 
      commune: value['nombre_comuna'], 
      autoservicio: value['tipo_atencion'],  // tipo_de_atencion: 2 valores
      prices: {
          20: value['precio'] //toold.filterInt
      },
      update: new Date( value['fecha_actualizacion'].replace(" ", "T") )
    };
  } else {
    newData[value['codigo']].prices['20'] = value['precio']
  }
}

export default app => {
  // app.factory('BencinaService', function (API_KEY, API_URL, BENCINA_SLUG, KEROSENE_SLUG, $http) {
  app.factory('BencinaService', function (URL_BASE, BENCINA_EXT, KEROSENE_EXT) {

    
    const vm = this;

    vm.bencinaFactory = {};
    
    vm.bencinaFactory.getData = () => {
      return doRequest( URL_BASE + BENCINA_EXT ).then((response) => {
        console.log("resultadosBENCINA")
        console.log(response)
        // let data    = response.data.result;
        let data    = response;
        let newData = {};
        // data.shift(); 

        data.forEach((value, index) => {
          
          if (index) {
            parseBenci(newData, value)
          }
        });

        return doRequest(URL_BASE + KEROSENE_EXT).then((response) => {
          console.log("resultadosKERO")
          console.log(response)
          // let data    = response.data.result;
          let data    = response;
          // data.shift(); 

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
