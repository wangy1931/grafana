///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import {QueryCtrl} from 'app/plugins/sdk';

export class AlertDQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  apis: Array<any>;
  addTagMode: boolean;
  addFilterMode: boolean;
  suggestMetrics: any;
  suggestHosts: any;

  /** @ngInject **/
  constructor($scope, $injector, private metricSrv, private backendSrv) {
    super($scope, $injector);
    this.apis = ['predict'];
    this.target.api = this.target.api || 'predict';

    backendSrv.alertD({
      method: 'GET',
      url: '/cmdb/host'
    }).then((res) => {
      this.suggestHosts = _.map(res.data, 'hostname');
    });
  }

  targetBlur() {
    this.refresh();
  }

  getSuggestMetrics() {
    this.metricSrv.getSuggest(this.target.params.metric).then((res) => {
      this.suggestMetrics = res.data;
      _.each(this.suggestMetrics, (suggest, index) => {
        this.suggestMetrics[index] = _.getMetricName(suggest);
      });
    });
  }

}
