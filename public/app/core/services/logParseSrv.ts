///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import coreModule from 'app/core/core_module';

export class LogParseSrv {
  /** @ngInject */
  constructor(private backendSrv) {}

  getListRule(orgId, sysId) {
    return this.backendSrv.alertD({
      url: '/cmdb/pattern/list',
      params: {
        orgId: orgId,
        sysId: sysId
      }
    })
  }

  getTemplate(params) {
    return this.backendSrv.alertD({
      url: '/cmdb/pattern/template',
      params: params
    });
  }

  getRuleById(id) {
    return this.backendSrv.alertD({
      url: '/cmdb/pattern/getById',
      params: {
        ruleId: id
      }
    });
  }

  getServiceList() {
    return this.backendSrv.alertD({url: '/cmdb/service'});
  }

  getHostList() {
    return this.backendSrv.alertD({url: '/cmdb/host'});
  }

  validatePattern(pattern) {
    return this.backendSrv.alertD({
      url: '/cmdb/pattern/validate',
      method: 'post',
      data: {
        log: pattern.log,
        pattern: pattern.pattern,
        type: pattern.type,
        namedCaptureOnly: true,
        isMetric: pattern.isMetric
      }
    });
  }

  savePattern(userId, data) {
    return this.backendSrv.alertD({
      url: '/cmdb/pattern/save',
      method: 'post',
      params: {
        userId: userId
      },
      data: data
    })
  }

  deletePattern(ruleId, userId) {
    return this.backendSrv.alertD({
      url: '/cmdb/pattern/delete',
      method: 'delete',
      params: {
        ruleId: ruleId,
        userId: userId
      }
    })
  }

}

coreModule.service('logParseSrv', LogParseSrv);
