'use strict';

angular.module('weeklyManageApp')
  .factory('weeklyManageService', ['weeklyHttpService', function (weeklyHttpService) {
    return {
      paging: function (data, success) {
        weeklyHttpService.get('weekly/paging', data).then(success);
      },
      save: function (data, success) {
        weeklyHttpService.post('weekly', data).then(success);
      },
      getWeekly: function (id, success) {
        weeklyHttpService.get('weekly/' + id).then(success);
      },
      deleteWeekly: function (data, success) {
        weeklyHttpService.delete('weekly', data).then(success);
      },
      loadWeeklyTmpl: function (success, createWeekly) {
        var url = createWeekly === true ? 'weekly/tmpl?createWeekly=true' : 'weekly/tmpl';
        weeklyHttpService.get(url).then(success);
      },
      saveTmpl: function (data, success) {
        weeklyHttpService.post('weekly/savetmpl', data).then(success);
      }
    };
  }]);
