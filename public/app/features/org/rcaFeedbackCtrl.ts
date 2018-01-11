import angular from 'angular';
import _ from 'lodash';
import { coreModule } from 'app/core/core';
import 'app/plugins/datasource/opentsdb/queryCtrl';

export class RcaFeedbackCtrl {

  snoozeMin: any;
  moreMinutes: any;
  types: any;
  typeSelected: any;
  confidences: any;
  confidenceLevel: any;

  alertMetric: any;
  alertHost: any;

  causeMetric: any;
  causeHost: any;

  rootCauseMetrics: Array<any> = [];

  /** @ngInject */
  constructor (
    private $scope, private $controller,
    private contextSrv, private alertMgrSrv, private datasourceSrv
  ) {
    this.types = [
      { name: '指标', value: 'metric' },
      // { name: '一般文字', value: 'other' }
    ];
    this.typeSelected = this.types[0];

    this.confidences = { '100': '非常确定', '50': '可能' };
    this.confidenceLevel = '100';

    this.getDataSource();
  }

  changeType() {}

  getDataSource() {
    this.$controller('OpenTSDBQueryCtrl', {$scope: this.$scope});
    this.datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
    });
  }

  addCause(causeMetric, causeHost, confidenceLevel) {
    if (_.every([causeMetric, causeHost, confidenceLevel])) {
      this.causeMetric = '';
      this.causeHost = '';
      this.rootCauseMetrics.push({
        name: causeMetric,
        host: causeHost,
        confidenceLevel: confidenceLevel
      });
    }
  }

  removeCause(index) {
    this.rootCauseMetrics.splice(index, 1);
  }

  submitRCAFeedback() {
    var prefix = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';

    this.addCause(this.causeMetric, this.causeHost, this.confidenceLevel);

    if (this.rootCauseMetrics.length && this.alertMetric && this.alertHost) {
      var rcaFeedback: any = {
        org: this.contextSrv.user.orgId,
        sys: this.contextSrv.user.systemId,
        alertIds: [],
        timestampInSec: Math.round((new Date).getTime() / 1000),
        triggerMetric: {
          name: prefix + this.alertMetric,
          host: this.alertHost,
        },
        rootCauseMetrics: _.cloneDeep(this.rootCauseMetrics),
        relatedMetrics: []
      };
      _.each(rcaFeedback.rootCauseMetrics, cause => {
        cause.name = prefix + cause.name;
        cause.confidenceLevel = parseInt(cause.confidenceLevel);
      });
      this.alertMgrSrv.rcaFeedback(rcaFeedback).then(response => {
        this.$scope.appEvent('alert-success', ['报警根源添加成功']);
      }, err => {
        this.$scope.appEvent('alert-error', ['报警根源添加失败']);
      });
    }

    this.$scope.dismiss();
  }

}

coreModule.controller('RcaFeedbackCtrl', RcaFeedbackCtrl);
