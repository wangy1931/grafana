///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import coreModule from 'app/core/core_module';

class AdminEditOrgCtrl{
  /** @ngInject **/
  constructor($scope, $routeParams, backendSrv, $location) {
    $scope.type = {
      free: '免费用户',
      pay: '付费用户'
    }
    $scope.init = function() {
      if ($routeParams.id) {
        $scope.getOrg($routeParams.id);
        $scope.getOrgUsers($routeParams.id);
        $scope.getOrgPermit($routeParams.id);
      }
    };

    $scope.getOrg = function(id) {
      backendSrv.get('/api/orgs/' + id).then(function(org) {
        $scope.org = org;
      });
    };

    $scope.getOrgUsers = function(id) {
      backendSrv.get('/api/orgs/' + id + '/users').then(function(orgUsers) {
        $scope.orgUsers = orgUsers;
      });
    };

    $scope.getOrgPermit = function(id) {
      backendSrv.get('/api/permit/' + id).then(function(permit) {
        $scope.orgPermit = permit;
        $scope.formatTime();
      });
    };

    $scope.update = function() {
      if (!$scope.orgDetailsForm.$valid) { return; }

      backendSrv.put('/api/orgs/' + $scope.org.id, $scope.org).then(function() {
        $location.path('/admin/orgs');
      });
    };

    $scope.updateOrgUser= function(orgUser) {
      backendSrv.patch('/api/orgs/' + orgUser.orgId + '/users/' + orgUser.userId, orgUser);
    };

    $scope.removeOrgUser = function(orgUser) {
      backendSrv.delete('/api/orgs/' + orgUser.orgId + '/users/' + orgUser.userId).then(function() {
        $scope.getOrgUsers($scope.org.id);
      });
    };

    $scope.formatTime = function() {
      $scope.openFromPicker = false;
      $scope.deadline = _.transformMillionTime($scope.orgPermit.Deadline);
    }

    $scope.updateOrgPermit = function() {
      $scope.orgPermit.Deadline = moment($scope.orgPermit.Deadline).format();
      backendSrv.post('/api/admin/permit/' + $scope.org.id, $scope.orgPermit).then(function() {
        $scope.appEvent('alert-success', ['更新成功']);
      });
    }

  }
}

coreModule.controller('AdminEditOrgCtrl', AdminEditOrgCtrl)
