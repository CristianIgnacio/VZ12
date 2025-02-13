import Tools from '../../util/tools.js';

var URL = "https://apim.ea.cne.cl:8244/rendimiento_vehicular/v1/";

var TOKEN = "eyJ4NXQiOiJPREJtTVRVMFpqSmpPREprTkdZMVpUaG1ZamsyWVRZek56UmpZekl6TVRCbFlqRTBNV0prWTJJeE5qZzNPRGRqWVdRNVpXWmhOV0kwTkRBM1pqTTROUSIsImtpZCI6Ik9EQm1NVFUwWmpKak9ESmtOR1kxWlRobVlqazJZVFl6TnpSall6SXpNVEJsWWpFME1XSmtZMkl4TmpnM09EZGpZV1E1WldaaE5XSTBOREEzWmpNNE5RX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIzZThjN2RmYS00M2Y5LTQ4ZGYtOGEzYi0yODNmNTU5YzE2MzIiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6InFFbGRtRl9oeTZZdHVhWWdRV2JXeUpkblFCWWEiLCJuYmYiOjE3Mzg5MzM2OTgsImF6cCI6InFFbGRtRl9oeTZZdHVhWWdRV2JXeUpkblFCWWEiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczovL2FwaW0uZWEuY25lLmNsOjk0NDQvb2F1dGgyL3Rva2VuIiwiZXhwIjoxNzM4OTM3Mjk4LCJpYXQiOjE3Mzg5MzM2OTgsImp0aSI6ImMwYThjYTFlLTkyY2QtNGQyMi05YzBhLWRmMzJmZmQxNzAzYiIsImNsaWVudF9pZCI6InFFbGRtRl9oeTZZdHVhWWdRV2JXeUpkblFCWWEifQ.bBgi92LyNCPSAkxmjg64ie7GWnPFJyexa_qN_0svrJteW2YyKnfDm1OYbuFW7Gq-V1kUWTImw9Dxlr8REGdBj6JK3uekdkyrj1kISWj_uEDsSKYBOE5F1fSAQ9mqOCdMYrxT5RMpEvn6rCfzaRVU8vLzGU4M4T32VwOekouUzS_jpvO3WuVocjirBtxvuVX5b0wxNAfnSzOdHRRmqk6EH663tRlZmx0Yqdss-Oj74-7gDrNXPj0Cx2woWcO99St36rMXpYY8gbCsUwcUdAtl2acEfB9JoAhUzBXwF3YEecynLnXJJx9diRmpGyb7FvWkZ1vhs_OZI98k3G3Q0oqC4Q"

var LIMIT = "100";

function doRequest() {
  let totalRecords = 0;
  let allResults = [];

  // Read total records
  return fetch(`${URL}?page=1&limit=1`, {
      headers: {
          'Accept': '*/*',
          'Authorization': `Bearer ${TOKEN}`
      }
  })
  .then(response => response.json())
  .then(result => {
      totalRecords = result.results.row.total;

      // Calculate total pages
      const totalPages = Math.ceil(totalRecords / 1000);
      let promises = [];

      /// Fetch data incrementally
      for (let page = 1; page <= totalPages; page++) {
          let promise = fetch(`${URL}?page=${page}&limit=${LIMIT}`, {
              headers: {
                  'Accept': '*/*',
                  'Authorization': `Bearer ${TOKEN}`
              }
          })
          .then(response => response.json())
          .then(result => {
              allResults.push(...result.results.row);
          });

          promises.push(promise);
      }

      return Promise.all(promises);
  })
  .then(() => allResults);
}

const result = doRequest();
console.log(result);

var parseBenci = function(newData, value) {
  if (!(value[0] in newData)) {
    newData[value[0]] = {}
  }

  newData[value[0]] = {
    name: value[10], 
    direction: value[3]+' '+value[4], 
    coordenada: Tools.ddToDms(value[20],value[21]), 
    commune: value[6], 
    autoservicio: value[25], 
    prices: {
      14: Tools.filterInt(value[14]), 
      15: Tools.filterInt(value[16]), 
      16: Tools.filterInt(value[17]), 
      17: Tools.filterInt(value[18]), 
      18: Tools.filterInt(value[19]), 
      19: Tools.filterInt(value[15]), 
      20: 0,
    },
    update: new Date( value[1].replace(" ", "T") )
  };
}

var parseKero= function(newData, value) {
  if (!(value[0] in newData)) {
    newData[value[0]] = {
      name: value[10], 
      direction: value[3]+' '+value[4], 
      coordenada: Tools.ddToDms(value[19],value[20]), 
      commune: value[6], 
      autoservicio: value[24], 
      prices: {
          20: Tools.filterInt(value[14])
      },
      update: new Date( value[1].replace(" ", "T") )
    };
  } else {
    newData[value[0]].prices['20'] = Tools.filterInt(value[14])
  }

  
}

export default app => {
  app.factory('BencinaService', function (API_KEY, API_URL, BENCINA_SLUG, KEROSENE_SLUG, $http) {
    
    const vm = this;

    vm.bencinaFactory = {};
    
    vm.bencinaFactory.getData = () => {
      return $http.get( API_URL + BENCINA_SLUG + '/data.ajson/?auth_key=' + API_KEY ).then((response) => {
        let data    = response.data.result;
        let newData = {};
        data.shift(); 

        data.forEach((value, index) => {
          if (index) {
            parseBenci(newData, value)
          }
        });

        return $http.get( API_URL + KEROSENE_SLUG + '/data.ajson/?auth_key=' + API_KEY ).then((response) => {
          let data    = response.data.result;
          data.shift(); 

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
