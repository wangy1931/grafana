define([
    'angular',
    'lodash',
    'app/features/org/alertAssociationCtrl',
    'app/plugins/datasource/opentsdb/queryCtrl',
  ],
  function (angular, _) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.controller('SingleAssociationCtrl', function ($scope, datasourceSrv, $controller, contextSrv, backendSrv, associationSrv) {
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

      $scope.analysis = function () {
        var associationObj = _.cloneDeep($scope.targetObj);
        associationObj.metric = contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + $scope.targetObj.metric;
        $controller('AlertAssociationCtrl', {$scope: $scope}).initPage(associationObj);
        $scope.status = true;
        associationSrv.setSourceAssociation(associationObj.metric, associationObj.host, $scope.correlationThreshold);
        $scope.$emit('analysis', associationSrv);
      };

      $scope.init();
    });
  });
