import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import { coreModule } from 'app/core/core';
import kbn from 'app/core/utils/kbn';

declare var window: any;
const HEALTH_TYPE = {
  GREEN: { TEXT: 'green', COLOR: '#66C2A5' },
  YELLOW: { TEXT: 'yellow', COLOR: '#FDAE61' },
  RED: { TEXT: 'red', COLOR: '#D53E4F' },
  GREY: { TEXT: 'grey', COLOR: '#DBE1EA' }
};

const Map = {
  'Microsoft.Web/sites': 'web',
  'Microsoft.Web/serverFarms': 'web',
  'Microsoft.Sql/servers': 'sqlserver',
  'Microsoft.Sql/servers/databases': 'sqlserver_database',
  'Microsoft.Cache/Redis': 'redis',
  'Microsoft.Storage/storageAccounts': 'storage'
};

export class ServiceTopologyCtrl {
  data: any;  // don't modify this variable
  tabs: Array<any>;
  hostlist: Array<any>;
  currentService: any;  // one node information of relationshipGraph

  currentTab: number;
  serviceList: Array<any>;
  servicePanel: Array<any>;
  dashboard: any;
  topologyGraphParams: any;
  needNameTabs: Array<number>;  // don't modify this variable, except init

  // Feichi
  detail: any;

  /** @ngInject */
  constructor (
    private resourceSrv,
    private backendSrv,
    private contextSrv,
    private $scope,
    private $rootScope,
    private $controller,
    private $location,
    private $timeout,
    private alertSrv
  ) {
    $scope.ctrl = this;

    this.tabs = [
      { 'id': 0, 'title': '服务总览', 'active': false, 'show': true,  'content': 'public/app/features/service/partials/service_list_table.html' },
      { 'id': 1, 'title': '服务信息', 'active': false, 'show': false, 'content': 'public/app/features/service/partials/service_info.html' },
      { 'id': 2, 'title': '报警检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_alert_table.html' },
      { 'id': 3, 'title': '异常检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_anomaly_table.html' },
      { 'id': 4, 'title': '系统状态', 'active': false, 'show': false,  'content': 'public/app/features/host/partials/host_system_status.html' },
    ];
    this.needNameTabs = [1, 4];

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

    this.currentService = {};

    this.$rootScope.onAppEvent('exception-located', this.showGuideResult.bind(this), $scope);

    $scope.$watch('ctrl.currentService', (newValue, oldValue) => {
      if (!newValue) { return; }
      if ((newValue === oldValue) && _.isEmpty(newValue)) { return; }

      if (_.isString(newValue)) {
        this.render(newValue);
      } else {
        var curItem = newValue.name ? newValue : {};
        this.render(curItem);
      }
    });
  }

  init() {
    var search = this.$location.search();
    this.tabs[+search.tabId || 0].active = true;
    this.currentTab = +search.tabId || 0;

    this.$scope.$on('topology-loaded', (evt, payload) => {
      this.data = payload;
      if (search.id) {
        this.currentService = _.find(this.data, { name: search.name });
      } else {
        this.switchTab(this.currentTab);
      }

      (this.serviceList = []) && this.data.forEach(item => {
        this.serviceList.push(item._private_);
        this.servicePanel = this.serviceList;
      });
    });

    _.isEmpty(this.serviceList) && this.resourceSrv.getList().then(response => {
      this.serviceList = response;
      this.servicePanel = response;
    });
  }

