define([
  'angular',
  'lodash',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('AlertStatusCtrl', function($scope, alertMgrSrv) {
    var alertRows = [];
    var triggeredAlerts = alertMgrSrv.loadTriggeredAlerts();
    for (var id in triggeredAlerts) {
      if (triggeredAlerts.hasOwnProperty(id)) {
        alertRows.push({ height: '250px', panels:[], triggeredMetric: triggeredAlerts[id] });
      }
    }

    $scope.initDashboard({
      meta: { canStar: false, canShare: false, canEdit: false },
      dashboard: {
        title: "alert-name",
        rows: alertRows,
        time: {from: "now-2h", to: "now"}
      },
    }, $scope);

/*
    _.each(datasourceSrv.getAll(), function(ds) {
      if (ds.type === 'opentsdb') {
        datasourceSrv.get(ds.name).then(function(datasource) {
          self.queryMetrics(datasource);
        });
      }
    });

    this.queryMetrics = function(datasource) {
      $scope.refreshData(datasource);
    };*/

  });
});
