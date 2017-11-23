///<reference path="../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import Diff from 'jsdiff';
import logsDash from './logsDash';
import coreModule from '../../core/core_module';

export class LogsCtrl {
  private currentTab: number = 0;
  private currentLogTab: number = 0;
  private panelMetas: any = logsDash.rows;
  private logClusterPanel: any = logsDash.logClusterPanel;
  private logComparePanel: any = logsDash.logComparePanel;
  private textTitle: any;

  query: string;
  size: number;
  timeShift: any;
  currentRelativeTime: any;
  logFilter: any;
  currentFilter: any;
  timeRange: any;
  row: any;
  tabsCache: any;
  resultCache: any;
  selectedCompare: any;
  tabs: Array<any>;
  queryInputOptions: Array<any>;
  showSearchGuide: boolean;
  showAddRCA: boolean;
  logsSelected: Array<any>;

  /** @ngInject */
  constructor(
    private $scope, private $rootScope, private $modal, private $q, private $location,
    private contextSrv, private timeSrv, private datasourceSrv, private backendSrv, private alertMgrSrv
  ) {
    this.tabs = [
      {
        "active": true,
        "title": "日志搜索 1",
        "id": 1,  // should be the same with panelMeta[0].id
      }
    ];

    this.query = $location.search().query || "*";
    this.size = 500;
    this.timeShift = "-1d";
    this.logFilter = "";
    this.currentRelativeTime = "1天以前";
    this.currentFilter = "无";
    this.resultCache = {};
    this.tabsCache = {};
    this.logsSelected = [];

    // 搜索框帮助
    this.queryInputOptions = [
      { key: 'host:', helpInfo: '查询特定host日志 (例如: host:centos1)' },
      { key: 'type:', helpInfo: '查询特定type日志 (例如: type:mysql)' },
      { key: 'message:', helpInfo: '查询正则匹配的日志 (例如: message:/INFO/)' },
      { key: 'AND', helpInfo: '联合查询' },
      { key: 'OR', helpInfo: '联合查询' },
      { key: 'NOT', helpInfo: '联合查询' }
    ];

    this.$location.search().guide && (this.showAddRCA = true);

    // cache repsonse data when datasource.query successed
    $scope.$on('data-saved', (event, payload) => {
      var curTabId = $scope.dashboard.rows[0].id;
      !this.resultCache[curTabId] && (this.resultCache[curTabId] = {});
      this.resultCache[curTabId][payload.id] = payload.data;

      this.saveCurQueryInfo(curTabId);
    });

    $scope.$on('select-log', (event, payload) => {
      if (payload.checked) {
        this.logsSelected.push(payload);
      } else {
        _.remove(this.logsSelected, payload);
      }
    });

    $scope.$on('$destroy', function() {
      $('body').off('click', '.tab-2 tbody tr td:nth-child(2)');
    });
  }

  // replace log dashboard's variables in logsDash.ts
  private fillRowData(row, patternMap) {
    row = JSON.stringify(row);
    for (var pattern in patternMap) {
      row = row.replace(new RegExp(pattern, "g"), patternMap[pattern]);
    }
    return JSON.parse(row);
  }

  // 记住当前的 query 等信息
  private saveCurQueryInfo(tabId) {
    var queryInfo = {
      "query": this.query,
      "size" : this.size,
      "timeShift": this.timeShift,
      "currentRelativeTime": this.currentRelativeTime,
      "logFilter": this.logFilter,
      "currentFilter": this.currentFilter,
      "timeRange": this.timeSrv.timeRange(angular.copy(this.$scope.dashboard.time)),  // save absolute time
      "row": angular.copy(this.$scope.dashboard.rows[0])
    };
    this.tabsCache[this.$scope.dashboard.rows[0].id] = queryInfo;
  }

