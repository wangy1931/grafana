define([
  'angular',
  'lodash'
], function(angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('HostDetailCtrl', function ($scope, backendSrv, $location, hostSrv, contextSrv, $q, $translate) {
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
        $scope.detail.isVirtual = $scope.detail.isVirtual ? $translate.i18n.i18n_yes : $translate.i18n.i18n_no;
        $scope.detail = _.cmdbInitObj($scope.detail);
      });
    };

    $scope.showServices = function() {
      backendSrv.alertD({url:'/cmdb/service'}).then(function(result) {
        $scope.allService = result.data;
        _.each($scope.detail.services, function(service) {
          _.remove($scope.allService, function(item) {
            return item.id === service.id;
          });
        });

        if(!$scope.allService.length) {
          $scope.appEvent('alert-success', [$translate.i18n.page_log_parse_service_fulled]);
          return;
        }

        var newScope = $scope.$new();
        newScope.detail = $scope.detail;
        newScope.allService = $scope.allService;
        newScope.selectOne = function() {
          newScope.select_all = _.every($scope.allService,{'checked': true});
        };
        $scope.appEvent('show-modal', {
          src: 'public/app/features/cmdb/partials/host_add_service.html',
          modalClass: 'modal-no-header invite-modal cmdb-modal',
          scope: newScope,
        });
      });
    }

    $scope.selectAll = function(check) {
      _.each($scope.allService, function(service) {
        service.checked = check;
      });
    };

    $scope.addServices = function() {
      var services = _.where($scope.allService, {'checked': true});
      var promiseArr = [];
      _.each(services, function(service) {
        var p = backendSrv.editServiceHost({op: 'Create', sourceId: $scope.id, targetId: service.id, type: 'Member_of'}).then(function(response) {
          if(response.status === 200) {
            return true;
          }
        }, function(err) {
          return false;
        });
        promiseArr.push(p);
      });

      $q.all(promiseArr).then(function(values) {
        $scope.init();
      });
    };

    $scope.deleteService = function(relationshipId) {
      $scope.appEvent('confirm-modal', {
        title: $translate.i18n.i18n_delete,
        text: $translate.i18n.i18n_sure_operator,
        icon: 'fa-trash',
        yesText: $translate.i18n.i18n_delete,
        noText: $translate.i18n.i18n_cancel,
        onConfirm: function() {
          backendSrv.editServiceHost({op: 'Delete', rId: relationshipId}).then(function(response) {
            if (response.status === 200) {
              _.remove($scope.detail.services, {'relationshipId': relationshipId});
            }
          });
        }
      });
    };

    $scope.init();
  });
});