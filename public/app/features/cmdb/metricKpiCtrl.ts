///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import 'app/plugins/datasource/opentsdb/queryCtrl';
import coreModule from 'app/core/core_module';

export class MetricKpiCtrl {
  kpiList: Array<any>;
  serviceList: Array<any>;
  service: any;
  kpi: any;
  serviceSelected: any;

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
      var hostList = [{
        id: 'HostMem',
        key: '内存',
        name: 'HostMem',
      },{
        id: 'HostCpu',
        key: 'CPU',
        name: 'HostCpu',
      },{
        id: 'HostNW',
        key: '网络',
        name: 'HostNW',
      },{
        id: 'HostIO',
        key: '磁盘',
        name: 'HostIO',
      }];
      _.each(res.data, (service) => {
        service.key = service.key.replace(/_linux/, '');
      });
      this.serviceList = _.concat(hostList, res.data);
    })
  }

  getKpi(service) {
    if (this.serviceSelected === service.id) {
      this.serviceSelected = -1;
      return;
    } else {
      this.serviceSelected = service.id;
    }
    this.backendSrv.metricKpi({
      method: 'get',
      params: {
        service: service.name
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
            service: service.name,
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
        service: service.name,
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
