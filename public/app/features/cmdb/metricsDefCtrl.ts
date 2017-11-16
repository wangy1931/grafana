///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';

const SIZE = 15;
export class MetricsDefCtrl {
  metricList: Array<any>;
  metricCur: any;
  metricEdit: any;
  typeList: Array<any>;
  query: any;
  params: any;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private contextSrv) {
    this.params = {
      size: SIZE,
    };
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

  getMetricsList(page, query?) {
    if (query) {
      page = 1;
      if (query.metric) {
        this.params.name = query.metric;
      } else if (query.type) {
        this.params.type = query.type.type;
        if (query.subType) {
          this.params.subtype = query.subtype;
        }
      }
    } else if (page < 1) {
      page = 1;
      this.$scope.appEvent('alert-warning', ['已经是第一页了']);
      return;
    }
    this.params.page = page;
    this.backendSrv.getMetricInfo(this.params).then((res) => {
      if (this.params.name) {
        if (_.isNull(res.data)) {
          this.metricList = [];
        } else {
          this.metricList = [res.data];
        }
      } else {
        this.metricList = res.data;
        if (res.data.length < SIZE) {
          this.params.page--;
          this.$scope.appEvent('alert-warning', ['已经是最后一页了']);
        }
      }
    });
  }

  getDetailById(metric) {
    if (this.metricCur && this.metricCur.id === metric.id) {
      this.metricCur.id = -1;
      return;
    }
    this.backendSrv.getMetricInfo({id: metric.id}).then((res) => {
      this.metricCur = res.data;
      this.metricCur.disabled = true;
      this.metricCur.subTypes = _.find(this.typeList, {type: this.metricCur.type}).subType;
    });
  }

  edit() {
    this.metricCur.disabled = false;
    this.metricEdit = _.cloneDeep(this.metricCur);
  }

  update() {
    this.metricCur.disabled = true;
    var params = {
      id: this.metricCur.id,
      userId: this.contextSrv.user.id
    };
    this.backendSrv.updateMetricInfo(params, this.metricCur).then((res) => {
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
    this.query = {
      metric: '',
      type: null,
      subType: ''
    };
    this.params.name && delete this.params.name;
    this.params.type && delete this.params.type;
    this.params.subType && delete this.params.subType;
    this.params.page = 1;
    this.getMetricsList(this.params.page);
  }
}

coreModule.controller('MetricsDefCtrl', MetricsDefCtrl);
