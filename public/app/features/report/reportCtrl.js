define([
  'angular',
], function (angular) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('ReportCtrl', function (
    $scope, backendSrv, contextSrv, navModelSrv
  ) {
    $scope.navModel = navModelSrv.getReportNav();

    $scope.init = function () {
      $scope.reports = [];
      backendSrv.get('/api/static/template/'+contextSrv.user.orgId).then(function(result) {
        $scope.reportDownloadUrl = backendSrv.downloadUrl + '/report';
        $scope.reports = result.reports;
      }, function(err) {
        console.log('Error: ', err.message);
      });
    };

    $scope.init();
  });
});
