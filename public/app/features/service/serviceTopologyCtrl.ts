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

export class ServiceTopologyCtrl {
  data: any;  // don't modify this variable
  tabs: Array<any>;
  hostlist: Array<any>;
  predictionPanel: any;
  currentService: any;  // one node information of relationshipGraph
  tableParams: any;
  tableData: Array<any>;

  currentTab: number;
  serviceList: Array<any>;
  servicePanel: Array<any>;
  dashboard: any;
  topologyGraphParams: any;
  needHostnameTabs: Array<number>;  // don't modify this variable, except init

  /** @ngInject */
  constructor (
    private serviceDepSrv,
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

    this.tabs = [
      { 'id': 0, 'title': '服务总览', 'active': false, 'show': true,  'content': 'public/app/features/service/partials/service_list_table.html' },
      { 'id': 1, 'title': '服务信息', 'active': false, 'show': false, 'content': 'public/app/features/service/partials/service_info.html' }
    ];
    this.needHostnameTabs = [1];

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
    });

    _.isEmpty(this.serviceList) && this.serviceDepSrv.readInstalledService().then(response => {
      this.serviceList = response.data;
      this.$scope.services = response.data;
    });
  }

  render(curItem) {
    window.d3.selectAll('.relationshipGraph-block').classed('selected', false);

    if (curItem.name) {
      window.d3.select(`#${curItem.__id}`).classed('selected', true);

      this.needHostnameTabs.forEach(item => {
        _.extend(this.tabs[item], { show: true, disabled: false });
      });

      this.switchTab(this.currentTab);
      this.getInfo();
    } else {
      this.needHostnameTabs.forEach(item => {
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

    this.$scope.services = tableData;
  }

  getInfo() {
    this.$controller('CMDBServiceDetailCtrl', { $scope: this.$scope });
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
  }

  saveTopologyData() {
    this.data = this.serviceDepSrv.topology;
    this.hostlist = _.map(this.data, 'name');
  }

  showGuideResult(e, params) {
  }

};

coreModule.controller('ServiceTopologyCtrl', ServiceTopologyCtrl);