  // reset dashboard rows when change current tab
  private resetRow(tabId?) {
    this.saveCurQueryInfo(tabId);

    // reset for view
    Object.assign(this.$scope.ctrl, tabId ? this.tabsCache[tabId] : {
      "query": "",
      "size": "500",
      "timeShift": "-1d",
      "currentRelativeTime": "1天以前",
      "logFilter": "",
      "currentFilter": "无"
    });

    // reset for requesting dashboard
    var panels = this.$scope.dashboard.rows[0].panels;
    _.forEach(panels, (panel) => {
      panel.scopedVars && panel.scopedVars.logFilter && (panel.scopedVars.logFilter = tabId ? this.tabsCache[tabId].logFilter : "");
      _.forEach(panel.targets, (target) => {
        target.size && (target.size = tabId ? this.tabsCache[tabId].size : 500);
        (typeof target.query !== "undefined") && (target.query = tabId ? this.tabsCache[tabId].query : "");
        (typeof target.timeShift !== "undefined") && (target.timeShift = tabId ? this.tabsCache[tabId].timeShift : "-1d");
      });
    });
    this.$scope.dashboard.rows[0].id = tabId ? tabId : this.$scope.dashboard.rows[0].id + 1;

    // NOTE: 1) 直接修改 $scope.dashboard.time 且 broadcast refresh 了.没有作用. why?
    //       2) timeSrv.setTime() will broadcast "refresh", 所以在修改了 size/query/id 等设置之后调用. 否则上面的修改没有意义.
    //          而如果直接修改 rows[0], 会触发 refresh 两次.
    this.timeSrv.setTime(tabId ? this.tabsCache[tabId].timeRange : { from: "now-6h", to: "now" });
  }

  // prepare for jsdiff data
  private transformToDiffData(data) {
    var list = [[], []];

    _.forEach(data, (item) => {
      _.forEach(item.members, (member) => {
        list[member.group].push({
          'cluster': item.message,
          'member' : member.message,
          '_id': member.id,
          'timestamp': member.timestamp
        });
      });
    });

    list[0] = _.sortBy(list[0], ['timestamp']);
    list[1] = _.sortBy(list[1], ['timestamp']);
    return list;
  }

  // search help
  selectQueryOption(queryKey) {
    (this.query === "*" || this.query === undefined) && (this.query = "");
    this.query = this.query +  " " + queryKey;
    $("#dropdownMenu1").focus();
  }

  showQueryOption(event) {
    var code = parseInt(event.keyCode || event.which);
    (code === 32) && $("#dropdownMenu1").click();  // Space Code
  }

  // tab: 日志对比
  logCompare(timeShift) {
    this.timeShift = timeShift;
    this.$scope.dashboard.rows[0].panels[2].targets[1].timeShift = timeShift;
    this.$rootScope.$broadcast('refresh', this.$scope.dashboard.rows[0].panels[2].id);
    this.currentRelativeTime = timeShift.replace("-", "").replace("d", "天") + "以前";
  }

  // tab: 日志对比 - 过滤条件
  logFilterOperator(rule) {
    this.logFilter = rule;
    this.$scope.dashboard.rows[0].panels[2].scopedVars.logFilter = rule;
    this.$rootScope.$broadcast('refresh', this.$scope.dashboard.rows[0].panels[2].id);
    this.currentFilter = rule === "" ? "无" : rule + "日志";
  }

  // tab: 日志对比 - 自定义对比时间
  showInputModal() {
    var newScope = this.$scope.$new();
    newScope.logCompare = this.logCompare;
    newScope.shift = "-1d";
    this.$scope.appEvent('show-modal', {
      src: 'public/app/features/logs/partials/input_time_shift.html',
      modalClass: 'modal-no-header confirm-modal',
      scope: newScope
    });
  }

  // 横向对比
  showSearchCompareModal() {
    // prepare for select ng-model
    _.forEach(this.tabs, (item) => {
      var tabId = item.id;
      if (!this.tabsCache[tabId]) { return; }
      item.queryHeader = this.resultCache[tabId].queryHeader;
    });

    var searchCompareModal = this.$modal({
      scope: this.$scope,
      templateUrl: '/public/app/features/logs/partials/log_search_compare_modal.html',
      show: false
    });
    searchCompareModal.$promise.then(searchCompareModal.show);
  }

  // 横向对比
  getSearchQuery(index) {
    return (selected) => {
      this.textTitle[index] = selected.title;
      this.selectedCompare[index] = selected;
    };
  }

  // 横向对比
  logSearchCompare() {
    if (!this.selectedCompare.length) { return; }
    var payload = _.map(this.selectedCompare, "queryHeader").join('');

    this.backendSrv.logCluster({
      method: "POST",
      url: "/log/diff",
      data: payload
    }).then((res) => {
      var list = this.transformToDiffData(res.data);
      $("#diffoutput").html(Diff.buildView({
        baseTextLines: _.map(list[0], 'cluster').join("\n"),
        newTextLines : _.map(list[1], 'cluster').join("\n"),
        baseTextName : this.textTitle[0],
        newTextName  : this.textTitle[1],
        viewType     : 0
      }));
    });
  }

  // 查询
  reQuery() {
    var ids = [this.$scope.dashboard.rows[0].panels[this.currentTab].id, this.$scope.dashboard.row[0].panels[4].id]
    var panels = this.$scope.dashboard.rows[0].panels;
    _.forEach(panels, (panel) => {
      _.forEach(panel.targets, (target) => {
        target.query = this.query;
      });
    });

    this.$rootScope.$broadcast('refresh', ids);
  }