  render(curItem) {
    window.d3.selectAll('.relationshipGraph-block').classed('selected', false);

    if (curItem.name) {
      window.d3.select(`#${curItem.__id}`).classed('selected', true);

      var type = curItem.type || curItem._private_.azureType;
      if (Map[type]) {
        this.needNameTabs.forEach(item => {
          _.extend(this.tabs[item], { show: true, disabled: false });
        });
      } else {
        _.extend(this.tabs[1], { show: true, disabled: false });
        _.extend(this.tabs[4], { show: false, disabled: true });

        if (+this.currentTab === 4) { this.currentTab = 0; }
        this.tabs[0].active = true;
      }

      this.switchTab(this.currentTab);
      this.getInfo();
    } else {
      this.needNameTabs.forEach(item => {
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
      this.currentService = elem;
    } else {
      this.currentService = node;
      this.$scope.$digest();
    }
  }

  rowClickHandle(node) {
    this.saveTopologyData();

    // event is triggered by table-row click, set node.id in node._private_
    var elem = _.find(this.data, data => {
      return data._private_.id === node.id;
    });
    this.currentService = elem;

    this.$timeout(() => {
      this.tabs[1].active = true;
      this.switchTab(1);
    }, 100);
  }

  groupClickHandle(group) {
    this.currentService = group;
    this.$scope.$digest();
  }

  getList(item) {
    var tableData, items;
    this.saveTopologyData();

    if (_.isString(item)) {
      items = _.map(_.filter(this.data, { 'parent': item }), 'name');
      tableData = _.filter(this.serviceList, item => {
        return !!~items.indexOf(item.host);
      });
    } else {
      tableData = item.name ? _.filter(this.serviceList, { id: item._private_.id }) : this.serviceList;
    }

    this.servicePanel = tableData;
  }

  getInfo() {
    var searchParams = this.$location.search();
    this.resourceSrv.getDetail(searchParams).then(result => {
      this.detail = result;
    });
  }

  getAlertStatus(item) {
    // this.$controller('AlertStatusCtrl', { $scope: this.$scope }).init();
  }

  getAnomaly(item) {
    this.$controller('AnomalyHistory', { $scope: this.$scope }).loadHistory(
      { 'num': 1, 'type': 'hours', 'value': '1小时前', 'from': 'now-1h'}, '' // item && item.name
    );
  }

  getDashboard(item) {
    var type = item.type || item._private_.azureType;
    var dashboardName = Map[type];
    if (type && dashboardName) {
      // 检测的到 dashboard name
      this.backendSrv.get(`/api/static/${dashboardName}`).then(dashboard => {
        // store & init dashboard
        if (!this.dashboard) {
          this.dashboard = dashboard;
          this.$scope.initDashboard({
            dashboard: dashboard,
            meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
          }, this.$scope);
        } else {
          this.$scope.setupDashboard({
            dashboard: dashboard,
            meta: { canStar: false, canShare: false, canEdit: false, canSave: false },
          });
        }
      });
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;
    this.$location.search({
      'tabId': tabId,
      'panelId': null,
      'fullscreen': null,
      'edit': null,
      'editview': null,
      'id': this.currentService.name ? this.currentService._private_.id : '',
      'name': this.currentService.name ? this.currentService.name : ''
    });

    if (tabId === 0) {
      this.getList(this.currentService);
    }
    if (tabId === 1) {
      this.getInfo();
    }
    if (tabId === 2) {
      this.getAlertStatus(this.currentService);
    }
    if (tabId === 3) {
      this.getAnomaly(this.currentService);
    }
    if (tabId === 4) {
      this.getDashboard(this.currentService);
    }
  }

  saveTopologyData() {
    this.data = this.resourceSrv.topology;
    this.hostlist = _.map(this.data, 'name');
  }

  deleteService($event, id) {
    $event.preventDefault();

    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确认要删除该服务吗？',
      icon: 'fa-trash',
      yesText: '删除',
      noText: '取消',
      onConfirm: () => {
        this.backendSrv.alertD({
          method: 'DELETE',
          url   : '/cmdb/agent/service',
          params: { 'id': id }
        }).then(() => {
          this.alertSrv.set("删除成功", '', "success", 2000);
          _.remove(this.servicePanel, { id: id });
        }, (err) => {
          this.alertSrv.set("删除失败", err.data, "error", 2000);
        });
      }
    });
  }

  showGuideResult(e, params) {
  }

};

coreModule.controller('ServiceTopologyCtrl', ServiceTopologyCtrl);
