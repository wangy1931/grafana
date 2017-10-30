///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class LogParseCtrl {
  ruleList: Array<any>;

  /** @ngInject */
  constructor(private $scope, private contextSrv, private backendSrv) {
    this.getListRule();
  }

  getListRule() {
    this.backendSrv.alertD({
      url: '/cmdb/pattern/list',
      params: {
        orgId: this.contextSrv.user.orgId,
        sysId: this.contextSrv.user.systemId
      }
    }).then((response) => {
      this.ruleList = response.data;
    });
  }
}

coreModule.controller('LogParseCtrl', LogParseCtrl);
