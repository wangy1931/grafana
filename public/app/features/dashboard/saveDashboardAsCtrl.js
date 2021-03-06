define([
  'angular',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('SaveDashboardAsCtrl', function($scope, backendSrv, $location, $translate) {

    $scope.init = function() {
      $scope.clone.id = null;
      $scope.clone.editable = true;
      $scope.clone.title = $scope.clone.title + " Copy";
    };

    function saveDashboard(options) {
      return backendSrv.saveDashboard($scope.clone, options).then(function(result) {
        $scope.appEvent('alert-success', [$translate.i18n.i18n_success, $translate.i18n.i18n_saveAs + ' ' + $scope.clone.title]);

        $location.url('/dashboard/db/' + result.slug);

        $scope.appEvent('dashboard-saved', $scope.clone);
        backendSrv.updateSystemId(clone.system);
        backendSrv.post("/api/dashboards/system", {DashId: result.id.toString(), SystemId: clone.system});
        $scope.dismiss();
      });
    }

    $scope.keyDown = function (evt) {
      if (evt.keyCode === 13) {
        $scope.saveClone();
      }
    };

    $scope.saveClone = function() {
      saveDashboard({overwrite: false}).then(null, function(err) {
        if (err.data && err.data.status === "name-exists") {
          err.isHandled = true;

          $scope.appEvent('confirm-modal', {
            title: $translate.i18n.page_dash_save_name,
            text: $translate.i18n.page_dash_override_tip,
            yesText: $translate.i18n.i18n_save_override,
            icon: "fa-warning",
            onConfirm: function() {
              saveDashboard({overwrite: true});
            }
          });
        }
      });
    };
  });

});
