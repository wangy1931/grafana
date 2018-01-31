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
  currentService: any;  // one node information of relationshipGraph

  currentTab: number;
  serviceList: Array<any>;
  servicePanel: Array<any>;
  dashboard: any;
  topologyGraphParams: any;
  needNameTabs: Array<number>;  // don't modify this variable, except init

  /** @ngInject */
  constructor (
    private serviceDepSrv,
    private backendSrv,
    private contextSrv,
    private $scope,
    private $rootScope,
    private $controller,
    private $location,
    private alertSrv,
    private $translate
  ) {
    $scope.ctrl = this;

    this.tabs = [
      { 'id': 0, 'title': $translate.i18n.page_service_tab0, 'active': false, 'show': true,  'content': 'public/app/features/service/partials/service_list_table.html' },
      { 'id': 1, 'title': $translate.i18n.page_service_tab1, 'active': false, 'show': false, 'content': 'public/app/features/service/partials/service_info.html' }
    ];
    this.needNameTabs = [1];

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
    });

    _.isEmpty(this.serviceList) && this.serviceDepSrv.readInstalledService().then(response => {
      this.serviceList = response.data;
      this.servicePanel = response.data;
    });
  }

  render(curItem) {
    window.d3.selectAll('.relationshipGraph-block').classed('selected', false);

    if (curItem.name) {
      window.d3.select(`#${curItem.__id}`).classed('selected', true);

      this.needNameTabs.forEach(item => {
        _.extend(this.tabs[item], { show: true, disabled: false });
      });

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

    this.currentService = node;
    this.$scope.$digest();
  }

  rowClickHandle($event, node) {
    this.saveTopologyData();

    var elem = _.find(this.data, data => {
      return data._private_.id === node.id;
    });
    // ignore .delete button
    if (!$($event.target).hasClass('btn')) {
      this.currentService = elem;
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

    this.servicePanel = tableData;
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
    _.isEmpty(this.data) && (this.data = this.serviceDepSrv.topology);
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
          _.remove(this.serviceList, { id: id });
          this.data = _.filter(this.data, (item) => {
            return item._private_.id !== id;
          });
          this.$scope.$broadcast('topology-update', this.data);
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
