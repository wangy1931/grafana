///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from 'app/core/core_module';

export class MetricKpiCtrl {
  kpiList: Array<any>;
  serviceList: Array<any>;
  service: any;
  kpi: any;

  /** ngInject */
  constructor(private $scope, private backendSrv) {
    this.getService();
  }

  getService() {
    this.backendSrv.alertD({
      url: '/cmdb/service'
    }).then((res) => {
      this.serviceList = res.data;
    })
  }

  getKpi(service) {
    this.backendSrv.alertD({
      url: '/service/kpi?service=' + service
    }).then((res) => {
      this.kpiList = res.data;
    });
  }

  removeKpi(kpi, service) {
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确定要删除该KPI吗？',
      icon: 'fa-trash',
      yesText: '删除',
      noText: '取消',
      onConfirm: () => {
        this.backendSrv.alertD({
          url: '/service/kpi?service=' + service + '&metric=' + kpi + '&kpi=false',
          method: 'post'
        }).then(() => {
          this.$scope.appEvent('alert-success', ['删除成功']);
          this.getKpi(service);
        });
      }
    });
  }

  addKpi(kpi, service) {
    this.backendSrv.alertD({
      url: '/service/kpi?service=' + service + '&metric=' + kpi,
      method: 'post'
    }).then((res) => {
      this.$scope.appEvent('alert-success', ['添加成功']);
      this.getKpi(service);
    })
  }
}

coreModule.controller('MetricKpiCtrl', MetricKpiCtrl);
