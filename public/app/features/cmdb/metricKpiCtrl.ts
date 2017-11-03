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
  serviceName: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private datasourceSrv, private $controller) {
    this.getService();
    this.$controller('OpenTSDBQueryCtrl', {$scope: this.$scope});
    datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
    });
  }

  getService() {
    this.backendSrv.alertD({
      url: '/cmdb/service'
    }).then((res) => {
      this.serviceList = res.data;
    })
  }

  getKpi(service) {
    this.serviceName = service;
    this.backendSrv.metricKpi({
      method: 'get',
      params: {
        service: service
      }
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
        this.backendSrv.metricKpi({
          method: 'post',
          params: {
            service: service,
            metric: kpi,
            kpi: false
          }
        }).then(() => {
          this.$scope.appEvent('alert-success', ['删除成功']);
          this.getKpi(service);
        });
      }
    });
  }

  addKpi(kpi, service) {
    if (_.indexOf(this.kpiList, kpi) > -1) {
      this.$scope.appEvent('alert-warning', ['您已添加过该指标', '请勿重复添加']);
      return;
    }
    this.backendSrv.metricKpi({
      method: 'post',
      params: {
        service: service,
        metric: kpi
      }
    }).then((res) => {
      this.$scope.appEvent('alert-success', ['添加成功']);
      this.getKpi(service);
      this.kpi = '';
    })
  }
}

coreModule.controller('MetricKpiCtrl', MetricKpiCtrl);
