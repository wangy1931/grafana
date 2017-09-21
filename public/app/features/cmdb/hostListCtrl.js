define([
  'angular',
  'lodash',
  'moment',
  './cmdbSetupCtrl',
], function(angular, _, moment) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('HostListCtrl', function ($scope, backendSrv, $location, $controller, alertSrv) {
    $scope.init = function() {
      $scope.searchHost = '';
      $scope.order = "'hostname'";
      $scope.desc = false;
      $scope.refreshTxt = '扫描';
      backendSrv.alertD({url:'/cmdb/host'}).then(function(result) {
        $scope.hosts = result.data;
        _.map($scope.hosts, function(host) {
          if(host.isVirtual) {
            return host.isVirtual = '是';
          } else if(host.isVirtual === false) {
            return host.isVirtual = '否';
          } else {
            return host.isVirtual = '未知';
          }
        });
      });
    };

    $scope.getDetail = function(host) {
      $location.url('/cmdb/hostlist/hostdetail?id='+host.id);
    };

    $scope.orderBy = function(order) {
      $scope.order = "'"+ order +"'";
      $scope.desc = !$scope.desc;
    };

    $scope.exportList = function() {
      backendSrv.alertD({url:'/cmdb/host/export'}).then(function(response) {
        var data = response.data;
        var text = _.without(_.keys(data[0]), 'orgId', 'sysId', 'services').toString() + '\n';
        _.each(data, function(item) {
          delete item['orgId'];
          delete item['services'];
          delete item['sysId'];
          item.createdAt = moment.unix(item.createdAt/1000).format();
          item.cpu = item.cpu.join(";");
          item.interfaces = initArray(item.interfaces);
          item.devices = initArray(item.devices);
          item.memory = initArray(item.memory);
          for(var i in item) {
            text += item[i];
            text += ',';
          }
          text += '\n'
        });
        var blob = new Blob([text], { type: "text/csv;charset=utf-8" });
        window.saveAs(blob, 'cloudwiz_hosts_export.csv');
      });
    };

    $scope.deleteHost = function(hostId) {
      backendSrv.alertD({
        method: 'DELETE',
        url   : '/host',
        params: { 'id': hostId }
      }).then(function () {
        alertSrv.set("删除成功", '', "success", 2000);
        _.remove($scope.hosts, { id: hostId });
      }, function (err) {
        alertSrv.set("删除失败", err.data, "error", 2000);
      });
    }

    var initArray = function(item) {
      var text = '';
      _.each(item,function(obj) {
        delete obj['orgId'];
        delete obj['sysId'];
        obj.createdAt = moment.unix(obj.createdAt/1000).format();
        text += JSON.stringify(obj).replace(/,/g,';');
      });
      return text;
    };

    $scope.init();
  });
});