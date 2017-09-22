define([
  'angular',
  'lodash'
], function(angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('HostDetailCtrl', function ($scope, backendSrv, $location, hostSrv, popoverSrv) {
    $scope.init = function() {
      var id = $location.search().id;
      $scope.id = id;
      backendSrv.alertD({url:'/cmdb/host'}).then(function(response) {
        $scope.list = response.data;
      });
      backendSrv.alertD({url:'/cmdb/host?id='+id}).then(function(response) {
        $scope.detail = response.data;
        $scope.tags = angular.copy(response.data.tags);
        $scope.cpuCount = _.countBy(response.data.cpu);
        $scope.detail.isVirtual = $scope.detail.isVirtual ? '是' : '否';
        $scope.detail = _.cmdbInitObj($scope.detail);
      });
    };

    $scope.removeTag = function (tag) {
      _.remove($scope.tags, tag);
      hostSrv.deleteTag({ hostId: $scope.id, key: tag.key, value: tag.value });
    };

    $scope.showPopover = function () {
      popoverSrv.show({
        element : $('.tag-add')[0],
        position: 'bottom center',
        template: '<cw-tag-picker></cw-tag-picker>',
        classes : 'tagpicker-popover',
        model : {
          tags: $scope.tags,
          id  : $scope.id
        },
      });
    };

    $scope.init();
  });
});