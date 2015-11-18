'use strict';

angular.module('weeklyManageApp')
  .directive('linkActive', ['$location', function ($location) {
    return {
      restict: 'A',
      link: function (scope, element, attrs) {
        scope.location = $location;
        scope.$watch('location.path()', function (pathValue) {
          element.children().each(function (index, item) {
            var $item = $(item);
            var hash = $item.find('a').attr('ng-href');
            if (hash && hash.substring(1) === pathValue) {
              $item.addClass(attrs.linkActive);
            } else {
              $item.removeClass(attrs.linkActive);
            }
          });
        });
      }
    };
  }]);
