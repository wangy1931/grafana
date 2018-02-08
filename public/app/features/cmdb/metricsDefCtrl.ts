 

import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';

const SIZE = 15;
export class MetricsDefCtrl {
  metricList: Array<any>;
  metricCur: any;
  typeList: Array<any>;
  query: any;
  params: any;
  suggestMetrics: any;

  /** @ngInject */
  constructor(private $scope, private metricSrv, private contextSrv) {
    this.params = {
      size: SIZE,
    };
    this.clearQuery();
    this.getSubtype();
  }


  getSubtype() {
    this.metricSrv.getSubtype().then((res) => {
      this.typeList = res.data;
      _.each(this.typeList, (item) => {
        if (item.sysId) {
          item.name = '系统';
        } else {
          item.name = '服务';
        };
        item.software = _.uniqBy(item.software, 'name');
      });
    });
  }

  getMetricsList(page, query?) {
    if (query) {
      page = 1;
      if (query.metric) {
        this.params.name = query.metric;
      } else {
        delete this.params.name;
        if (query.type) {
          this.params.type = query.type.name;
          if (query.subType) {
            this.params.subtype = query.subType.name;
          }
        }
      }
    } else if (page < 1) {
      page = 1;
      this.$scope.appEvent('alert-warning', ['已经是第一页了']);
      return;
    }
    this.params.page = page;
    this.metricSrv.getMetricInfo(this.params).then((res) => {
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

  getDetailById(metric, cancel?) {
    if (!cancel && this.metricCur && this.metricCur.id === metric.id) {
      this.metricCur.id = -1;
      return;
    }
    this.metricCur = _.cloneDeep(metric);
    this.metricCur.disabled = true;
    this.metricCur.subTypes = _.find(this.typeList, { name: this.metricCur.type }).software;
    this.metricCur.subType = _.find(this.metricCur.subTypes, { name: metric.subType });
  }

  edit() {
    this.metricCur.disabled = false;
  }

  update(metric, index) {
    var subTypes = _.cloneDeep(this.metricCur.subTypes);
    delete this.metricCur.subTypes;
    var tmp = _.cloneDeep(this.metricCur.subType);
    this.metricCur.subType = this.metricCur.subType.name;
    var params = {
      id: this.metricCur.id,
      userId: this.contextSrv.user.id
    };
    this.metricSrv.updateMetricInfo(params, this.metricCur).then((res) => {
      this.metricCur.disabled = true;
      this.$scope.appEvent('alert-success', ['保存成功']);
      this.metricList[index] = _.cloneDeep(this.metricCur);
      this.metricCur.subType = _.cloneDeep(tmp);
      this.metricCur.subTypes = _.cloneDeep(subTypes);
    }, () => {
      this.getDetailById(metric, true);
      this.$scope.appEvent('alert-danger', ['保存失败']);
    });
  }

  clearQuery() {
    if (this.query) {
      delete this.query.metric;
      delete this.query.type;
      delete this.query.subType;
    }
    delete this.params.name;
    delete this.params.type;
    delete this.params.subtype;
    delete this.params.kpi;
    delete this.params.custom;
    this.params.page = 1;
    this.getMetricsList(this.params.page);
  }

  getSuggest() {
    this.metricSrv.getSuggest(this.query.metric).then((res) => {
      this.suggestMetrics = res.data;
      _.each(this.suggestMetrics, (suggest, index) => {
        this.suggestMetrics[index] = _.getMetricName(suggest);
      });
    });
  }

  changeType(type?) {
    type ? this.metricCur.subTypes = _.find(this.typeList, { name: type }).software
    : this.query.subType = this.query.type.software[0];
  }

  getSubtypeAlias(metric) {
    var subtypes = _.find(this.typeList, {name: metric.type}) || {};
    var subtype = _.find(subtypes.software, {name: metric.subType}) || {};
    return subtype.alias || metric.subType;
  }
}

coreModule.controller('MetricsDefCtrl', MetricsDefCtrl);
