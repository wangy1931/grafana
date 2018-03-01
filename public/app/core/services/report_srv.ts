///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import coreModule from 'app/core/core_module';

export class ReportSrv {
  /** @ngInject */
  constructor(private backendSrv, private contextSrv, private staticSrv) {}

  getExpertReports() {
    return this.staticSrv.getExpertReports()
  }

  getReportConfig() {
    return this.backendSrv.alertD({
      url: '/reporting/config'
    });
  }

  /**
   * saveReportConfig data
   * @param {enabled} boolean 是否开启功能 
   * @param {recipients} arrary 邮件通知列表 
   * @param {delieverHour} number 发送邮件时间 
   * @param {sections} array 配置的模块 
   */
  saveReportConfig(data) {
    return this.backendSrv.alertD({
      url: '/reporting/config',
      method: 'post',
      data: data
    });
  }

  /**
   * getMetricInfo params
   */
  getReportList () {
    return this.backendSrv.alertD({
      url: '/reporting',
    });
  }

  /**
   * getReportById params
   */
  getReportById (id) {
    return this.backendSrv.alertD({
      url : '/reporting',
      responseType: 'arraybuffer',
      params : {
        id: id
      }
    })
  }
}

coreModule.service('reportSrv', ReportSrv);
