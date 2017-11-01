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
  constructor(private $scope, private backendSrv) {
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
    // this.metricList = [
    //   {
    //     "id": 1,
    //     "type": "type",
    //     "key": "cpu.idle",
    //     "subType": "subType",
    //     "description": "description",
    //     "unit": "unit",
    //     "tags": ["tags"],
    //     "customMetric": true,
    //     "kpi": false
    //   },
    //   {
    //     "id": 2,
    //     "type": "type",
    //     "key": "cpu.idle",
    //     "subType": "subType",
    //     "description": "description",
    //     "unit": "unit",
    //     "tags": ["tags"],
    //     "customMetric": true,
    //     "kpi": false
    //   },
    //   {
    //     "id": 3,
    //     "type": "type",
    //     "key": "cpu.idle",
    //     "subType": "subType",
    //     "description": "description",
    //     "unit": "unit",
    //     "tags": ["tags"],
    //     "customMetric": true,
    //     "kpi": false
    //   }
    // ]
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
    // this.metricCur = {
    //   "id": 1,
    //   "type": "type",
    //   "subType": "subType",
    //   "description": "description",
    //   "unit": "unit",
    //   "tags": ["tags"],
    //   "customMetric": true,
    //   "kpi": false,
    //   "disabled": true
    // };
    if (this.metricCur && this.metricCur.id === id) {
      return;
    }
    this.backendSrv.alertD({url: '/metrictype/info?id=' + id}).then((res) => {
      this.metricCur = res.data;
      this.metricCur.disabled = true;
      this.metricCur = _.each(res.data, (value, key) => {
        if (key !== 'tags' && _.isNull(value)) {
          res.data[key] = '暂无信息'
        }
      });
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
      if (!_.isEmpty(res.data)) {
        if (this.query.metric) {
          this.metricList = [res.data];
        }
      } else {
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
    // this.backendSrv.alertD({url: '/metrictype/info?id=' + id}).then((res) => {
    //   this.metricCur = res.data;
    //   this.metricCur.disabled = true;
    //   this.metricCur = _.each(res.data, (value, key) => {
    //     if (key !== 'tags' && _.isNull(value)) {
    //       res.data[key] = '暂无信息'
    //     }
    //   });
    // });
  }

  cancel() {
    this.metricCur = _.cloneDeep(this.metricEdit);
    this.metricCur.disabled = true;
  }

}

coreModule.controller('MetricsDefCtrl', MetricsDefCtrl);
