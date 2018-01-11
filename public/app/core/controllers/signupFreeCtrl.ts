///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';

import config from 'app/core/config';
import coreModule from '../core_module';

export class SignupFreeCtrl{

  /** @ngInject */
  constructor($scope, $location, backendSrv, contextSrv) {
    $scope.formModel = {
      email: "",
      name: "",
      orgName: "",
      phone: "",
      scale: ""
    };
    contextSrv.sidemenu = false;

    $scope.submit = function () {
      if (!$scope.signUpFrom.$valid) {
        return;
      }
      if (_.excludeEmail($scope.formModel.email)) {
        $scope.appEvent('alert-warning', ['请输入企业邮箱']);
        return;
      }
      contextSrv.signupUser.orgName = $scope.formModel.orgName;
      contextSrv.signupUser.name = $scope.formModel.name;

      backendSrv.post('/api/user/signup', $scope.formModel).then(function(result) {
        if (result.status === 'SignUpCreated') {
          $location.path('/signup').search({email: $scope.formModel.email});
        } else {
          window.location.href = config.appSubUrl + '/';
        }
      });
      backendSrv.post('/api/user/signup/propose', $scope.formModel).then(function () {});
    };
  }
}

coreModule.controller('SignupFreeCtrl', SignupFreeCtrl);
