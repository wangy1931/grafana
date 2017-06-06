define([
  'angular',
  'lodash',
],
function (angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('HostAgentCtrl', function ($scope, backendSrv, datasourceSrv, contextSrv, $interval, $location) {

    $scope.init = function() {
      $interval.cancel($scope.inter);
      // hostNum 用来判断页面能否跳转，是否安装完成
      $scope.hostNum = backendSrv.hostNum;
      $scope.orgId = contextSrv.user.orgId;
      $scope.alertServer = backendSrv.alertDUrl;
      $scope.token = backendSrv.getToken();
      // 已有机器探针,可以展示menu,否则不可
      if(backendSrv.hostNum) {
        $scope.installed = true;
        $scope.appEvent('alert-success', ['您已安装机器探针', "请继续安装机器探针,或安装服务探针"]);
      } else {
        contextSrv.sidemenu = false;
      }
      backendSrv.get('/api/static/hosts').then(function(result) {
        $scope.platform = result.hosts;
      });

      datasourceSrv.get("opentsdb").then(function (ds) {
        var url = document.createElement('a');
        url.href = ds.url;
        $scope.metricsServer = url.hostname;
      });
      // 5s轮询一次,共轮询5m
      $scope.inter = $interval($scope.getHosts,5000,60);
    };

    $scope.getHosts = function() {
      if($scope.hostNum > backendSrv.hostNum){
        backendSrv.hostNum = $scope.hostNum;
        $interval.cancel($scope.inter);
        $scope.installed = true;
        $scope.appEvent('alert-success', ['安装完成', "请配置服务探针"]);
        // 安装完成，自动加载模板
        $scope.createTemp();
      } else {
        backendSrv.alertD({
          method: "get",
          url: "/summary",
          params: {metrics:"collector.summary"},
          headers: {'Content-Type': 'text/plain'},
        }).then(function (response) {
          $scope.hostNum = response.data.length;
        });
      }
    };

    $scope.changeSelect = function(select) {
      $scope.selected = select;
    };

    $scope.clearInterval = function(type) {
      $interval.cancel($scope.inter);
      switch (type) {
        case "next":
          contextSrv.sidemenu = true;
          $location.url('/setting/service');
          break;
        case "back":
          $location.url('/systems');
          break;
        case "skip":
          $location.url('/');
          break;
      }
    };

    $scope.createTemp = function() {
      // 添加模板
    }

    $scope.init();
  });

});