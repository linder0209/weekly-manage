'use strict';

/**
 * 通用 Confirm 模态窗口 Controller
 * @class ConfirmModalCtrl
 * */
angular.module('weeklyManageApp')
  .controller('ConfirmModalCtrl', function ($scope, $uibModalInstance, config) {
    $scope.modalTitle = config.modalTitle;
    $scope.modalContent = config.modalContent;
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })
  /**
   * 通用 Alert 模态窗口 Controller
   * @class AlertModalCtrl
   * */
  .controller('AlertModalCtrl', function ($scope, $uibModalInstance, config) {
    $scope.modalTitle = config.modalTitle;
    $scope.modalContent = config.modalContent;
    $scope.hideClose = config.hideClose;
    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
