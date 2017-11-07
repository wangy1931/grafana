import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
// import 'd3.graph';
import { coreModule } from 'app/core/core';
import kbn from 'app/core/utils/kbn';

declare var window: any;
const HEALTH_TYPE = {
  GREEN: { TEXT: 'green', COLOR: '#66C2A5' },
  YELLOW: { TEXT: 'yellow', COLOR: '#FDAE61' },
  RED: { TEXT: 'red', COLOR: '#D53E4F' },
  GREY: { TEXT: 'grey', COLOR: '#DBE1EA' }
};

export class HostTopologyCtrl {
  data: any;  // don't modify this variable
  tabs: Array<any>;
  hostlist: Array<any>;
  predictionPanel: any;
  currentHost: any;  // one node information of relationshipGraph
  hostPanels: any;
  tableParams: any;
  tableData: Array<any>;

  currentTab: number;
  hostSummary: Array<any>;
  dashboard: any;
  topologyGraphParams: any;

  /** @ngInject */
  constructor (
    private hostSrv,
    private backendSrv,
    private popoverSrv,
    private templateValuesSrv,
    private dynamicDashboardSrv,
    private contextSrv,
    private utilSrv,
    private $scope,
    private $rootScope,
    private $controller,
    private $location,
    private NgTableParams
  ) {
    $scope.ctrl = this;
    $scope.refresh_interval = '30s';
    $scope.refresh_func = this.getProcess.bind(this);

    this.tabs = [
      { 'id': 0, 'title': '机器总览', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_list_table.html' },
      { 'id': 1, 'title': '系统状态', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_system_status.html' },
      { 'id': 2, 'title': '报警检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_alert_table.html' },
      { 'id': 3, 'title': '异常检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_anomaly_table.html' },
      { 'id': 4, 'title': '进程状态', 'active': false, 'show': false, 'content': 'public/app/features/host/partials/host_process.html' },
      { 'id': 5, 'title': '机器信息', 'active': false, 'show': false, 'content': 'public/app/features/host/partials/host_info.html' },
      { 'id': 6, 'title': '资源预测', 'active': false, 'show': false, 'content': 'public/app/features/host/partials/host_prediction.html' }
    ];

    this.topologyGraphParams = {
      blockSize: 36,
      spacing: 2,
      maxChildCount: 10,
      showTooltip: true,
      showKeys: true,
      thresholds: [HEALTH_TYPE.GREEN.TEXT, HEALTH_TYPE.YELLOW.TEXT, HEALTH_TYPE.RED.TEXT, HEALTH_TYPE.GREY.TEXT],
      colors: [HEALTH_TYPE.GREEN.COLOR, HEALTH_TYPE.YELLOW.COLOR, HEALTH_TYPE.RED.COLOR, HEALTH_TYPE.GREY.COLOR],
      onClick: {
        parent: this.groupClickHandle.bind(this),
        child: this.nodeClickHandle.bind(this)
      }
    };

    this.tableParams = new this.NgTableParams({
      count: 100,
      sorting: { 'cpuPercent': 'desc' },
    }, {
      counts: [],
    });

    this.currentHost = {};

    this.$rootScope.onAppEvent('exception-located', this.showGuideResult.bind(this), $scope);

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
    this.switchTab(this.currentTab);

    this.$scope.$on('topology-loaded', (evt, payload) => {
      this.data = payload;
      if (search.id) {
        this.currentHost = _.find(this.data, { name: search.name });
      } else {
        this.switchTab(this.currentTab);
      }
    });

    _.isEmpty(this.hostSummary) && this.hostSrv.getHostInfo().then(response => {
      this.hostPanels = response;
      this.hostSummary = response;
    });
  }

  render(host) {
    window.d3.selectAll('.relationshipGraph-block').classed('selected', false);

    if (host.name) {
      window.d3.select(`#${host.__id}`).classed('selected', true);

      [4, 5, 6].forEach(item => {
        _.extend(this.tabs[item], { show: true, disabled: false });
      });

      this.switchTab(this.currentTab);
      this.getProcess(this.currentHost);
      this.getHostInfo(this.currentHost);
      this.getHostPrediction(this.currentHost);
    } else {
      [4, 5, 6].forEach(item => {
        _.extend(this.tabs[item], { show: false, disabled: true });
      });

      this.tabs[0].active = true;
      this.currentTab = 0;
      this.switchTab(this.currentTab);
    }
  }

  nodeClickHandle(node) {
    this.saveTopologyData();

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
    this.saveTopologyData();

    if (_.isString(host)) {
      hosts = _.map(_.filter(this.data, { 'parent': host }), 'name');
      tableData = _.filter(this.hostSummary, item => {
        return !!~hosts.indexOf(item.host);
      });
    } else {
      tableData = host.name ? _.filter(this.hostSummary, { host: host.name }) : this.hostSummary;
    }

    this.hostPanels = tableData;
  }

  getAlertStatus(host) {
    this.$controller('AlertStatusCtrl', { $scope: this.$scope }).init(host.name);
  }

  getAnomaly(host) {
    this.$controller('AnomalyHistory', { $scope: this.$scope }).loadHistory(
      { 'num': 1, 'type': 'hours', 'value': '1小时前', 'from': 'now-1h'}, host && host.name
    );
  }

  getProcess(host?) {
    var id = this.$location.search().id;
    id && this.hostSrv.getHostProcess(id).then(response => {
      this.tableData = response.data;
      this.tableParams.settings({
        dataset: response.data,
      });
    });
  }

  getHostInfo(host) {
    this.$controller('HostDetailCtrl', { $scope: this.$scope });
  }

  getHostPrediction(hostObj) {
    this.predictionPanel = {};

    var host = hostObj && hostObj.name;
    var titleMap = {
      disk: '磁盘占用空间(%)',
      cpu : 'CPU使用情况(%)',
      mem : '内存使用情况(%)'
    };

    var prePanels = ["df.bytes.free", "cpu.usr", "proc.meminfo.active"];

    prePanels.forEach((metric, index) => {
      var params = {
        metric: this.contextSrv.user.orgId + "." + this.contextSrv.user.systemId + "." + metric,
        host  : host
      };

      var type = /cpu/.test(metric) ? 'cpu' : (/mem/.test(metric) ? 'mem' : 'disk');
      this.predictionPanel[type] = {};
      this.predictionPanel[type].tips = [];
      this.predictionPanel[type].title = titleMap[type];

      this.backendSrv.getPredictionPercentage(params).then(response => {
        var times = ['1天后', '1周后', '1月后', '3月后', '6月后'];
        var num   = 0;
        var data  = response.data;

        if (_.isEmpty(data)) { throw Error; }

        for (var i in data) {
          var score = type === 'disk' ? 100 - data[i] : data[i];  // reponse disk 是剩余率, show disk 需要使用率
          var pre  = {
            time: times[num],
            data: kbn.valueFormats.percent(score, 2)
          };

          this.predictionPanel[type].tips[num] = pre;
          num++;
        }

        this.predictionPanel[type]['selectedOption'] = this.predictionPanel[type].tips[0];

        _.forIn(this.predictionPanel, (item, key) => {
          // when prediction api returns {}
          if (item.errTip) {
            // $('.prediction-item-' + $.escapeSelector(host + key)).html(item.errTip);
            return;
          }

          var score = item.tips[0] && parseFloat(item.tips[0].data);
          var colors = score > 75 ? [HEALTH_TYPE.RED.COLOR] : (score > 50 ? [HEALTH_TYPE.YELLOW.COLOR] : [HEALTH_TYPE.GREEN.COLOR]);

          this.utilSrv.setPie('.prediction-item-' + host + key, [
            { label: "", data: score },
            { label: "", data: 100 - score }
          ], colors.concat(['#DCDFE6']), 0.8);

          this.predictionPanel[key].selected = kbn.valueFormats.percent(score, 2);
        });
      }).catch(() => {
        this.predictionPanel[type].errTip = '暂无预测数据';
      });
    });
  }

  // 智能分析预测 切换周期
  changePre(type, selectedOption) {
    var panel = this.predictionPanel[type];
    var selected = _.findIndex(panel.tips, { time: selectedOption.time });
    var score = parseFloat(panel.tips[selected].data);

    panel.selected = kbn.valueFormats.percent(score, 2);
    var colors = score > 75 ? [HEALTH_TYPE.RED.COLOR] : (score > 50 ? [HEALTH_TYPE.YELLOW.COLOR] : [HEALTH_TYPE.GREEN.COLOR]);

    this.utilSrv.setPie('.prediction-item-' + this.currentHost.name + type, [
      { label: "", data: score },
      { label: "", data: (100 - score) }
    ], colors.concat(['#DCDFE6']), 0.8);
  }

  getDashboard(host) {
    this.saveTopologyData();

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
    if (tabId === 6) {}
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

  saveTopologyData() {
    this.data = this.hostSrv.topology;
    this.hostlist = _.map(this.data, 'name');
  }

  clearSelected() {
    this.currentHost = {};
  }

  showGuideResult(e, params) {
  }

};

coreModule.controller('HostTopologyCtrl', HostTopologyCtrl);
