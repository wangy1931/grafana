///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import {QueryCtrl} from 'app/plugins/sdk';

export class AlertDQueryCtrl extends QueryCtrl {
  static templateUrl = 'partials/query.editor.html';
  methods: Array<any>;
  errors: any;
  addTagMode: boolean;
  addFilterMode: boolean;

  /** @ngInject **/
  constructor($scope, $injector) {
    super($scope, $injector);
    this.methods = ['GET', 'POST'];
    this.errors = this.validateTarget();
  }

  addTag() {

    if (!this.addTagMode) {
      this.addTagMode = true;
      return;
    }

    if (!this.target.params) {
      this.target.params = {};
    }

    this.errors = this.validateTarget();

    if (!this.errors.tags) {
      this.target.params[this.target.currentTagKey] = this.target.currentTagValue;
      this.target.currentTagKey = '';
      this.target.currentTagValue = '';
      this.targetBlur();
    }

    this.addTagMode = false;
  }

  targetBlur() {
    this.errors = this.validateTarget();
    this.refresh();
  }

  removeTag(key) {
    delete this.target.params[key];
    this.targetBlur();
  }

  editTag(key, value) {
    this.removeTag(key);
    this.target.currentTagKey = key;
    this.target.currentTagValue = value;
    this.addTag();
  }

  validateTarget() {
    var errs: any = {};

    if (this.target.params && _.has(this.target.params, this.target.currentTagKey)) {
      errs.tags = "Duplicate tag key '" + this.target.currentTagKey + "'.";
    }

    return errs;
  }
}