  getLogSize(size) {
    var panels = this.$scope.dashboard.rows[0].panels;
    size = parseInt(size);
    _.forEach(panels, (panel) => {
      _.forEach(panel.targets, (target) => {
        if (parseInt(target.size) === size) { return; }
        target.size && (target.size = size);
      });
    });

    this.$rootScope.$broadcast('refresh');
  }

  init() {
    var row = _.cloneDeep(this.panelMetas[0]);
    row = this.fillRowData(row, {
      "\\$SIZE": this.size,
      "\\$QUERY": this.query,
      "\\$TIMESHIFT": this.timeShift,
      "\\$LOGFILTER": this.logFilter
    });

    this.$scope.initDashboard({
      meta: {canStar: false, canShare: false, canEdit: false, canSave: false},
      dashboard: {
        title: "日志全文搜索",
        id: "123",
        rows: [row],
        time: { from: moment.unix(1510640070), to: moment.unix(1511331270) }
      }
    }, this.$scope);

    // 优化: 绑定事件写在 panel table render 里
    $('body').on('click', '.tab-2 tbody tr td:nth-child(2)', function () {
      var newScope = this.$scope.$new();
      var cid = parseInt($(this).next().find('div:eq(0)').text());
      var curTabId = this.$scope.dashboard.rows[0].id;

      newScope.bsTableData = _.findWhere(this.resultCache[curTabId].logCluster, {'cid': cid}).members;
      var clusterLogSourceModal = this.$modal({
        scope: newScope,
        templateUrl: 'public/app/features/logs/partials/log_cluster_modal.html',
        show: false
      });

      clusterLogSourceModal.$promise.then(clusterLogSourceModal.show);
    });
  }

  // 新建 日志搜索tab
  pushTab() {
    this.currentLogTab = Object.keys(this.tabsCache).length;
    this.resetRow();

    this.tabs.push({
      "active": true,
      "title": "日志搜索 " + this.$scope.dashboard.rows[0].id,
      "id": this.$scope.dashboard.rows[0].id
    });
  }

  // 切换 日志搜索1-n
  switchCurLogTab(tabId, index) {
    if (+this.$scope.dashboard.rows[0].id === +tabId) { return; }
    this.currentLogTab = tabId;

    // 优化: 当前所有数据加载完成 才允许切换
    this.resetRow(tabId);
  }

  // 懒加载 聚合&对比，只对第一次有用
  logOperate(tab) {
    this.currentTab = tab;

    // var row = tab === 1 ? _.cloneDeep(logClusterPanel) : _.cloneDeep(logComparePanel);
    // row = fillRowData(row, {
    //   "\\$SIZE": $scope.size,
    //   "\\$QUERY": $scope.query,
    //   "\\$TIMESHIFT": $scope.timeShift,
    //   "\\$LOGFILTER": $scope.logFilter
    // });
    // $scope.dashboard.rows[0].panels[tab] = row;
  }

  // 隐藏 搜索提示框
  hideGuide() {
    this.showSearchGuide = false;
  }

  // 添加 rca 反馈
  addRCA() {
    var newScope = this.$scope.$new();
    var searchParams = this.$location.search();
    var prefix = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';
    _.extend(newScope, {
      logsSelected: this.logsSelected,
      alertData: searchParams,
      confidenceLevel: 100
    });
    newScope.addCause = (causeHost, confidenceLevel, reason) => {
      var rcaFeedback = {
        alertIds: [],
        timestampInSec: Math.round(new Date().getTime() / 1000),
        triggerMetric: {
          name: prefix + searchParams.metric,
          host: searchParams.host,
        },
        rootCauseMetrics: [{
          name: prefix + reason,
          host: '*', // causeHost,
          confidenceLevel: confidenceLevel,
          type: "NUMERICAL_FROM_LOG",
          description: JSON.stringify(this.logsSelected)
        }],
        relatedMetrics: [],
        org: this.contextSrv.user.orgId,
        sys: this.contextSrv.user.systemId
      };

      this.alertMgrSrv.rcaFeedback(rcaFeedback);
    };

    var rcaFeedbackModal = this.$modal({
      scope: newScope,
      templateUrl: '/public/app/features/logs/partials/log_feedback_modal.html',
      show: false
    });
    rcaFeedbackModal.$promise.then(rcaFeedbackModal.show);
  }
}

coreModule.controller('LogsCtrl', LogsCtrl);
