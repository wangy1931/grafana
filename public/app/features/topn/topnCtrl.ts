import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import { coreModule } from  'app/core/core';
import moment from 'moment';
import kbn from 'app/core/utils/kbn';

declare var window: any;

export class TopNCtrl {
  dashboard: any;
  tableParams: any;
  hostList: Array<any>;
  host: any;
  tableData: any;
  pidList: any;
  targetObj: any;
  range: any;
  selection: any;
  timePoint: any;

  currentPid: any;
  selected: any;

  /** @ngInject */
  constructor(
    private backendSrv,
    private hostSrv,
    private $location,
    private $scope,
    private $rootScope,
    private dynamicDashboardSrv,
    private $popover,
    private $timeout,
    private timeSrv,
    private staticSrv,
    private templateValuesSrv
  ) {
    this.targetObj = _.extend({}, {
      metric: "",
      host: "",
      start: "",
      pid: ""
    }, this.$location.search());

    $scope.$on('time-window-selected', this.render.bind(this), $scope);
    $scope.$on('time-window-resize', this.init.bind(this), $scope);

    // manual trigger
    $timeout(() => {
      if (!this.targetObj.host) { $('.guide-close-btn').click(); }
    }, 100);
  }

  init(event, payload) {
    this.range = payload;
    this.getProcess({
      from: payload.from.valueOf(),
      to  : payload.to.valueOf()
    });
  }

  render(event, payload) {
    // this.selection = payload;
    this.range = payload;
    this.getProcess({
      from: payload.from.valueOf(),
      to  : payload.to.valueOf()
    });
  }

  getProcess(timeRange) {
    this.tableData = [];
    this.selected = -1;

    // To Fix
    if (timeRange.from) {
      this.timePoint = timeRange.from + (timeRange.to - timeRange.from) / 2;
    }

    var host = this.$location.search().host;
    if (!host) { return; }

    var params = _.extend({
      hostname: host
    }, timeRange);
    this.hostSrv.getProcess(params).then(response => {
      this.tableData = _.orderBy(response.data, ['cpuPercent'], ['desc']);
      this.pidList = _.map(this.tableData, 'pid');
    }).then(this.getDashboard.bind(this));
  }

  getDashboard() {
    if (!this.dashboard) {
      this.staticSrv.getDashboard('topn').then(response => {
        // handle dashboard
        this.addDashboardTemplating(response);

        // store & init dashboard
        this.dashboard = response;
        this.dashboard.time = this.range;
        this.$scope.initDashboard({
          dashboard: this.dashboard,
          meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
        }, this.$scope);

        this.variableUpdated(this.targetObj);
      });
    } else {
      this.dashboard.time = this.range;
      this.variableUpdated(this.targetObj);
    }
  }

  addDashboardTemplating(dashboard) {
    // pid
    this.pidList.forEach(pid => {
      dashboard.templating.list[0].options.push({
        "text": pid,
        "value": pid,
        "selected": false
      });
    });
    dashboard.templating.list[0].query = this.pidList.join(',');
    // host
    this.hostList = _.map(this.hostSrv.hostInfo, 'host');
    this.hostList.forEach(host => {
      dashboard.templating.list[1].options.push({
        "text": host,
        "value": host,
        "selected": false
      });
    });
    dashboard.templating.list[1].query = this.hostList.join(',');
  }

  variableUpdated(obj) {
    obj.host && (this.dashboard.templating.list[1].current = { "text": obj.host || "All", "value": obj.host || "$__all", "tags": [] });

    this.templateValuesSrv.init(this.dashboard);
    this.templateValuesSrv.variableUpdated(this.dashboard.templating.list[1]).then(() => {
      this.dynamicDashboardSrv.update(this.dashboard);
      this.$rootScope.$emit('template-variable-value-updated');
      // this.timeSrv.setTime(this.range);
    });
  }

  rowClick(pid, index) {
    this.currentPid = pid;
    if (this.selected !== index) {
      this.selected = index;
      this.dashboard.templating.list[0].current = { "text": pid.toString(), "value": pid.toString(), "tags": [] };

      this.templateValuesSrv.init(this.dashboard);
      this.templateValuesSrv.variableUpdated(this.dashboard.templating.list[0]).then(() => {
        this.dynamicDashboardSrv.update(this.dashboard);
        this.$rootScope.$emit('template-variable-value-updated');
        // this.timeSrv.setTime(this.range);
      });
    } else {
      this.selected = -1;
    }
  }

};

coreModule.controller('TopNCtrl', TopNCtrl);
