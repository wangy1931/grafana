import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import 'd3.graph';
import { coreModule } from 'app/core/core';
import kbn from 'app/core/utils/kbn';

declare var window: any;

export class HostTopologyCtrl {
  query: string;
  group: string;
  filter: string;
  heatmap: any;
  data: any;  // can be modified only in getHostTopology function
  tabs: Array<any>;
  hostlist: Array<any>;
  groupOptions:  Array<any>;
  filterOptions: Array<any>;

  rendered: boolean;
  hosts: Array<any>;
  currentHost: any;  // one node information of relationshipGraph
  currentTab: number;
  hostSummary: Array<any>;
  dashboard: any;

  /** @ngInject */
  constructor (
    private hostSrv,
    private alertSrv,
    private backendSrv,
    private popoverSrv,
    private templateValuesSrv,
    private dynamicDashboardSrv,
    private $scope,
    private $rootScope,
    private $controller,
    private $location
  ) {
    $scope.ctrl = this;

    this.rendered = false;

    this.query = '*';
    this.group = '';
    this.filter = '';

    this.tabs = [
      { 'id': 0, 'title': '机器总览', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_list_table.html' },
      { 'id': 1, 'title': '系统状态', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_system_status.html' },
      { 'id': 2, 'title': '报警检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_alert_table.html' },
      { 'id': 3, 'title': '异常检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_anomaly_table.html' },
      { 'id': 4, 'title': '进程状态', 'active': false, 'show': false, 'content': 'public/app/features/host/partials/host_process.html' },
      { 'id': 5, 'title': '机器信息', 'active': false, 'show': false, 'content': 'public/app/features/host/partials/host_info.html' }
    ];

    this.groupOptions = [{ 'text': '无', 'value': '' }];
    this.filterOptions = [
      { 'text': '所有', 'value': '' },
      { 'text': '正常', 'value': 'GREEN' },
      { 'text': '警告', 'value': 'YELLOW' },
      { 'text': '严重', 'value': 'RED' },
      { 'text': '宕机', 'value': 'GREY' }
    ];

    this.currentHost = {};

    $scope.$watch('ctrl.currentHost', (newValue, oldValue) => {
      if (!newValue) { return; }
      if ((newValue === oldValue) && _.isEmpty(newValue)) { return; }

      if (_.isString(newValue)) {
        this.render(newValue);
      } else {
        var host = newValue.name ? newValue : {};
        this.render(host);
      }
    });
  }

  init() {
    var search = this.$location.search();
    this.tabs[+search.tabId || 0].active = true;
    this.currentTab = +search.tabId || 0;

    this.getHostTopology();
    this.getAllTagsKey();

    this.$controller('SystemOverviewCtrl', { $scope: this.$scope }).getHostSummary();
  }

  render(host) {
    window.d3.selectAll('.relationshipGraph-block').classed('selected', false);

    if (host.name) {
      window.d3.select(`#${host.__id}`).classed('selected', true);

      _.extend(this.tabs[4], { show: true, disabled: false });
      _.extend(this.tabs[5], { show: true, disabled: false });

      this.switchTab(this.currentTab);
      this.getProcess(this.currentHost);
      this.getHostInfo(this.currentHost);
    } else {
      _.extend(this.tabs[4], { show: false, disabled: true });
      _.extend(this.tabs[5], { show: false, disabled: true });

      this.tabs[0].active = true;
      this.currentTab = 0;
      this.switchTab(this.currentTab);
    }
  }

  getHostTopology() {
    // 有 query 机器查询时, groupby 没有意义
    if (this.query && this.query !== '*') { return; }

    var params = {};
    this.group && (params['groupby'] = this.group);

    // reset data empty
    this.data = [];

    this.hostSrv.getHostTopology(params).then(response => {
      if (_.isArray(response.data)) {
        this.hosts = response.data;
        this.hostlist = _.filter(_.map(response.data, 'hostname'));

        response.data.forEach(item => {
          this.data.push({
            parent: 'All',
            name  : item.hostname,
            value : item.healthStatusType.toLowerCase(),
            ip    : item.defaultIp,
            _private_: item
          });
        });
      } else {
        for (var prop in response.data) {
          response.data[prop].forEach(item => {
            this.data.push({
              parent: prop,
              name  : item.hostname,
              value : item.healthStatusType.toLowerCase(),
              ip    : item.defaultIp,
              _private_: item
            });
          });
        }
      }

      !this.rendered && (this.heatmap = window.d3.select('#heatmap').relationshipGraph({
        blockSize: 36,
        spacing: 2,
        maxChildCount: 10,
        showTooltip: true,
        showKeys: true,
        thresholds: ['green', 'yellow', 'red', 'grey'],
        colors: ['#66C2A5', '#FEE08B', '#9E0142', '#EEEEEE'],
        onClick: {
          parent: this.groupClickHandle.bind(this),
          child: this.nodeClickHandle.bind(this)
        }
      }));

      this.rendered = true;
      this.heatmap.data(this.data);

      var search = this.$location.search();
      if (search.id) {
        this.currentHost = _.find(this.data, { name: search.name });  // { name: search.name, id: search.id };
      }
    });
  }

  // init, get all tags key for group-options
  getAllTagsKey() {
    this.hostSrv.getAllTagsKey().then(response => {
      response.data.forEach((item, index) => {
        response.data[index] = { 'text': item, 'value': item }
      });
      this.groupOptions = [this.groupOptions[0]].concat(response.data);
    });
  }

  filterHostTopology() {
    // 有 query 机器查询时, filterby 没有意义
    if (this.query && this.query !== '*') { return; }

    var filteredData = this.filter.toLowerCase() ? _.filter(this.data, { value: this.filter.toLowerCase() }) : this.data;
    this.heatmap.data(filteredData);
  }

  queryHost(event) {
    this.saveHostSummary();

    // check this.query before sending request
    if (this.query === '' || this.query === '*') {
      this.heatmap.data(this.data);
      this.currentHost = {};
    } else if (!~this.hostlist.indexOf(this.query)) {
      this.alertSrv.set("搜索条件输入不正确", '', "warning", 2000);
    } else {
      var searchResult = this.heatmap.search({ name: this.query });
      searchResult = !_.isEmpty(searchResult) ? searchResult : _.filter(this.data, { name: this.query });

      this.heatmap.data(searchResult);
      this.currentHost = searchResult[0];
    }
  }

  nodeClickHandle(node) {
    // if event is triggered by table-row click, set node.id in node._private_
    if (node.id) {
      var elem = _.find(this.data, data => {
        return data._private_.id === node.id;
      });
      this.currentHost = elem;
    } else {
      this.currentHost = node;
      this.$scope.$digest();
    }
  }

  groupClickHandle(group) {
    this.currentHost = group;
    this.$scope.$digest();
  }

  getHostList(host) {
    var tableData, hosts;
    this.saveHostSummary();

    if (_.isString(host)) {
      hosts = _.map(_.filter(this.data, { 'parent': host }), 'name');
      tableData = _.filter(this.hostSummary, item => {
        return !!~hosts.indexOf(item.host);
      });
    } else {
      tableData = host.name ? _.filter(this.hostSummary, { host: host.name }) : this.hostSummary;
    }

    this.$scope.hostPanels = tableData;
  }

  getAlertStatus(host) {
    this.$controller('AlertStatusCtrl', { $scope: this.$scope }).init(host.name);
  }

  getAnomaly(host) {
    this.$controller('AnomalyHistory', { $scope: this.$scope }).loadHistory(
      { 'num': 1, 'type': 'hours', 'value': '1小时前', 'from': 'now-1h'}, host && host.name
    );
  }

  getProcess(host) {
    var id = this.$location.search().id;
    this.hostSrv.getHostProcess(id).then(response => {
      response.data && response.data.forEach(item => {
        item.diskIoRead = kbn.valueFormats.Bps(item.diskIoRead);
        item.diskIoWrite = kbn.valueFormats.Bps(item.diskIoWrite);
      });
      this.$scope.bsTableData = response.data;
      this.$scope.$broadcast('load-table');
    });
  }

  getHostInfo(host) {
    this.$controller('HostDetailCtrl', { $scope: this.$scope });
  }

  getDashboard(host) {
    if (!this.dashboard) {
      this.backendSrv.get('/api/static/machine_host_topology').then(response => {
        // handle dashboard
        this.addDashboardTemplating(response);

        // store & init dashboard
        this.dashboard = response;
        this.$scope.initDashboard({
          dashboard: response,
          meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
        }, this.$scope);

        host.name && this.variableUpdated(host);
      });
    } else {
      this.variableUpdated(host);
      // this.$scope.$broadcast('refresh');
    }
  }

  removeTag(tag) {
    _.remove(this.$scope.tags, tag);
    this.hostSrv.deleteTag({ hostId: this.$scope.id, key: tag.key, value: tag.value });
  };

  showPopover() {
    this.popoverSrv.show({
      element : $('.tag-add')[0],
      position: 'bottom center',
      template: '<cw-tag-picker></cw-tag-picker>',
      classes : 'tagpicker-popover',
      model : {
        tags: this.$scope.tags,
        id  : this.$scope.id
      },
    });
  };

  switchTab(tabId) {
    this.currentTab = tabId;
    this.$location.search({
      'tabId': tabId,
      'panelId': null,
      'fullscreen': null,
      'edit': null,
      'editview': null,
      'id': this.currentHost.name ? this.currentHost._private_.id : '',
      'name': this.currentHost.name ? this.currentHost.name : ''
    });
    // this.$location.search('tabId', tabId);
    // this.$location.search('panelId', null);

    if (tabId === 0) {
      this.getHostList(this.currentHost);
    }
    if (tabId === 1) {
      this.getDashboard(this.currentHost);
    }
    if (tabId === 2) {
      this.getAlertStatus(this.currentHost);
    }
    if (tabId === 3) {
      this.getAnomaly(this.currentHost);
    }
    if (tabId === 4) {}
    if (tabId === 5) {}
  }

  // add templating options dynamically
  addDashboardTemplating(dashboard) {
    this.hostlist.forEach(host => {
      dashboard.templating.list[0].options.push({
        "text": host,
        "value": host,
        "selected": false
      });
    });
    dashboard.templating.list[0].query = this.hostlist.join(',');
  }

  // change template variable value manually
  // NOTE: The reason why i have to write `$__all` instead of `*` is that `$__all` returns only one calculated record and `*` returns multiple records.
  //       Singlestat(module.ts #168) does not allow multiple series.
  //       query for `*` => host:*, query for `$__all` => host:cent0|cent1|centos24|...
  //       Otherwise, the only way is stoping use templating.
  variableUpdated(host) {
    this.dashboard.templating.list[0].current = { "text": host.name || "All", "value": host.name || "$__all", "tags": [] };

    this.templateValuesSrv.init(this.dashboard);
    this.templateValuesSrv.variableUpdated(this.dashboard.templating.list[0]).then(() => {
      this.dynamicDashboardSrv.update(this.dashboard);
      this.$rootScope.$emit('template-variable-value-updated');
      this.$rootScope.$broadcast('refresh');
    });
  }

  saveHostSummary() {
    _.isEmpty(this.hostSummary) && (this.hostSummary = this.$scope.hostPanels);
  }

  clearSelected() {
    this.currentHost = {};
  }

};

coreModule.controller('HostTopologyCtrl', HostTopologyCtrl);
