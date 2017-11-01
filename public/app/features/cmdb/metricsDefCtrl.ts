///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';

export class MetricsDefCtrl {
  metricList: Array<any>;
  metricCur: any;
  metricEdit: any;
  page: number;
  size: number;
  typeList: Array<any>;
  query: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private contextSrv) {
    this.page = 0;
    this.size = 15;
    this.getMetricsList('next');
    this.typeList = [{
      type: '系统',
      subType: [
        'CPU',
        'IO',
        'JVM',
        '内存',
        '存储',
        '网络',
        '运行状态'
      ]
    },{
      type: '服务',
      subType: [
        'apache',
        'collector',
        'docker',
        'elastic search',
        'hadoop',
        'hbase [Master]',
        'hbase [RegionServer]',
        'kafka',
        'mongodb',
        'mysql',
        'nginx',
        'opentsdb',
        'oracle',
        'postgresql',
        'rabbitmq',
        'redis',
        'weblogic',
        'zookeeper'
      ]
    }];

    this.query = {
      metric: '',
      type: null,
      subType: ''
    };
  }

  getMetricsList(type) {
    var page = this.page;
    switch (type) {
      case 'next':
        page++;
        break;
      case 'pre':
        page = (page === 1) ? 1 : (page - 1);
        break;
    }
    this.backendSrv.alertD({url: '/metrictype/info?size=' + this.size + '&page=' + page}).then((res) => {
      if (!_.isEmpty(res.data)) {
        this.metricList = res.data;
        this.page = page;
      } else {
        this.$scope.appEvent('alert-warning', ['没有更多指标了']);
      }
    });
  }

  getDetailById(id) {
    if (this.metricCur && this.metricCur.id === id) {
      return;
    }
    this.backendSrv.alertD({url: '/metrictype/info?id=' + id}).then((res) => {
      this.metricCur = res.data;
      this.metricCur.disabled = true;
    });
  }

  search() {
    var url = '/metrictype/info';
    if (this.query.metric) {
      url += '?name=' + this.query.metric;
    } else if (this.query.type) {
      url += '?type=' + this.query.type.type
      if (this.query.subType) {
        url += '&subtype=' + this.query.subType;
      }
    }
    this.backendSrv.alertD({url: url}).then((res) => {
      if (this.query.metric) {
        this.metricList = [res.data];
      } else {
        this.metricList = res.data;
      }
      if (_.isEmpty(res.data)) {
        this.$scope.appEvent('alert-warning', ['没有相关指标']);
      }
    });
  }

  edit() {
    this.metricCur.disabled = false;
    this.metricEdit = _.cloneDeep(this.metricCur);
  }

  update() {
    this.metricCur.disabled = true;
    this.backendSrv.alertD({
      url: '/metrictype/info?id=' + this.metricCur.id + '&userId=' + this.contextSrv.user.id,
      method: 'post',
      data: this.metricCur
    }).then((res) => {
      this.$scope.appEvent('alert-success', ['保存成功']);
    }, () => {
      this.cancel();
      this.$scope.appEvent('alert-danger', ['保存失败']);
    });
  }

  cancel() {
    this.metricCur = _.cloneDeep(this.metricEdit);
    this.metricCur.disabled = true;
  }

}

coreModule.controller('MetricsDefCtrl', MetricsDefCtrl);
