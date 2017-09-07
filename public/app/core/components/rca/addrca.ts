///<reference path="../../../headers/common.d.ts" />

import angular from 'angular';
import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import coreModule from '../../core_module';

export class AddRcaCtrl {
  isOpen: boolean;
  symptomHost: any;
  symptomMetric: any;
  causeHost: any;
  causeMetric: any;
  confidenceLevel: any;
  rootCauseMetrics: Array<Object>;
  confidences: any;


  /** @ngInject */
  constructor(private $scope, private $location, private backendSrv, private contextSrv, private $rootScope, private alertMgrSrv) {
    $rootScope.onAppEvent('show-add-rac', this.openAddRca.bind(this), $scope);
    $rootScope.onAppEvent('hide-add-rac', this.dismiss.bind(this), $scope);
  }

  openAddRca(option) {
    this.isOpen = true;
    var rcaData = option.targetScope.mainScope.rcaData;
    this.symptomHost = rcaData.symptomHost;
    this.symptomMetric = rcaData.symptomMetric;
    this.causeHost = rcaData.causeHost;
    this.causeMetric = rcaData.causeMetric;
    this.confidenceLevel = rcaData.confidenceLevel || '100';
    this.rootCauseMetrics = [];
    this.confidences = {
      '100': '非常确定',
      '50': '可能'
    };
  };

  dismiss() {
    this.isOpen = false;
  };

  cancleBubble($event) {
    $event.stopPropagation();
  };

  addCause(causeMetric,causeHost,confidenceLevel) {
    if (_.every([causeMetric,causeHost,confidenceLevel])) {
      this.causeMetric = '';
      this.causeHost = '';
      this.rootCauseMetrics.push({
        name: causeMetric,
        host: causeHost,
        confidenceLevel: confidenceLevel
      });
    }
  };

  removeCause = function (index) {
    this.rootCauseMetrics.splice(index, 1);
  };

  addRca() {
    var prox = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.'
    var rcaFeedback = {
      alertIds: [],
      timestampInSec: Math.round(new Date().getTime()/1000),
      triggerMetric: {
        name: this.symptomMetric,
        host: this.symptomHost,
      },
      rootCauseMetrics: _.cloneDeep(this.rootCauseMetrics),
      relatedMetrics: [],
      org: this.contextSrv.user.orgId,
      sys: this.contextSrv.user.systemId
    };
    rcaFeedback.triggerMetric.name = prox + rcaFeedback.triggerMetric.name;
    if (_.every([this.causeMetric,this.causeHost,this.confidenceLevel])) {
      rcaFeedback.rootCauseMetrics.push({
        name: this.causeMetric,
        host: this.causeHost,
        confidenceLevel: this.confidenceLevel
      });
    }
    if (!rcaFeedback.rootCauseMetrics.length) {
      this.$scope.appEvent('alert-warning', ['添加失败','请完整填写根源指标信息']);
      return;
    }

    _.each(rcaFeedback.rootCauseMetrics, function(cause) {
      cause.name = prox + cause.name;
      cause.confidenceLevel = parseInt(cause.confidenceLevel);
    });

    this.alertMgrSrv.rcaFeedback(rcaFeedback).then((response) => {
      this.$scope.appEvent('alert-success', ['添加成功']);
      this.isOpen = false;
    }, (err) => {
      this.$scope.appEvent('alert-error', ['添加失败']);
    });
  };
}

export function addRcaDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/rca/addrca.html',
    controller: AddRcaCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
  };
}

coreModule.directive('rcaAdd', addRcaDirective);
