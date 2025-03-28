export default app => {
  app.filter('comb', function() {
    return function(input, comb) {
      var out = [];
      angular.forEach(input, function(item) {
        if ( item.prices[comb] != "" )
          out.push(item);
      })
      return out;
    }
  });
  // Filter Serv
  app.filter('serv', function() {
    return function(input, serv) {
      var out = [];
      angular.forEach(input, function(item) {
        if ( serv == 1 ){
          if(item.autoservicio == true){
            out.push(item);
          }
        }
        else if(serv == 2){
          if(item.autoservicio == false){
            out.push(item);
          }
        }else{
          out.push(item);
        }
      })
      return out;
    }
  });
  // Filter Communes
  app.filter('communes', function() {
    return function(input, commune) {
      var out = [];
      angular.forEach(input, function(item) {
        if ( commune != "*" ){
          if(item.commune == commune)
            out.push(item);
        }else{
          out.push(item);
        }
      })
      return out;
    }
  });
  // Filter Regions
  app.filter('regions', function() {
    return function(input, regions, $scope) {
      var out = [];
      angular.forEach(input, function(item) {
        if ( regions != "*" ){
          var communes = $scope.findCom('r', regions);
          if(communes.indexOf(item.commune)>-1)
            out.push(item);
        }else{
          out.push(item);
        }
      })
      return out;
    }
  });
  // Filter Provinces
  app.filter('provinces', function() {
    return function(input, provinces, $scope) {
      var out = [];
      angular.forEach(input, function(item) {
        if ( provinces != "*" ){
          var communes = $scope.findCom('p', provinces);
          if(communes.indexOf(item.commune)>-1)
            out.push(item);
        }else{
          out.push(item);
        }
      })
      return out;
    }
  });
  // Filter OrderCustom
  app.filter('ordercustom', function() {
    return function(input, filter, reverse, $scope) {
      function orderValue(item) {
        switch(filter) {
          case 'prices':
            return item.prices[$scope.comb.model];
          break;
          default:
            return item[filter];
        }
      }
      var out = [];
      angular.forEach(input, function(item) {
        out.push(item);
      });
      out.sort(function (a, b) {
        if (orderValue(a) < orderValue(b)) {
          return reverse?-1:1;
        }
        if (orderValue(a) > orderValue(b)) {
          return reverse?1:-1;
        }
        return 0;
      });
      return out;
    }
  });
};
