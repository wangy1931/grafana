define([
    'angular',
    '../core_module',
],
function (angular, coreModule) {
    'use strict';

    coreModule.default.controller('SignupFreeCtrl', function ($scope, $location, backendSrv, contextSrv) {
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
        contextSrv.signupUser.orgName = $scope.formModel.orgName;
        contextSrv.signupUser.name = $scope.formModel.name;

        backendSrv.post('/api/user/signup', $scope.formModel).then(function(result) {
          if (result.status === 'SignUpCreated') {
            $location.path('/signup').search({email: $scope.formModel.email});
          } else {
            window.location.href = config.appSubUrl + '/';
          }
        });
        // backendSrv.post('/api/user/signup/propose', $scope.formModel).then(function () {});
      };

    });
  });
