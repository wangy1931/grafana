define([
  'angular',
  'lodash'
], function(angular, _) {
  'use strict';

  var module = angular.module('grafana.controllers');

  module.controller('CMDBServiceDetailCtrl', function ($scope, backendSrv, $location, $q, contextSrv, datasourceSrv, $translate) {
    $scope.init = function() {
      $scope.order = "'hostname'";
      $scope.desc = false;
      $scope.serviceId = parseInt($location.search().id);
      backendSrv.alertD({url:'/cmdb/service'}).then(function(response) {
        $scope.list = response.data;
      });
      getServiceDetail();
    };

    $scope.deleteHost = function(relationshipId) {
      $scope.appEvent('confirm-modal', {
        title: $translate.i18n.i18n_delete,
        text: $translate.i18n.i18n_sure_operator,
        icon: 'fa-trash',
        yesText: $translate.i18n.i18n_delete,
        noText: $translate.i18n.i18n_cancel,
        onConfirm: function() {
          backendSrv.editServiceHost({op: 'Delete', rId: relationshipId}).then(function(response) {
            if (response.status === 200) {
              _.remove($scope.detail.hosts, {'relationshipId': relationshipId});
            }
          });
        }
      });
    };

    $scope.showHost = function() {
      backendSrv.alertD({url:'/cmdb/host'}).then(function(result) {
        $scope.allHosts = result.data;
        _.each($scope.detail.hosts, function(host) {
          _.remove($scope.allHosts, function(item) {
            return item.id === host.id;
          });
        });

        if(!$scope.allHosts.length) {
          $scope.appEvent('alert-success', [$translate.i18n.page_log_parse_host_fulled]);
          return;
        }

        var newScope = $scope.$new();
        newScope.detail = $scope.detail;
        newScope.allHosts = $scope.allHosts;
        newScope.selectOne = function() {
          newScope.select_all = _.every($scope.allHosts,{'checked': true});
        };
        $scope.appEvent('show-modal', {
          src: 'public/app/features/cmdb/partials/service_add_host.html',
          modalClass: 'modal-no-header invite-modal cmdb-modal',
          scope: newScope,
        });
      });
    };

    $scope.selectAll = function(check) {
      _.each($scope.allHosts, function(host) {
        host.checked = check;
      });
    };

    $scope.addHosts = function() {
      var hosts = _.where($scope.allHosts, {'checked': true});
      var promiseArr = [];
      _.each(hosts, function(host) {
        var p = backendSrv.editServiceHost({op: 'Create', sourceId: host.id, targetId: $scope.serviceId, type: 'Member_of'}).then(function(response) {
          if(response.status === 200) {
            return true;
          }
        }, function(err) {
          return false;
        });
        promiseArr.push(p);
      });

      $q.all(promiseArr).then(function(values) {
        getServiceDetail();
      });
    };

    var getServiceDetail = function() {
      backendSrv.alertD({url:'/cmdb/service?id='+$scope.serviceId}).then(function(response) {
        $scope.detail = _.cmdbInitObj(response.data);
        _.map($scope.detail.hosts, function(host) {
          var queries = [{
            "metric": contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + $scope.detail.name + ".state",
            "aggregator": "sum",
            "downsample": "1s-sum",
            "tags": {"host": host.hostname}
          }];
          datasourceSrv.getStatus(queries, 'now-5m').then(function(response) {
            _.each(response, function(data) {
              if (_.isObject(data)) {
                var status = data.dps[Object.keys(data.dps)[0]];
                if(typeof(status) !== "number") {
                  throw Error;
                }
                if (status > 0) {
                  host.state = $translate.i18n.i18n_unnormal;
                } else {
                  host.state = $translate.i18n.i18n_normal;
                }
              }
            });
          }, function() {
            host.state = $translate.i18n.i18n_unnormal;
          });

          if(host.isVirtual) {
            return host.isVirtual = $translate.i18n.i18n_yes;
          } else if(host.isVirtual == false) {
            return host.isVirtual = $translate.i18n.i18n_no;
          } else {
            return host.isVirtual = $translate.i18n.i18n_unknown;
          };
        });
      });
    }

    $scope.orderBy = function(order) {
      $scope.order = "'"+ order +"'";
      $scope.desc = !$scope.desc;
    };

    $scope.init();
  });
});