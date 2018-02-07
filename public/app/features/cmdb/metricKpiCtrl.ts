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
  constructor(
    private $scope,
    private backendSrv,
    private datasourceSrv,
    private $controller,
    private $q,
    private contextSrv,
    private $translate
  ) {
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
    this.kpi = '';
    this.kpiList = null;
    if (this.serviceSelected === service.id) {
      this.serviceSelected = -1;
      return;
    } else {
      this.serviceSelected = service.id;
    }
    this.backendSrv.getKpi({
      service: service.name
    }).then((res) => {
      this.kpiList = res.data;
    });
  }

  removeKpi(kpi, service) {
    if (this.contextSrv.isViewer) {
      this.$scope.appEvent('alert-warning', ['抱歉', '您没有权限删除KPI']);
    } else {
      this.$scope.appEvent('confirm-modal', {
        title: this.$translate.i18n.i18n_delete,
        text: this.$translate.i18n.i18n_sure_operator,
        icon: 'fa-trash',
        yesText: this.$translate.i18n.i18n_delete,
        noText: this.$translate.i18n.i18n_cancel,
        onConfirm: () => {
          this.backendSrv.editKpi({
            service: service.name,
            metric: kpi,
            kpi: false
          }).then(() => {
            this.$scope.appEvent('alert-success', ['删除成功']);
            _.remove(this.kpiList, (kpiItem) => {
              return kpiItem === kpi;
            });
          });
        }
      });
    }
  }

  addKpi(kpi, service) {
    if (_.indexOf(this.kpiList, kpi) > -1) {
      this.$scope.appEvent('alert-warning', ['您已添加过该指标', '请勿重复添加']);
      return;
    }
    this.backendSrv.editKpi({
      service: service.name,
      metric: kpi
    }).then((res) => {
      this.$scope.appEvent('alert-success', ['添加成功']);
      this.kpiList.push(kpi);
      this.kpi = '';
    })
  }

  importKpi() {
    this.backendSrv.importMetricsKpi().then((data) => {
      var all = [];
      _.each(data, (metrics, service) => {
        _.each(metrics, (metric) => {
          var q = this.backendSrv.editKpi({
            service: service,
            metric: metric
          });
          all.push(q);
        })
      });
      this.$q.all(all).then((response) => {
        var counter = _.countBy(response, (result) => {
          return result.status === 200;
        });
        this.$scope.appEvent('alert-success', ['导入成功', '共成功导入' + counter.true + '个KPI']);
      }, () => {
        this.$scope.appEvent('alert-danger', ['导入失败']);
      });
    });
  }
}

coreModule.controller('MetricKpiCtrl', MetricKpiCtrl);
