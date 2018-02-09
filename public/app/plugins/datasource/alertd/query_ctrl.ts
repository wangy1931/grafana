///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import {QueryCtrl} from 'app/plugins/sdk';

export class AlertDQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  apis: Array<any>;
  addTagMode: boolean;
  addFilterMode: boolean;

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);
    this.apis = ['predict'];
    this.target.api = this.target.api || 'predict';
  }

  targetBlur() {
    this.refresh();
  }
}
