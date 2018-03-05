
import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from '../../core/core_module';
import noUiSlider from 'vendor/angular-other/nouislider.min';

export class AlertAssociationCtrl {
  targetObj: any;
  isSingle: boolean;
  suggestTagHost: any;
  datasource: any;
  serviceEvents: Array<any>;
  tableParams: any;
  annotationTpl: any;
  timeRange: any;

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
    private NgTableParams,
    private $translate,
    private staticSrv
  ) {
    this.targetObj = _.extend({}, {
      metric: "",
      host: "",
      start: "",
      min: 900,
      max: 1000,
    }, this.$location.search());
    if (!this.targetObj.metric) {
      this.targetObj = _.extend({}, associationSrv.sourceAssociation);
      this.$location.search(this.targetObj);
    }

    this.annotationTpl = {
      source: {
        "datasource": "opentsdb",
        "enable": true,
        "iconColor": "#C0C6BE",
        "iconSize": 13,
        "lineColor": "rgba(88, 110, 195, 0.86)",
        "name": "ceshi",
        "target": "cpu.usr",
        "showLine": true,
        "textField": "123",
        "timeField": ""
      },
      min: 1495032982939,
      max: 1495032982939,
      eventType: "123",
      title: ":",
      tags: "事件触发时间: ",
      text: "",
      scope: 1
    };

    $controller('OpenTSDBQueryCtrl', {$scope: this.$scope});
    datasourceSrv.get('opentsdb').then(datasource => {
      this.$scope.datasource = datasource;
    });

    $scope.$on('destroy', () => {
      alertMgrSrv.resetCurrentThreshold({ warn: null, crit: null });
    });

    $scope.onAppEvent('time-range-changed', (e, params) => {
      this.timeRange = {
        start: timeSrv.timeRange().from.unix(),
        end: timeSrv.timeRange().to.unix()
      }
      this.getServiceEvents();
    });
  }

  init() {
    this.backendSrv.getHosts({
      "queries": [],
      "hostProperties": ["id"]
    }).then(response => {
      this.suggestTagHost = _.map(response.data, 'hostname');
    });

    if (this.targetObj.metric && this.targetObj.metric !== "undefined") {
      if (!this.$scope.dashboard) {
        this.createAlertMetricsGraph(this.targetObj.metric, this.targetObj.host);
      } else {
        var metric = _.getMetricName(this.targetObj.metric)
        this.$scope.dashboard.rows[0].panels[0].title = metric;
        this.$scope.dashboard.rows[0].panels[0].targets[0].metric = metric;
        this.$scope.dashboard.rows[0].panels[0].targets[0].tags.host = this.targetObj.host;
      }
    }

    this.timeRange = (this.targetObj.start === "undefined")
      ? { start: moment().subtract(6, 'hour').unix(), end: moment().unix() }
      : { start: moment(+this.targetObj.start).subtract(6, 'hour').unix(), end: this.targetObj.start }
    this.getServiceEvents();
  }

  createAlertMetricsGraph(metric, host) {
    this.staticSrv.getDashboard('alert_association').then(response => {
      // store & init dashboard
      var dashboard = response;

      dashboard = this.fillRowData(dashboard, {
        "\\$TABLOG": this.$translate.i18n.page_logs_tab_log,
        "\\$TABCLUSTER": this.$translate.i18n.page_logs_tab_cluster,
        "\\$TABCOMPARE": this.$translate.i18n.page_logs_tab_contrast,
      });
      // association graph
      dashboard.rows[0].panels[0].title = metric;
      dashboard.rows[0].panels[0].targets[0].metric = metric;
      dashboard.rows[0].panels[0].targets[0].tags.host = this.targetObj.host;
      dashboard.rows[0].panels[0].grid.threshold1 = this.alertMgrSrv.currentCritialThreshold;
      dashboard.rows[0].panels[0].grid.threshold2 = this.alertMgrSrv.currentWarningThreshold;
      dashboard.rows[0].panels[0].thresholds[0].value = this.alertMgrSrv.currentCritialThreshold;
      dashboard.rows[0].panels[0].thresholds[1].value = this.alertMgrSrv.currentWarningThreshold;

      // logs
      var type = _.metricPrefix2Type(metric.split(".")[0]);
      this.query = `type:${type} AND host:${host} AND (error OR exception)`;
      dashboard.rows[2].panels[0].targets[0].query = this.query;
      dashboard.rows[2].panels[1].targets[0].query = this.query;
      dashboard.rows[2].panels[2].targets[0].query = this.query;
      dashboard.rows[2].panels[2].targets[1].query = this.query;

      this.$scope.initDashboard({
        meta: {canStar: false, canShare: false, canEdit: false, canSave: false},
        dashboard: dashboard,
      }, this.$scope);
    });

    this.associationSrv.setSourceAssociation(_.extend({}, this.targetObj, {
      metric: this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.' + this.targetObj.metric
    }));
    this.$scope.$emit('analysis', this.associationSrv);
  }

  analysis() {
    this.init();

    var searchParams = _.extend({}, this.$location.search(), {
      metric: this.targetObj.metric,
      host: this.targetObj.host
    });
    this.$location.search(searchParams);
  }

  getServiceEvents() {
    this.backendSrv.alertD({
      method: 'GET',
      url   : '/service/events',
      params: this.timeRange
    }).then((response) => {
      response.data.forEach((item) => {
        item.type = (item.type === 'Start') ? '启动' : '停止';
        item.time = _.transformTime(item.timestamp);
      });
      this.serviceEvents = _.filter(response.data, { hostname: this.targetObj.host });
      this.tableParams = new this.NgTableParams({ count: 5 }, {
        counts: [],
        dataset: this.serviceEvents,
      });
    });
  }

  addAnnotation(row) {
    if (row.checked) {
      this.$scope.dashboard.manualAnnotation.push(_.extend({}, this.annotationTpl, {
        id: row.pid,
        min: row.timestamp * 1000,
        max: row.timestamp * 1000,
        title: "事件触发时间",
        tags: row.type,
        text: "[事件] " + row.service,
        eventType: row.type
      }));
    } else {
      _.remove(this.$scope.dashboard.manualAnnotation, { id: row.pid, eventType: row.type });
    }
    this.$rootScope.$broadcast('refresh', this.$scope.dashboard.rows[0].panels[0].id);
  }

  showGuideResult(e, params) {
    _.extend(this.targetObj, params);
    this.analysis();
  }

  // Logs
  // Note: 日志查询没有复用 日志搜索 的代码，因为日志搜索之后会大幅度重构，现在写暂时没有意义
  reQuery() {
    var panels = this.$scope.dashboard.rows[2].panels;
    panels[0].targets[0].query = this.query;
    panels[1].targets[0].query = this.query;
    panels[2].targets[0].query = this.query;
    panels[2].targets[1].query = this.query;

    this.$rootScope.$broadcast('refresh', [panels[0].id, panels[1].id, panels[2].id]);
  }

  fillRowData(row, patternMap) {
    row = JSON.stringify(row);
    for (var pattern in patternMap) {
      row = row.replace(new RegExp(pattern, "g"), patternMap[pattern]);
    }
    return JSON.parse(row);
  }
}
coreModule.controller('AlertAssociationCtrl', AlertAssociationCtrl);

coreModule.directive('slider', () => {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope: any, element) {
      noUiSlider.create(element[0], {
        start: [scope.ctrl.associationSrv.sourceAssociation.min || 900, scope.ctrl.associationSrv.sourceAssociation.max || 1000],
        connect: true,
        tooltips: false,
        step: 10,
        range: {
          'min': 10,
          'max': 1000
        },
      });
      scope.$parent.thresholdSlider = (<any>element[0]).noUiSlider;
      scope.$parent.thresholdSlider.on('change', () => {
        scope.$emit('analysis', 'thresholdSlider');
      })
    }
  };
});
