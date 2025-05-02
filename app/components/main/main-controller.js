require('./bencina-service');
require('./filters');

import Tools      from '../../util/tools.js';



import communes_en   from './objects/communes_en.js';
import table_en      from './objects/table_en.js';
import divpol_en     from './objects/divpol_en.js';
import comb_en       from './objects/comb_en.js';
import regions_en    from './objects/regions_en.js';
import provinces_en  from './objects/provinces_en.js';
import serv_en       from './objects/serv_en.js';


import comb       from './objects/comb.js';
import divpol     from './objects/divpol.js';
import table     from './objects/table.js';
import serv       from './objects/serv.js';
import regions    from './objects/regions.js';
import provinces  from './objects/provinces.js';
import communes   from './objects/communes.js';

import averages   from './objects/averages.js';

import politicalDivisions from '../../res/politic.js';

export default app => {
  app.controller('MainController', function($filter, BencinaService, $document, $scope, $http, $route, $routeParams, $translate) {

    // Params
    $scope.$routeParams = $routeParams;
    $scope.lang = $routeParams.lang;
    $scope.mode = $routeParams.mode=='map'?1:2;
    $translate.use($routeParams.lang);
    $scope.loadmap = "";
    // Political
    $scope.politicalDivisions = politicalDivisions;
    // Objects     
    
    $scope.averages   = averages;

    if($scope.lang=="en"){
      $scope.divpol     = divpol_en;
      $scope.comb       = comb_en;
      $scope.table      = table_en;
      $scope.communes   = communes_en;
      $scope.provinces  = provinces_en;
      $scope.regions    = regions_en;
      $scope.serv       = serv_en;
    }else{
      $scope.divpol     = divpol;
      $scope.comb       = comb;
      $scope.table      = table;
      $scope.communes   = communes;
      $scope.provinces  = provinces;
      $scope.regions    = regions;
      $scope.serv       = serv;
    }

    if($scope.lang =='es'){
      $scope.csvheader = ['Servicentro', 'Region', 'Provincia', 'Comuna', 'Dirección', 'Coordenadas', 'Tipo de Atención', 'Gasolina 93 $/L', 'Petróleo Diesel $/L', 'Gasolina 95 $/L', 'GLP Vehicular $/m3', 'GNC $/m3', 'Gasolina 97 $/L', 'Kerosene $/L' ,'Úlima Actualización'];  
    }else{
      $scope.csvheader = ['Center service', 'Region', 'Province', 'City', 'Adress', 'Coordinates', 'Type of care', 'Gasoline 93 $/L', 'Diesel Petroleum $/L', 'Gasoline 95 $/L', 'Vehicle LPG $/m3', 'GNC $/m3', 'Gasoline 97 $/L', 'Kerosene $/L' ,'Last update'];
    }

    if($scope.lang=="es"){
      $scope.con = 'Autoservicio';
      $scope.sin = 'Asistido';
    }else{
      $scope.con = 'With selfservice';
      $scope.sin = 'Without selfservice';
    }

    // Regions|Provinces|Communes
    angular.forEach($scope.politicalDivisions, function(provs, reg) {
      $scope.regions.all.push({ id: reg, title: reg});
      $scope.regions.options.push({ id: reg, title: reg});
      angular.forEach(provs, function(communes, prov) {
        $scope.provinces.all.push({ id: prov, title: prov});
        $scope.provinces.options.push({ id: prov, title: prov});
        angular.forEach(communes, function(commune) {
          $scope.communes.all.push({id: commune, title: commune});
          $scope.communes.options.push({id: commune, title: commune});
        });
      });
    });
    // Search Communes in Region
    $scope.findCom = function(filter, regprov){
      var communes = [];
      angular.forEach($scope.politicalDivisions, function(provs, region) {
        if ( (filter == 'r' && regprov == region) || filter == 'p' ) {
          angular.forEach(provs, function(coms, prov) {
            if((filter == 'p' && regprov == prov) || filter == 'r'){
              angular.forEach(coms, function(commune) {
                communes.push(commune);
              });
            }
          });
        }
      });
      return communes;
    };
    // Search Province in Region
    $scope.findProv = function(region){
      var provinces = [];
      angular.forEach($scope.politicalDivisions, function(provs, reg) {
        if ( region == reg ) {
          angular.forEach(provs, function(coms, prov) {
            provinces.push(prov);
          });
        }
      });
      return provinces;
    };
    // Refresh Provinces Options
    $scope.refreshProvinces = function() {
      $scope.provinces.options = [];
      if ($scope.regions.model=="*" ){
        $scope.provinces.options = angular.copy($scope.provinces.all);
        $scope.provinces.options.push({$order: 1,id:'*',title:'Todas'});
      }else{
        var provinces = $scope.findProv($scope.regions.model);
        $scope.provinces.options.push({$order: 1,id:'*',title:'Todas'});
        angular.forEach(provinces, function(province){
          $scope.provinces.options.push({id:province,title:province});
        });
      }
      $scope.provinces.model = $scope.provinces.options[0]['id'];
    };
    // Refresh Communes Options
    $scope.refreshCommunes = function() {
      $scope.communes.options = [];
      if ($scope.provinces.model=="*"){
        $scope.communes.options = angular.copy($scope.communes.all);
        $scope.communes.options.push({$order: 1,id:'*',title:'Todas'});
      }else{
        var communes = $scope.findCom('p', $scope.provinces.model);
        $scope.communes.options.push({$order: 1,id:'*',title:'Todas'});
        angular.forEach(communes, function(commune){
          $scope.communes.options.push({id:commune,title:commune});
        });
      }
      $scope.communes.model = $scope.communes.options[0]['id'];
    };
    // Search Region
    $scope.findregion = function(communeSearch){
      var regionSearch = [];
      angular.forEach($scope.politicalDivisions, function(provs, region) {
        angular.forEach(provs, function(coms, prov) {
          angular.forEach(coms, function(commune) {
            if (communeSearch == commune) {
              regionSearch = region;
            }
          });
        });
      });
      return regionSearch;
    };
    // Search Provinde
    $scope.findprovince = function(communeSearch){
      var provinceSearch = [];
      angular.forEach($scope.politicalDivisions, function(provs, region) {
        angular.forEach(provs, function(coms, prov) {
          angular.forEach(coms, function(commune) {
            if (communeSearch == commune) {
              provinceSearch = prov;
            }
          });
        });
      });
      return provinceSearch;
    };
    $scope.calLastUpdate = function(){
      var srvLast = $filter('ordercustom')($scope.srv,'update',false,$scope);
      $scope.lastupdate = srvLast[0].update;
    };
    // Gets CSV Services 
    $scope.getSrv = function () {
      var srv = [];

      angular.forEach($scope.srvFilter, function(item, key){
        srv.push({
          nombre: item.name,
          region: $scope.findregion(item.commune),
          provincia: $scope.findprovince(item.commune),
          comuna: item.commune,
          direccion: item.direction,
          cordenada: item.coordenada,
          autoservicio: item.autoservicio?$scope.con:$scope.sin,
          'Gasolina 93 $/L': item.prices[14],
          'Petróleo Diesel $/L': item.prices[15], 
          'Gasolina 95 $/L': item.prices[16], 
          'GLP Vehicular $/m3': item.prices[17], 
          'GNC $/m3': item.prices[18], 
          'Gasolina 97 $/L': item.prices[19], 
          'Kerosene $/L': item.prices[20],
          actualizacion: $filter('date')(item.update)
        });
      });
      return srv;
    };
    

    // Gets Services 
    BencinaService.getData().then(function (data) {
      $scope.srv = data;
      // Start Average Calculates
      $scope.averageCalculate();
      $scope.calLastUpdate();
      $scope.averageTableCalc();
      // Start Color Calculate 
      if ($scope.mode == 1) {
        $scope.colorCalculate();
        if ( $scope.loadmap != "" ) {
          $scope.colorMap();
        }
      }
      // Actualizar variables
      setTimeout(function(){
        $scope.$apply();          
      },300);
    });

    // Maps Average Region
    $scope.averageRegion = function (region) {
      var srv = $filter('regions')($scope.srv, region, $scope);
      var calc = {};
      
      // Calcular "todas"
      calc["todas"] = {
        sum: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
        length: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
        average: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
      };
      
      angular.forEach(srv, function(value) {
        var tipoAtencion = value.autoservicio? "autoservicio": "asistido";
        if (!calc[tipoAtencion]) {
          calc[tipoAtencion] = {
            sum: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
            length: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
            average: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
          };
        }
        for (var comb in calc[tipoAtencion].sum) {
          if (value.prices[comb] !== '' && value.prices[comb] != 0) {
            calc[tipoAtencion].sum[comb] += parseFloat(value.prices[comb]);
            calc[tipoAtencion].length[comb]++;

            calc["todas"].sum[comb] += parseFloat(value.prices[comb]);
            calc["todas"].length[comb] ++;
          }
        }
      });

      var respuesta = {}
      for (var s in calc) {
        respuesta[s] = {}
        for (var comb in calc[s].average) {
          calc[s].average[comb] = Math.round(calc[s].sum[comb] / calc[s].length[comb]) || 0;
          respuesta[s][comb] = calc[s].average[comb]
        }
      }

      return respuesta;
    };
    // Maps Average Province
    $scope.averageProvince = function (province) {
      var srv = $filter('provinces')($scope.srv, province, $scope);
      var calc = {};

      calc["todas"] = {
        sum: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
        length: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
        average: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
      };
    
      angular.forEach(srv, function(value) {
        var tipoAtencion = value.autoservicio? "autoservicio": "asistido";
        if (!calc[tipoAtencion]) {
          calc[tipoAtencion] = {
            sum: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
            length: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
            average: { 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0 },
          };
        }
        for (var comb in calc[tipoAtencion].sum) {
          if (value.prices[comb] !== '' && value.prices[comb] != 0) {
            calc[tipoAtencion].sum[comb] += parseFloat(value.prices[comb]);
            calc[tipoAtencion].length[comb]++;

            calc["todas"].sum[comb] += parseFloat(value.prices[comb]);
            calc["todas"].length[comb] ++;
          
          }
        }
      });
      
      var respuesta = {}
      for (var s in calc) {
        respuesta[s] = {};
        for (var comb in calc[s].average) {
          calc[s].average[comb] = Math.round(calc[s].sum[comb] / calc[s].length[comb]) || 0;
          respuesta[s][comb] = calc[s].average[comb]
        }
      }

      return respuesta;
    };
    // Maps Average Communes
    $scope.averageCalculate = function () {
      // Compile Prices
      angular.forEach($scope.srv, function(value) {
        var commune = value.commune;
        var serv = value.autoservicio? "autoservicio": "asistido";

        if (!$scope.averages.averages.communes[commune]) {
          $scope.averages.averages.communes[commune] = {};
        }
      
        ["autoservicio", "asistido", "todas"].forEach(function(serviceType) {
          if (!$scope.averages.averages.communes[commune][serviceType]) {
            $scope.averages.averages.communes[commune][serviceType] = { 14: [], 15: [], 16: [], 17: [], 18: [], 19: [], 20: [] };
          }
        });

        for (var comb in $scope.averages.averages.communes[commune][serv]) {
          if (!Array.isArray($scope.averages.averages.communes[commune][serv][comb])) {
            $scope.averages.averages.communes[commune][serv][comb] = [$scope.averages.averages.communes[commune][serv][comb]];
          }
          $scope.averages.averages.communes[commune][serv][comb].push(value.prices[comb]);

          if (!Array.isArray($scope.averages.averages.communes[commune]['todas'][comb])) {
            $scope.averages.averages.communes[commune]['todas'][comb] = [$scope.averages.averages.communes[commune]['todas'][comb]];
          }
          // Agregar el mismo precio en "todas"
          $scope.averages.averages.communes[commune]['todas'][comb].push(value.prices[comb]);
        }

      });
      // Calculate Commune Averages 
      for (var commune in $scope.averages.averages.communes) {
        for (var serv in $scope.averages.averages.communes[commune]) {
          for (var comb in $scope.averages.averages.communes[commune][serv]) {
            var pricesArray = $scope.averages.averages.communes[commune][serv][comb]
            if(Array.isArray(pricesArray)){
              var prices = Array.isArray(pricesArray)? pricesArray.filter(Number) : pricesArray;
              var sum = prices.reduce((a, b) => a + parseFloat(b), 0);
              var average = Math.round(sum / prices.length) || 0;
              $scope.averages.averages.communes[commune][serv][comb] = average;
            }
          }
        }
      }
      // Calculate Regions Averages
      for (var region in $scope.regions.options) {
        var average = $scope.averageRegion($scope.regions.options[region].id);
        $scope.averages.averages.regions[$scope.regions.options[region].title] = average;
      }
      // Calculate Provinces Averages
      for (var province in $scope.provinces.options) {
        var average = $scope.averageProvince($scope.provinces.options[province].id);
        $scope.averages.averages.provinces[$scope.provinces.options[province].title] = average;
      }     
    };
    
    // Calculate Region/Province/Commune Colors
    $scope.colorCalculate = function () {      
      for (var division in $scope.averages.averages) {
        var scaleValues = {}, variance = {}, max = {}, min = {};
        
        // Inicializar 
        for (var serv in $scope.serv.options) { 
          var servType = $scope.serv.options[serv].title.toLowerCase()

          scaleValues[servType] = {};
          variance[servType] = {};
          max[servType] = {};
          min[servType] = {};
          
          for (var comb = 14; comb <= 20; comb++) {
            scaleValues[servType][comb] = [];
            variance[servType][comb] = 0;
            max[servType][comb] = 0;
            min[servType][comb] = 0;
          }
        }
    
        // Recolect Averages 
        for (var item in $scope.averages.averages[division]) {
          for (var servType in $scope.averages.averages[division][item]) { 
            for (var comb in scaleValues[servType]) {
              if ($scope.averages.averages[division][item][servType][comb] != 0) {
                scaleValues[servType][comb].push($scope.averages.averages[division][item][servType][comb]);
              }
            }
          }
        }
        // Order Array
        for (var servType in scaleValues) {
          for (var comb in scaleValues[servType]) {
            scaleValues[servType][comb].sort(function(a, b) { return a - b; });
          }
        }
        // Calculate Variance 
        for (var servType in scaleValues) {
          for (var comb in scaleValues[servType]) {
            if (scaleValues[servType][comb].length > 0) {
              min[servType][comb] = scaleValues[servType][comb][0];
              max[servType][comb] = scaleValues[servType][comb][scaleValues[servType][comb].length - 1];
              variance[servType][comb] = (max[servType][comb] - min[servType][comb]) / 10;
            }
          }
        }
        // Save Min and Max
        $scope.averages.min[division] = min;
        $scope.averages.max[division] = max;

        // Calculate color
        for (var item in $scope.averages.averages[division]) {
          if (!$scope.averages.colors[division][item]) {
            $scope.averages.colors[division][item] = {};
          }
          
          for (var servType in $scope.averages.averages[division][item]) {
            if (!$scope.averages.colors[division][item][servType]) {
              $scope.averages.colors[division][item][servType] = {};
            }
            
            for (var comb in variance[servType]) {
              var value = $scope.averages.averages[division][item][servType][comb];
              var start = min[servType][comb];
              var end = min[servType][comb] + variance[servType][comb];
              var color = '#FFF';
              
              if (value != 0) {
                for (var i = 0; i < 10; i++) {
                  if (value >= start && value <= end) {
                    color = i;
                    break;
                  }
                  start = end;
                  end = Math.round((start + variance[servType][comb]) * 10) / 10;
                }
              }
              
              $scope.averages.colors[division][item][servType][comb] = color;
            }
          }
        }
      } 
    };

  // Maps Colorate
    $scope.colorGroup = function(type, id, item) {
      // Colorate Map
      var colors = [
        "#388539",
        "#3DAD3F",
        "#44D746",
        "#AEFF61",
        "#FFFD50",
        "#FDD54B",
        "#FCAE47",
        "#FB8444",
        "#FA3A43",
        "#D7363E"
      ];

      var select = $scope.averages.maps[type][id];
      var color = '#FFF';
      
      if ($scope.averages.colors[type][select] && $scope.averages.colors[type][select] != undefined) {
        var servType = $scope.serv.options[$scope.serv.model].title.toLowerCase()
        var comb = $scope.comb.model; // Seleccionar el tipo de combustible actual

        if ($scope.averages.colors[type][select][servType] && $scope.averages.colors[type][select][servType][comb] !== '#FFF') {
          color = colors[$scope.averages.colors[type][select][servType][comb]];
        }
      }
  
      if (type === 'communes') {
        $(item).css('fill', color);
      } else {
        $(item).find('path').css('fill', color);
      }
    };

    $scope.averageMin = 0;
    $scope.averageMax = 0;
    $scope.averageMinMax = function() {
      var divpol;
      switch ($scope.divpol.model) {
        case 'regiones':
          divpol = 'regions';
          break;
        case 'provincias':
          divpol = 'provinces';
          break;
        case 'comunas':
          divpol = 'communes';
          break;
      }
      var servType = $scope.serv.options[$scope.serv.model].title.toLowerCase()
      var comb = $scope.comb.model

      // $scope.averageMin = $scope.averages.min[divpol][servType][$scope.comb.model];
      // $scope.averageMax = $scope.averages.max[divpol][servType][$scope.comb.model]; 
      $scope.averageMin = ($scope.averages.min[divpol] && $scope.averages.min[divpol][servType] && $scope.averages.min[divpol][servType][comb] !== undefined)
                          ? $scope.averages.min[divpol][servType][comb]
                          : 0;

      $scope.averageMax = ($scope.averages.max[divpol] && $scope.averages.max[divpol][servType] && $scope.averages.max[divpol][servType][comb] !== undefined)
                          ? $scope.averages.max[divpol][servType][comb]
                          : 0;

  };

    $scope.colorMap = function() {
      // Hover Map
      $scope.averageMinMax();
      $scope.hoverMap();
      // Preparing Mapper Commune 
      for ( var commune in $scope.communes.all ){
        var name = $scope.communes.all[commune].title;
        name = Tools.removeDiacritics(name);
        // Replace spaces by underscore and remove ' (ex. O’Higgins --> OHiggins)
        var key = name.replace(/\s+/g, '_').replace(/’/g, '');
        $scope.averages.maps.communes[key] = $scope.communes.all[commune].title;
      }
      // Each and Colorate for type
      $('#svgmap g[data-region]').each(function(index, el) {
        var regionId = $(el).data('region');
        $scope.colorGroup('regions', regionId, el);
      });
      $('#svgmap g[data-province]').each(function(index, el) {
        var provinceId = $(el).data('province');
        $scope.colorGroup('provinces', provinceId, el);
      });
      $('#svgmap path[data-commune]').each(function(index, el) {
        var communeId = $(el).data('commune');
        $scope.colorGroup('communes', communeId, el);
      });
    };
    // Maps Tooltip
    $scope.itemselect = 'Name';
    $scope.averageselect = '000';
    $scope.hoverMap = function () {
      zoom();
      // Tooltip Hide Conditions
      $('html').click(function() {
        var $toltip = $('.toltip');
        if ( $toltip.hasClass('active') ) {
          $toltip.removeClass('active').hide();
        }
      });
      $('.header, #svg-pan-zoom-controls').mouseover(function(){
        $('.toltip').hide();
      });
      // Mouse Over Regions
      $('#svgmap g[data-region] path').mouseover(function (e) {
        $(this).closest('g[data-region]').find('path').css('fill', '#1576e2');
      }).mouseout(function(e) {
        var regionGroup = $(this).closest('g[data-region]');
        var regionId = $(regionGroup).data('region');
        $scope.colorGroup('regions', regionId, regionGroup);
      });
      // Click on Region
      $('#svgmap g[data-region] path').click(function(e){
        e.stopPropagation();
        var group = $(this).closest('g[data-region]');
        var regionId = $(group).data('region');
        var comb = $scope.comb.model;
        var servType = $scope.serv.options[$scope.serv.model].title.toLowerCase()
        $scope.$apply(function(){
          $scope.itemselect = $scope.averages.maps.regions[regionId];
          $scope.itemselectType = 'region';
          if ($scope.averages.averages.regions[$scope.itemselect] &&
            $scope.averages.averages.regions[$scope.itemselect][servType] &&
            $scope.averages.averages.regions[$scope.itemselect][servType][comb] !== undefined) {
            $scope.averageselect = $scope.averages.averages.regions[$scope.itemselect][servType][comb];
          } else {
            $scope.averageselect = 0;
          }
        });
        var left = e.pageX>810?810:e.pageX;
        $('.toltip').addClass('active').css({
            top: e.pageY - $('.toltip').height() - 5,
            left: left - 30
        }).show();
        if (left!=e.pageX) {
          $('.toltip').addClass('maxleft');
        }else{
          $('.toltip').removeClass('maxleft');
        }
      });
      // Mouse Over Province
      $('#svgmap g[data-province] path').mouseover(function (e) {
        $(this).closest('g[data-province]').find('path').css('fill', '#1576e2');
      }).mouseout(function(e) {
        var provinceGroup = $(this).closest('g[data-province]');
        var provinceId = $(provinceGroup).data('province');
        $scope.colorGroup('provinces', provinceId, provinceGroup);
      });
      // Click on Province
      $('#svgmap g[data-province] path').click(function(e){
        e.stopPropagation();
        var group = $(this).closest('g[data-province]');
        var provinceId = $(group).data('province');
        var comb = $scope.comb.model;
        var servType = $scope.serv.options[$scope.serv.model].title.toLowerCase()
        $scope.$apply(function(){
          $scope.itemselect = $scope.averages.maps.provinces[provinceId];
          $scope.itemselectType = 'province';
          if ($scope.averages.averages.provinces[$scope.itemselect] &&
            $scope.averages.averages.provinces[$scope.itemselect][servType] &&
            $scope.averages.averages.provinces[$scope.itemselect][servType][comb] !== undefined) {
            $scope.averageselect = $scope.averages.averages.provinces[$scope.itemselect][servType][comb];
          } else {
            $scope.averageselect = 0;
          }
        });
        var left = e.pageX>810?810:e.pageX;
        $('.toltip').addClass('active').css({
            top: e.pageY - $('.toltip').height() - 5,
            left: left - 30
        }).show();
        if (left!=e.pageX) {
          $('.toltip').addClass('maxleft');
        }else{
          $('.toltip').removeClass('maxleft');
        }
      });
      // Mouse Over Commune
      $('#svgmap path[data-commune]').mouseover(function (e) {
        $(this).css('fill', '#1576e2');
      }).mouseout(function(e) {
        var communeId = $(this).data('commune');
        $scope.colorGroup('communes', communeId, $(this));
      });
      // Click on Commune
      $('#svgmap path[data-commune]').click(function(e){
        e.stopPropagation();
        var communeId = $(this).data('commune');
        var comb = $scope.comb.model;
        var servType = $scope.serv.options[$scope.serv.model].title.toLowerCase()
        $scope.$apply(function(){
          $scope.itemselect = $scope.averages.maps.communes[communeId];
          $scope.itemselectType = 'commune';
          if ($scope.averages.averages.communes[$scope.itemselect] &&
            $scope.averages.averages.communes[$scope.itemselect][servType] &&
            $scope.averages.averages.communes[$scope.itemselect][servType][comb] !== undefined){
            $scope.averageselect = $scope.averages.averages.communes[$scope.itemselect][servType][comb];
          }else{
            // $scope.itemselect = $scope.averages.maps.communes[communeId];
            // $scope.itemselectType = 'commune';
            $scope.averageselect = 0;
          }
        });
        var left = e.pageX>810?810:e.pageX;
        $('.toltip').addClass('active').css({
            top: e.pageY - $('.toltip').height() - 5,
            left: left - 30
        }).show();
        if (left!=e.pageX) {
          $('.toltip').addClass('maxleft');
        }else{
          $('.toltip').removeClass('maxleft');
        }
      });

    };
    // Table Select Averages
    $scope.averagetable = 0;
    $scope.$watch('regions.model', function(newValue, oldValue) {
      $scope.averageTableCalc();
    });
    $scope.$watch('provinces.model', function(newValue, oldValue) {
      $scope.averageTableCalc();
    });
    $scope.$watch('communes.model', function(newValue, oldValue) {
      $scope.averageTableCalc();
    });
    $scope.averageTableCalc = function () {
      var average;
      if ($scope.regions.model != '*') {
        if ($scope.averages.averages.regions[$scope.regions.model] == undefined) {
          average = 0;
        } else {
          average = $scope.averages.averages.regions[$scope.regions.model][$scope.comb.model];
        }
      }
      if ($scope.provinces.model != '*') {
        if ($scope.averages.averages.provinces[$scope.provinces.model] == undefined) {
          average = 0;
        } else {
          average = $scope.averages.averages.provinces[$scope.provinces.model][$scope.comb.model];
        }
      }
      if ($scope.communes.model != '*') {
        if ($scope.averages.averages.communes[$scope.communes.model] == undefined) {
          average = 0;
        } else {
          average = $scope.averages.averages.communes[$scope.communes.model][$scope.comb.model];
        }
      }
      $scope.averagetable = average;
    };
    // Change Mode
    $scope.changeMode = function (mode) {
      // Set default values for dropdowns
      $scope.regions.model = '*';         // Default to all regions
      $scope.provinces.model = '*';       // Default to all provinces
      $scope.communes.model = '*';        // Default to all communes
      $scope.comb.model = '14';          // Default comb type.  Use the key '14', '15' etc.
      $scope.serv.model = '0';          // Default serv

      $scope.divpol.model = 'regiones';  // Default to 'regiones'

      // Initialize the options
      // $scope.refreshProvinces;
      // $scope.refreshCommunes;
      
      $route.updateParams({mode: mode==1?'map':'table'});
    };
    $scope.$watch('comb.model', function(newValue, oldValue) {
      if ($scope.loadmap != "") {
        $scope.colorMap();
      }
    });
    $scope.$watch('divpol.model', function(newValue, oldValue) {
      if ($scope.loadmap != "") {
        $scope.colorMap();
      }
    });
    $scope.$watch('serv.model', function(newValue, oldValue) {
      if ($scope.loadmap != "") {
        $scope.colorMap();
      }
    });
    // Load Map
    $scope.$watch('loadmap', function(newValue, oldValue) {
      if ($scope.loadmap != "") {
        $scope.colorMap();
      }
    });
    // Change Model from map
    if ($routeParams.type != undefined && $scope.mode == 2) {
      $scope.comb.model = $routeParams.comb;
      switch($routeParams.type) {
        case 'region':
          $scope.regions.model = $routeParams.value;
          $scope.refreshProvinces();
        break;
        case 'province':
          $scope.provinces.model = $routeParams.value;
          $scope.refreshCommunes();
        break;
        case 'commune':
          $scope.communes.model = $routeParams.value;
        break;
      }
    }
  });
};