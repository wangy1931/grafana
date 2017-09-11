define([
    'angular',
    'lodash',
    'app/features/org/alertAssociationCtrl',
    'app/plugins/datasource/opentsdb/queryCtrl',
  ],
  function (angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('SingleAssociationCtrl', function ($scope, datasourceSrv, $controller, contextSrv, backendSrv) {
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

      $scope.init();
    });
  });
