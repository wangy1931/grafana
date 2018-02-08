 

import config from 'app/core/config';
import coreModule from '../core_module';

export class SignUpCtrl {
  leftTime: number;

  /** @ngInject */
  constructor(
      private $scope: any,
      private $location: any,
      private contextSrv: any,
      private backendSrv: any,
      private $interval: any
    ) {

    contextSrv.sidemenu = false;
    $scope.ctrl = this;

    $scope.formModel = {};

    var params = $location.search();
    $scope.formModel.orgName = contextSrv.signupUser.orgName;
    $scope.formModel.name = contextSrv.signupUser.name;
    $scope.formModel.email = params.email;
    $scope.formModel.username = params.email;
    $scope.formModel.code = params.code;

    $scope.verifyEmailEnabled = false;
    $scope.autoAssignOrg = false;
    this.leftTime = 0;
    (this.$scope.formModel.email) && this.updateLeftTime();
    backendSrv.get('/api/user/signup/options').then(options => {
      $scope.verifyEmailEnabled = options.verifyEmailEnabled;
      $scope.autoAssignOrg = options.autoAssignOrg;
    });
  }

  resendEmail () {
    if (!this.$scope.formModel.email) {
      this.$scope.appEvent('alert-warning', ['请输入email']);
      return;
    }
    this.backendSrv.post('/api/user/signup', this.$scope.formModel).then((result) => {
      if (result.status === 'SignUpCreated') {
        this.updateLeftTime();
      } else {
        window.location.href = config.appSubUrl + '/';
      }
    });
  }

  updateLeftTime () {
    this.leftTime = 60;
    var inter = this.$interval(() => {
      this.leftTime--;
      (!this.leftTime) && this.$interval.cancel(inter);
    },1000);
  }

  submit () {
    if (!this.$scope.signUpForm.$valid) {
      return;
    }

    this.backendSrv.post('/api/user/signup/step2', this.$scope.formModel).then(rsp => {
      if (rsp.code === 'redirect-to-select-org') {
        window.location.href = config.appSubUrl + '/profile/select-org?signup=1';
      } else {
        window.location.href = config.appSubUrl + '/';
      }
    });
  };
}

coreModule.controller('SignUpCtrl', SignUpCtrl);

