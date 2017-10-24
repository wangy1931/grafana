///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from '../../core/core_module';
import noUiSlider from 'slider';

export class AlertAssociationCtrl {
  targetObj: any;
  isSingle: boolean;
  suggestTagHost: any;
  datasource: any;
  dashboard: any;
  serviceEvents: Array<any>;
  tableParams: any;

  // logs
  query: string;

  /** @ngInject */
  constructor(
    private $scope,
    private $rootScope,
    private $location,
    private alertMgrSrv,
    private alertSrv,
    private $timeout,
    private contextSrv,
    private healthSrv,
    private backendSrv,
    private $controller,
    private datasourceSrv,
    private associationSrv,
    private timeSrv,
    private integrateSrv,
    private NgTableParams
  ) {
    this.targetObj = _.extend({}, {
      metric: "",
      host: "",
      distance: 300,
      start: ""
    }, this.$location.search());

    if (_.isEmpty(associationSrv.sourceAssociation)) {
      this.isSingle = true;
    } else {
      this.isSingle = false;
      // _.extend(this.targetObj, associationSrv.sourceAssociation);
    }

    $controller('OpenTSDBQueryCtrl', {$scope: this.$scope});
    datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
    });

    $scope.$on('destroy', () => {
      alertMgrSrv.resetCurrentThreshold({ warn: null, crit: null });
    });
  }

  init() {
    this.backendSrv.getHosts({
      "queries": [],
      "hostProperties": ["id"]
    }).then(response => {
      this.suggestTagHost = _.map(response.data, 'hostname');
    });

    if (this.targetObj.metric) {
      if (!this.dashboard) {
        this.createAlertMetricsGraph(this.targetObj.metric, this.targetObj.host);
      } else {
        var metric = _.getMetricName(this.targetObj.metric)
        this.dashboard.rows[0].panels[0].title = metric;
        this.dashboard.rows[0].panels[0].targets[0].metric = metric;
        this.dashboard.rows[0].panels[0].targets[0].tags.host = this.targetObj.host;
      }
    }
  }

  createAlertMetricsGraph(metric, host) {
    this.backendSrv.get('/api/static/alert_association').then(response => {
      // store & init dashboard
      this.dashboard = response;

      // association graph
      this.dashboard.rows[0].panels[0].title = metric;
      this.dashboard.rows[0].panels[0].targets[0].metric = metric;
      this.dashboard.rows[0].panels[0].targets[0].tags.host = this.targetObj.host;
      this.dashboard.rows[0].panels[0].grid.threshold1 = this.alertMgrSrv.currentCritialThreshold;
      this.dashboard.rows[0].panels[0].grid.threshold2 = this.alertMgrSrv.currentWarningThreshold;
      this.dashboard.rows[0].panels[0].thresholds[0].value = this.alertMgrSrv.currentCritialThreshold;
      this.dashboard.rows[0].panels[0].thresholds[1].value = this.alertMgrSrv.currentWarningThreshold;
      this.dashboard.annotations.list[0] = this.alertMgrSrv.annotations;

      // logs
      var type = _.metricPrefix2Type(metric.split(".")[0]);
      this.query = `type:${type} AND host:${host}`; // error & exception
      this.dashboard.rows[2].panels[0].targets[0].query = this.query;
      this.dashboard.rows[2].panels[1].targets[0].query = this.query;
      this.dashboard.rows[2].panels[2].targets[0].query = this.query;
      this.dashboard.rows[2].panels[2].targets[1].query = this.query;

      this.$scope.initDashboard({
        meta: {canStar: false, canShare: false, canEdit: false, canSave: false},
        dashboard: this.dashboard,
        manualAnnotation: this.alertMgrSrv.annotations
      }, this.$scope);
    });

    this.associationSrv.setSourceAssociation(_.extend({}, this.targetObj, {
      metric: this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.' + this.targetObj.metric
    }));
    this.$scope.$emit('analysis', this.associationSrv);

    this.getServiceEvents({
      start: this.targetObj.start === "undefined" ? moment().subtract(6, 'hour').unix() : this.targetObj.start,
      // end: this.dashboard.time.to
    });
  }

  analysis() {
    this.init();

    var searchParams = _.extend({}, this.$location.search(), {
      metric: this.targetObj.metric,
      host: this.targetObj.host
    });
    this.$location.search(searchParams);
  }

  getServiceEvents(params) {
    this.backendSrv.alertD({
      method: 'GET',
      url   : '/service/events',
      params: params
    }).then((response) => {
      response.data.forEach((item) => {
        item.type = (item.type === 'Start') ? '启动' : '停止';
        item.timestamp = _.transformTime(item.timestamp);
      });
      this.serviceEvents = response.data;
      this.tableParams = new this.NgTableParams({ count: 5 }, {
        counts: [],
        dataset: this.serviceEvents
      });
    });
  }

  addAnnotation(row) {
    if (row.checked) {

    }
  }

  showGuideResult(e, params) {
    this.targetObj = {
      metric: params.metric,
      host: params.host,
      start: params.start,
      distance: 300,
    };
    this.analysis();
  }

  // Logs
  // Note: 日志查询没有复用 日志搜索 的代码，因为日志搜索之后会大幅度重构，现在写暂时没有意义
  reQuery() {
    var panels = this.dashboard.rows[2].panels;
    panels[0].targets[0].query = this.query;
    panels[1].targets[0].query = this.query;
    panels[2].targets[0].query = this.query;
    panels[2].targets[1].query = this.query;

    this.$rootScope.$broadcast('refresh');
  }
}
coreModule.controller('AlertAssociationCtrl', AlertAssociationCtrl);

coreModule.directive('slider', () => {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope, element) {
      noUiSlider.create(element[0], {
        start: scope.ctrl.associationSrv.sourceAssociation.distance || 100,  // scope.$parent.targetObj.distance || 100,
        connect: [true, false],
        tooltips: false,
        step: 10,
        range: {
          'min': 10,
          'max': 1000
        }
      });
      scope.$parent.thresholdSlider = element[0].noUiSlider;
      scope.$parent.thresholdSlider.on('change', () => {
        // scope.$parent.targetObj.distance = scope.$parent.thresholdSlider.get();
        scope.$emit('analysis', 'thresholdSlider');
      })
    }
  };
});
