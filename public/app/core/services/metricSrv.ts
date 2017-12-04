///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import coreModule from 'app/core/core_module';

export class MetricSrv {
  /** @ngInject */
  constructor(private backendSrv) {}

  getSubtype() {
    return this.backendSrv.alertD({
      url: '/metric/subtype'
    });
  }

  getSuggest(query) {
    return this.backendSrv.alertD({
      url: '/metric/suggest',
      params: {
        q: query
      }
    });
  }

  /**
   * getMetricInfo params
   *  @param {size} number The page size.
   *  @param {page} number The page number
   *  @param {id} number The metric id
   *  @param {name} string The metric name
   *  @param {type} string 服务/系统
   *  @param {subtype} string serviceName/CPU/IO/JVM/内存/存储/网络/运行状态
   */
  getMetricInfo (params) {
    return this.backendSrv.alertD({
      url: '/metric/info',
      params: params
    });
  }

  /**
   * updateMetricInfo params
   *  @param {id} number metricId
   *  @param {userId} number userId
   */
  updateMetricInfo (params, data) {
    return this.backendSrv.alertD({
      method: 'post',
      url   : '/metric/info',
      params: params,
      data  : data
    })
  }
}

coreModule.service('metricSrv', MetricSrv);
