import Tools from '../../util/tools.js';

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
