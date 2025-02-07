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
  .constant('API_URL', 'http://cne.cloudapi.junar.com/api/v2/datastreams/')
  .constant('API_KEY', 'ee48dd8a08c8c762e6faad36ca3bcb676132f18a')
  .constant('BENCINA_SLUG', 'BENCI-EN-LINEA-V2-80280')
  .constant('KEROSENE_SLUG', 'CALEF-EN-LINEA-API-V3')
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
