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
    private NgTableParams,
    private templateValuesSrv,
    private dynamicDashboardSrv,
    private $popover,
    private $timeout
  ) {
    this.tableParams = new this.NgTableParams({
      count: 10,
      sorting: { 'cpuPercent': 'desc' }
    }, {
      counts: []
    });

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
    this.getProcess({});
  }

  render(event, payload) {
    // this.selection = payload;
    payload = {
      from: moment(payload.from).valueOf(),
      to  : moment(payload.to).valueOf()
    }
    this.getProcess(payload);
  }

  getProcess(timeRange) {
    this.timePoint = timeRange.from ? (timeRange.from + (timeRange.to - timeRange.from) / 2) : moment().valueOf();

    var host = this.$location.search().host;
    if (!host) { return; }

    var params = _.extend({
      hostname: host
    }, timeRange);
    this.hostSrv.getProcess(params).then(response => {
      this.tableData = _.orderBy(response.data, ['cpuPercent'], ['desc']);
      this.pidList = _.map(this.tableData, 'pid');
      this.hostList = _.map(this.hostSrv.hostInfo)
      this.tableParams.settings({
        dataset: this.tableData,
      });
    }).then(this.getDashboard.bind(this));
  }

  getDashboard() {
    if (!this.dashboard) {
      this.backendSrv.get('/api/static/topn').then(response => {
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
      this.$rootScope.$broadcast('refresh');
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
        this.$rootScope.$broadcast('refresh');
      });
    } else {
      this.selected = -1;
    }
  }

};

coreModule.controller('TopNCtrl', TopNCtrl);
