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
  searchStr: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private contextSrv) {
    this.size = 15;
    this.clearQuery();
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
      subType: []
    }];
    this.getService();
  }

  getService() {
    this.backendSrv.alertD({
      url: '/cmdb/service'
    }).then((res) => {
      _.each(res.data, (service) => {
        this.typeList[1].subType.push(service.name);
      });
    });
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
    var url = '/metrictype/info?size=' + this.size + '&page=' + page;
    url += this.searchStr;
    this.backendSrv.alertD({url: url}).then((res) => {
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
    this.page = 1;
    var url = '/metrictype/info?size=' + this.size + '&page=' + this.page;
    if (this.query.metric) {
      this.searchStr = '&name=' + this.query.metric;
    } else if (this.query.type) {
      this.searchStr = '&type=' + this.query.type.type
      if (this.query.subType) {
        this.searchStr += '&subtype=' + this.query.subType;
      }
    }
    url += this.searchStr;
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

  clearQuery() {
    this.searchStr = '';
    this.query = {
      metric: '',
      type: null,
      subType: ''
    };
    this.page = 0;
    this.getMetricsList('next');
  }

}

coreModule.controller('MetricsDefCtrl', MetricsDefCtrl);
