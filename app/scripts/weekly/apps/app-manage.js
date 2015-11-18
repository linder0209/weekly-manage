'use strict';

/**
 * 创建Angular App
 * */
angular.module('weeklyManageApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/weekly/paging.html',
        controller: 'WeeklyPagingCtrl'
      })
      .when('/weekly', {
        templateUrl: 'views/weekly/weekly.html',
        controller: 'WeeklyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
