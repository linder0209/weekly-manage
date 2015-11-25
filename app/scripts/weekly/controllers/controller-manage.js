'use strict';

/**
 *  周报管理 Controller
 * */

angular.module('weeklyManageApp').controller('WeeklyPagingCtrl',
  function ($scope, $location, $uibModal, weeklyManageService) {
    //初始化记录
    $scope.items = [];
    $scope.grid = {
      checked: false
    };

    $scope.page = {currentPage: 1};
    $scope.maxSize = 5;
    $scope.itemsPerPage = 50;

    $scope.loadPageData = function () {
      var params = {
        currentPage: $scope.page.currentPage,
        itemsPerPage: $scope.itemsPerPage
      };
      if ($scope.searchContent) {
        params.searchContent = $scope.searchContent;
      }
      weeklyManageService.paging({params: params}, function (data) {
        if (data.success === true) {
          $scope.items = data.dataPage.items;
          $scope.totalItems = data.dataPage.totalItems;
        }
      });
    };
    $scope.loadPageData();

    $scope.search = function () {
      $scope.loadPageData();
    };

    /**
     * 包括删除一条或多条记录
     * @param item
     */
    $scope.delete = function (item) {
      var json;
      if (!item) {//没有传参数，表示执行的是删除多条记录
        if ($scope.grid.checked === false) {
          $uibModal.open({
            templateUrl: '../views/templates/alert-modal.html',
            controller: 'AlertModalCtrl',
            resolve: {
              config: function () {
                return {
                  modalContent: '请至少选择一条记录！'
                };
              }
            }
          });
          return;
        }
        var ids = [];
        angular.forEach($scope.items, function (item, index) {
          if (item.checked === true) {
            ids.push(item.id);
          }
        });
        json = {params: {ids: ids}};
      } else {
        json = {params: {ids: [item.id]}};
      }
      var modalInstance = $uibModal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {
              modalContent: '确定要删除所选的记录吗？'
            };
          }
        }
      });
      modalInstance.result.then(function () {
        weeklyManageService.deleteWeekly(json, function (data) {
          if (data.success === true) {
            $scope.loadPageData();
            if (!item) {
              $scope.grid.checked = false;
            }
          }
        });
      });
    };

    $scope.selectAll = function () {
      angular.forEach($scope.items, function (item, index) {
        item.checked = $scope.grid.checked;
      });
    };

    $scope.selectItem = function () {
      var checked = false;
      angular.forEach($scope.items, function (item, index) {
        if (item.checked) {
          checked = true;
          return false;
        }
      });
      $scope.grid.checked = checked;
    };

    //导出数据
    /*$scope.importData = function(item){
      var id = item.id;
      weeklyManageService.deleteWeekly(json, function (data) {
        if (data.success === true) {
          $scope.loadPageData();
          if (!item) {
            $scope.grid.checked = false;
          }
        }
      });
      importData
    };*/
  })
  //新建或修改周报
  .controller('WeeklyCtrl',
    function ($scope, $sce, $location, weeklyManageService) {
      $scope.weeklyForm = {
        id: undefined,
        weeklyTitle: '产品技术部-PUX用户体验周报',
        startDate: '',
        endDate: '',
        summary: {
          week: '',
          nextWeek: ''
        },
        weeklyContent: '',
        weeklyFooter: ''
      };

      var path = $location.path();
      if (path.endsWith('weekly')) {//添加
        weeklyManageService.loadWeeklyTmpl(function (data) {
          if (data.success === true) {
            $scope.weeklyForm.startDate = data.startDate;
            $scope.weeklyForm.endDate = data.endDate;
            $scope.weeklyForm.weeklyContent = $sce.trustAsHtml(data.weeklyContent);
            $scope.weeklyForm.weeklyFooter = $sce.trustAsHtml(data.weeklyFooter);
          }
        }, true);
      } else {//修改
        var id = path.substring(path.lastIndexOf('/') + 1);
        weeklyManageService.getWeekly(id, function (data) {
          if (data.success === true) {
            var item = data.item;
            angular.extend($scope.weeklyForm, item);
            $scope.weeklyForm.weeklyContent = $sce.trustAsHtml(item.weeklyContent);
            $scope.weeklyForm.weeklyFooter = $sce.trustAsHtml(item.weeklyFooter);
          }
        });
      }

      $scope.save = function () {
        var weeklyForm = {
          id: $scope.weeklyForm.id,
          weeklyTitle: $scope.weeklyForm.weeklyTitle,
          startDate: $('.js-start-date').text(),
          endDate: $('.js-end-date').text(),
          summary: {
            week: $('.js-summary-week').html(),
            nextWeek: $('.js-summary-nextweek').html()
          },
          weeklyContent: $('.js-weekly-content').html(),
          weeklyFooter: $('.js-weekly-footer').html()
        };

        weeklyManageService.save(weeklyForm, function (data) {
          if (data.success === true) {
            $location.path('/');
          }
        });
      };
    })
  //周报模板管理
  .controller('TmplCtrl',
    function ($scope, $sce, $uibModal, weeklyManageService) {
      $scope.tmplForm = {
        weeklyContent: '',
        weeklyFooter: ''
      };

      $scope.weeklyTmpl = {
        weeklyContent: '',
        weeklyFooter: ''
      };

      weeklyManageService.loadWeeklyTmpl(function (data) {
        if (data.success === true) {
          $scope.tmplForm.weeklyContent = data.weeklyContent;
          $scope.tmplForm.weeklyFooter = data.weeklyFooter;
        }
      });
      $scope.$watch('tmplForm.weeklyContent', function (newValue, oldValue) {
        $scope.weeklyTmpl.weeklyContent = $sce.trustAsHtml(newValue);
      });

      $scope.$watch('tmplForm.weeklyFooter', function (newValue, oldValue) {
        $scope.weeklyTmpl.weeklyFooter = $sce.trustAsHtml(newValue);
      });

      //保存模板
      $scope.save = function () {
        weeklyManageService.saveTmpl($scope.tmplForm, function (data) {
          if (data.success === true) {
            $uibModal.open({
              templateUrl: '../views/templates/alert-modal.html',
              controller: 'AlertModalCtrl',
              resolve: {
                config: function () {
                  return {
                    modalContent: '保存成功！'
                  };
                }
              }
            });
          }
        });
      };
    });

