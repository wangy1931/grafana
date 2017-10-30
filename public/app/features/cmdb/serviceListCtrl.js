define([
  'angular',
  'lodash',
], function(angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('ServiceListCtrl', function ($scope, backendSrv, $location, alertSrv, contextSrv, $timeout) {
    $scope.init = function() {
      $scope.searchHost = '';
      $scope.order = "'name'";
      $scope.desc = false;
      $scope.getService();
      $scope.isScan = false;
    };

    $scope.getService = function() {
      backendSrv.alertD({url:'/cmdb/service'}).then(function(result) {
        $scope.services = result.data;
      });
    };

    $scope.getDetail = function(service) {
      $location.url('/cmdb/servicelist/servicedetail?id='+service.id);
    };

    $scope.orderBy = function(order) {
      $scope.order = "'"+ order +"'";
      $scope.desc = !$scope.desc;
    };

    $scope.deleteService = function(id) {
      $scope.appEvent('confirm-modal', {
        title: '删除',
        text: '您确认要删除该服务吗？',
        icon: 'fa-trash',
        yesText: '删除',
        noText: '取消',
        onConfirm: function() {
          backendSrv.alertD({
            method: 'DELETE',
            url   : '/cmdb/agent/service',
            params: { 'id': id }
          }).then(function () {
            alertSrv.set("删除成功", '', "success", 2000);
            _.remove($scope.services, { id: id });
          }, function (err) {
            alertSrv.set("删除失败", err.data, "error", 2000);
          });
        }
      });
    };

    $scope.serviceScan = function() {
      $scope.isScan = true;
      backendSrv.alertD({
        url: '/cmdb/service/state/update',
        method: 'post'
      }).then(function(response) {
        $scope.isScan = false;
        $scope.getService();
      }, function() {
        $scope.isScan = false;
      });
    };

    $scope.init();
  });
});