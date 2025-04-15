require('!style!css!sass!./css/index.sass');
require('./util/angular-locale_es.min.js');
require('./util/tools.js');
require('./util/dirPagination.js');
require('bootstrap-webpack');
require('angular-selectize2');
require('angular-loading-bar');
require('angular-route');
require('angular-sanitize');
require('ng-csv');
require('angular-translate');
require('font-awesome-webpack');

import angular from 'angular';
import components from './components';
import routing from './app-routes';
import translate from './app-i18n';

let paginationTemplate = require('ngtemplate!./template/pagination.html');

var CORS = "https://cors-anywhere.herokuapp.com/"

var app = angular.module('app', [ 
    'ngRoute',
    'selectize',
    'angular-loading-bar',
    'ngSanitize',
    'ngCsv', 
    'angularUtils.directives.dirPagination',
    'pascalprecht.translate'
  ])
  .config(routing)
  .config(translate)
  .constant('URL_TOKEN', CORS + 'https://apim.ea.cne.cl:9444/oauth2/token')
  .constant('URL_BASE', 'https://apim.ea.cne.cl:8244/combustible_en_linea/v1/')
  .constant('BENCINA_EXT', 'bencina')
  .constant('KEROSENE_EXT', 'kerosene')
  .constant('OAUTH_KEY', 'Basic cUVsZG1GX2h5Nll0dWFZZ1FXYld5SmRuUUJZYTowWFFadXhZZDVHV0FadVZKazJBM2t3dzhCMXNh')
  .constant('LIMIT_REQUEST', 1000)
  .config((paginationTemplateProvider)=>{paginationTemplateProvider.setPath(paginationTemplate);})
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) { cfpLoadingBarProvider.includeSpinner = false; }])
  .config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://cdn*.junar.com/**',
      'http://junar-cdn-brandings.s3.amazonaws.com/**',
      'http://energiaabierta.cl/**'
    ]);

  });
  

components(app);
