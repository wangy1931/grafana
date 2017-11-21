define([
  'angular',
  'lodash'
], function(angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('HostDetailCtrl', function ($scope, backendSrv, $location, hostSrv, contextSrv) {
    $scope.init = function() {
      var id = $location.search().id;
      $scope.id = id;
      backendSrv.alertD({url:'/cmdb/host'}).then(function(response) {
        $scope.list = response.data;
      });
      backendSrv.alertD({url:'/cmdb/host?id='+id}).then(function(response) {
        $scope.detail = response.data;
        $scope.tags = angular.copy(response.data.tags);
        $scope.cpuCount = _.countBy(response.data.cpu);
        $scope.detail.isVirtual = $scope.detail.isVirtual ? '是' : '否';
        $scope.detail = _.cmdbInitObj($scope.detail);
      });
    };

    $scope.init();
  });
});