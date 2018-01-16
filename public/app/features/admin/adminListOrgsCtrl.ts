///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import coreModule from 'app/core/core_module';
import Moment from 'moment';

class AdminListOrgsCtrl {
  /** @ngInject **/
  constructor($scope, backendSrv) {
    $scope.init = function() {
      $scope.getOrgs();
    };

    $scope.getOrgs = function() {
      backendSrv.get('/api/orgs').then(function(orgs) {
        $scope.orgs = orgs;
        _.each($scope.orgs, (org) => {
          org.level = org.level === 'free' ? '免费用户' : '付费用户';
          org.deadline = moment(org.deadline).diff(moment(), 'days') + 1;
        });
      });
    };

    $scope.deleteOrg = function(org) {
      $scope.appEvent('confirm-modal', {
        title: '你想删除 ' + org.name + ' 公司吗?',
        text: '公司的成员和所有的仪表盘(资料)都会被清除',
        icon: 'fa-trash',
        yesText: 'Delete',
        onConfirm: function() {
          backendSrv.delete('/api/orgs/' + org.id).then(function() {
            $scope.getOrgs();
          });
        }
      });
    };

    $scope.init();
  }
}

coreModule.controller('AdminListOrgsCtrl', AdminListOrgsCtrl)
