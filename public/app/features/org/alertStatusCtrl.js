define([
  'angular',
  'lodash',
],
function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('AlertStatusCtrl', function($scope) {

    $scope.initDashboard({
      meta: { canStar: false, canShare: false },
      dashboard: {
        title: "alert-name",
        rows: [{ height: '250px', panels:[] }],
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
