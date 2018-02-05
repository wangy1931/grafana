///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class OnCallerEditCtrl {
  user: any;
  oncallerUsers: Array<any>;
  isNew: boolean;
  orgName: string;
  serviceName: any;

  /** @ngInject */
  constructor(
    private $scope,
    private $routeParams,
    private $location,
    private $timeout,
    private oncallerMgrSrv,
    private alertSrv,
    private contextSrv,
    private backendSrv,
    private $translate
  ) {
    this.user = oncallerMgrSrv.get($routeParams.id) || {};
    this.isNew = !Object.keys(this.user).length;

    this.orgName = contextSrv.user.orgName;
    this.serviceName = backendSrv.getSystemById(contextSrv.user.systemId);

    this.user.org = contextSrv.user.orgId;
    this.user.service = contextSrv.user.systemId;

    // 约定参数为 0
    if (parseInt($routeParams.id) === 0) {
      var editingUser = this.oncallerMgrSrv.currentEditUser;
      if (_.isEmpty(editingUser)) {
        this.alertSrv.set('操作不合法', '', 'warning', 1500);
        this.$timeout(() => {
          this.$location.path('oncallers');
        }, 1500);
      }
      this.user.name = editingUser.login;
      this.user.email = editingUser.email;
    }
  }

  save() {
    this.oncallerMgrSrv.save(this.user).then(
      response => {
        this.alertSrv.set(this.$translate.i18n.i18n_success, '', 'success', 1000);
        this.$location.path('oncallers');
      },
      err => {
        this.alertSrv.set('error', err.status + ' ' + (err.data || 'Request failed'), err.severity, 10000);
      }
    );
  }
}

coreModule.controller('OnCallerEditCtrl', OnCallerEditCtrl);
