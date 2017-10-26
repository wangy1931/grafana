///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from '../../core/core_module';

export class LogParseCtrl {
  ruleList: Array<any>;

  /** @ngInject */
  constructor(private $scope, private contextSrv, private $location) {
    // this.contextSrv.user.orgId
    // this.contextSrv.user.systemId
    this.getListRule();
  }

  getListRule() {
    this.ruleList = [
      {
        "id": 1,
        "orgId": 2,
        "sysId": 2,
        "ruleName": "nginx.access.1",
        "serviceName": "nginx",
        "logType": "access",
        "type": "log-processor"
      },
      {
        "id": 2,
        "orgId": 2,
        "sysId": 2,
        "ruleName": "nginx.error.1",
        "serviceName": "nginx",
        "logType": "error",
        "type": "log-processor"
      }
    ];
  }
}

coreModule.controller('LogParseCtrl', LogParseCtrl);
