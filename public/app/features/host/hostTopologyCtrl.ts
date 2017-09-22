import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import 'd3.graph';
import { coreModule } from 'app/core/core';

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
  currentHost: any;
  currentTab: number;
  hostSummary: Array<any>;

  /** @ngInject */
  constructor (private hostSrv, private alertSrv, private backendSrv, private popoverSrv, private $scope, private $controller) {
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
    this.currentTab  = 0;

    $scope.$watch('ctrl.currentHost', newValue => {
      if (!newValue) { return; }
      var host = newValue.name ? newValue : {};
      this.render(host);
    });
  }

  init() {
    this.tabs[0].active = true;

    this.getHostTopology();
    this.getAllTagsKey();

    this.$controller('SystemOverviewCtrl', { $scope: this.$scope }).getHostSummary();
  }

  render(host) {
    if (host.name) {
      window.d3.selectAll('.relationshipGraph-block').classed('selected', false);
      window.d3.select(`#${host.__id}`).classed('selected', true);

      _.extend(this.tabs[4], { show: true, disabled: false });
      _.extend(this.tabs[5], { show: true, disabled: false });

      this.switchTab(this.currentTab);
      this.getProcess(this.currentHost);
      this.getHostInfo(this.currentHost);
    } else {
      window.d3.selectAll('.relationshipGraph-block').classed('selected', false);

      _.extend(this.tabs[4], { show: false, disabled: true });
      _.extend(this.tabs[5], { show: false, disabled: true });

      this.tabs[0].active = true;
      this.getHostList({});
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
          child: this.nodeClickHandle.bind(this)
        }
      }));

      this.rendered = true;
      this.heatmap.data(this.data);
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

  getHostList(host) {
    this.saveHostSummary();

    var tableData = host.name ? _.filter(this.hostSummary, { host: host.name }) : this.hostSummary;
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
    this.hostSrv.getHostProcess(host._private_.id).then(response => {
      this.$scope.bsTableData = response.data;
      this.$scope.$broadcast('load-table');
    });
  }

  getHostInfo(host) {
    // not able to set $location.search(id, id), so request cmdb directly
    // copy from AlertDetailCtrl
    this.$scope.id = host._private_.id;
    this.backendSrv.alertD({
      url: `/cmdb/host?id=${host._private_.id}`
    }).then(response => {
      this.$scope.detail = response.data;
      this.$scope.tags = angular.copy(response.data.tags);
      this.$scope.cpuCount = _.countBy(response.data.cpu);
      this.$scope.detail.isVirtual = this.$scope.detail.isVirtual ? '是' : '否';
      this.$scope.detail = _.cmdbInitObj(this.$scope.detail);
    });
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
    var dashboard;
    this.currentTab = tabId;

    if (tabId === 0) {
      this.getHostList(this.currentHost);
    }
    if (tabId === 1) {
      !dashboard && this.backendSrv.getDashboard('db', 'machine').then(response => {
        dashboard = response;
        this.$scope.initDashboard(response, this.$scope);
      });
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

  saveHostSummary() {
    _.isEmpty(this.hostSummary) && (this.hostSummary = this.$scope.hostPanels);
  }

  clearSelected() {
    this.currentHost = {};
  }

};

coreModule.controller('HostTopologyCtrl', HostTopologyCtrl);
