define([
  'angular',
  'lodash',
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');
  module.controller('ServiceAgentCtrl', function ($scope, backendSrv, datasourceSrv, contextSrv, metricSrv, staticSrv) {
    var NO_DATA = 2;
    var GET_DATA = 0;
    $scope.init = function() {
      $scope.getService();
    };

    $scope.getServiceStatus = function(services) {
      _.each(services, function (service,index) {
        var query = [{
          "metric": contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + service.id + ".state",
          "aggregator": "sum",
          "downsample": "1s-sum",
        }];
        var time = 'now-5m';
        datasourceSrv.getHostStatus(query, time).then(function(res) {
          if(res.status > 0) {
            $scope.services[index].status = NO_DATA;
          } else {
            $scope.services[index].status = GET_DATA;
          }
        });
      });
    };

    $scope.getService = function() {
      staticSrv.getInstallation('services').then(function(result) {
        result = JSON.stringify(result, true);
        result = _.replace(result, /@/gi, ';');
        $scope.services = JSON.parse(result).service;
        $scope.getServiceStatus($scope.services);
      });
    };

    $scope.showDetail = function(detail) {
      metricSrv.getMetricInfo({
        type: '服务',
        subtype: detail.id,
        kpi: 1
      }).then(function(res) {
        detail.metrics = res.data || [];
        return detail;
      }).then(function() {
        var detailScope = $scope.$new();
        detailScope.datasource = $scope.datasource;
        detailScope.detail = detail;
        $scope.appEvent('show-modal', {
          src: 'public/app/features/setup/partials/service_detail.html',
          modalClass: 'modal-no-header invite-modal',
          scope: detailScope,
        });
      });
    };

    $scope.init();
  });

});
