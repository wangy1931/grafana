import angular from 'angular';
import _ from 'lodash';
import moment from 'moment';
import { coreModule } from 'app/core/core';
import logsDash from './logsDash';

export class LogContextCtrl {

  private logResultPanel: any = logsDash.logResultPanel;

  timeOptions: any;
  timeSelected: any;

  originRow: any;
  contextLogs: any;

  /** @ngInject */
  constructor (
    private $scope, private $controller, private $translate,
    private contextSrv, private alertMgrSrv, private datasourceSrv
  ) {
    this.timeOptions = [
      { name: `5${$translate.i18n.i18n_second}`, value: 5 },
      { name: `10${$translate.i18n.i18n_second}`, value: 10 },
      { name: `30${$translate.i18n.i18n_second}`, value: 30 },
      { name: `1${$translate.i18n.i18n_minute}`, value: 60 },
      { name: `2${$translate.i18n.i18n_minute}`, value: 120 },
      { name: `5${$translate.i18n.i18n_minute}`, value: 300 }
    ];
    this.timeSelected = this.timeOptions[0];
    this.originRow = this.$scope.$parent.$parent.originRow;

    this.getLogContext(this.timeSelected);
  }

  changeTime(timeRange) {
    this.getLogContext(timeRange);
  }

  // 日志上下文环境
  getLogContext(timeRange) {
    var query = `type: ${this.originRow._type} AND host: ${this.originRow.host} AND source: \"${this.originRow.source}\"`;
    var time = this.originRow['@timestamp'][0];

    return this.datasourceSrv.get('elk').then(datasource => {
      return datasource.query({
        cacheTimeout: '',
        format: 'json',
        interval: '30s',
        maxDataPoints: 1280,
        panelId: 1,
        range: { from: moment(+time).add(-timeRange.value, 's'), to: moment(+time).add(+timeRange.value, 's') },
        scopedVars: '',
        targets: [_.extend({}, this.logResultPanel.targets[0], {
          query: query,
          size: 500
        })],
        payload: ''
      }).then(result => {
        _.find(result.data[0].datapoints, { _id: this.originRow._id }).origin = true;
        this.contextLogs = result.data[0];

        return result.data;
      });
    });
  }

}

coreModule.controller('LogContextCtrl', LogContextCtrl);
