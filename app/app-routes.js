routes.$inject = ['$routeProvider', '$locationProvider'];

export default function routes($routeProvider, $locationProvider) {
    $routeProvider
      .when('/:lang/:mode/', {
        templateUrl: 'view/main4.html',
        controller: 'MainController'
      })
      .otherwise('/es/map/');
}
