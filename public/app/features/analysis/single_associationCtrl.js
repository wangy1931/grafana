define([
    'angular',
    'lodash',
    'app/features/org/alertAssociationCtrl',
    'app/plugins/datasource/opentsdb/queryCtrl',
  ],
  function (angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('SingleAssociationCtrl', function ($rootScope, $scope, datasourceSrv, $controller, contextSrv, backendSrv) {
      $scope.init = function () {
        var targetObj = {
          metric: "",
          host: "",
          distance: 300,
        };
        $scope.unInit = true;
        $controller('OpenTSDBQueryCtrl', {$scope: $scope});
        $scope.targetObj = targetObj;
        $scope.suggestTagHost = backendSrv.suggestTagHost;
        datasourceSrv.get('opentsdb').then(function(datasource) {
          $scope.datasource = datasource;
        });

        $rootScope.onAppEvent('exception-located', $scope.showGuideResult.bind(this), $scope);
      };

      $scope.resetCorrelationAnalysis = function () {
        $scope.targetObj.distance = $scope.thresholdSlider.get();
        $scope.analysis();
      };

      $scope.analysis = function () {
        var associationObj = _.cloneDeep($scope.targetObj);
        associationObj.metric = contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + $scope.targetObj.metric;
        $controller('AlertAssociationCtrl', {$scope: $scope}).initPage(associationObj);
        $scope.status = true;

        $scope.getServiceEvents();
      };

      $scope.addRCA = function (metric, host) {
        // 指定格式
        $scope.rcaData = {
          symptomMetric : $scope.targetObj.metric,
          symptomHost : $scope.targetObj.host,
          causeMetric : _.getMetricName(metric),
          causeHost : host[0],
        }
        $scope.appEvent('show-add-rac');
      };

      $scope.getServiceEvents = function () {
        backendSrv.alertD({
          method: 'GET',
          url   : '/service/events',
          params: { 'start': 1505721891194 }
        }).then(function (response) {
          _.each(response.data, function(item) {
            item.type = (item.type === 'Start') ? '启动' : '停止';
            item.timestamp = _.transformTime(item.timestamp);
          });
          $scope.serviceEvents = response.data;
        });
      };

      $scope.showGuideResult = function (e, params) {
        $scope.targetObj = {
          metric: params.metric,
          host: params.host,
          start: params.start,
          distance: 300,
        };
        $scope.analysis();
      };

      $scope.init();
    });
  });
