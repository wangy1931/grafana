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
    private $timeout,
    private alertSrv
  ) {
    $scope.ctrl = this;

    this.tabs = [
      { 'id': 0, 'title': '服务总览', 'active': false, 'show': true,  'content': 'public/app/features/service/partials/service_list_table.html' },
      { 'id': 1, 'title': '服务信息', 'active': false, 'show': false, 'content': 'public/app/features/service/partials/service_info.html' },
      { 'id': 2, 'title': '报警检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_alert_table.html' },
      { 'id': 3, 'title': '异常检测', 'active': false, 'show': true,  'content': 'public/app/features/host/partials/host_anomaly_table.html' },
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
      // mock
      response.data = [ {
        "id" : 10598,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "apache_linux",
        "createdAt" : "2017-12-05T22:36:48Z",
        "name" : "apache",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11219,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Network/applicationGateways",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "application.gateway",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 1,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "collector_linux",
        "createdAt" : "2017-12-03T18:21:18Z",
        "name" : "collector",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10846,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "docker_linux",
        "createdAt" : "2018-01-21T19:09:46Z",
        "name" : "docker",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10477,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "elasticsearch_linux",
        "createdAt" : "2017-12-03T19:02:25Z",
        "name" : "elasticsearch",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 8,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "filebeat_linux",
        "createdAt" : "2017-12-03T18:21:37Z",
        "name" : "filebeat",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10427,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "hadoop.datanode_linux",
        "createdAt" : "2017-12-03T18:53:38Z",
        "name" : "hadoop.datanode",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10429,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "hadoop.namenode_linux",
        "createdAt" : "2017-12-03T18:53:49Z",
        "name" : "hadoop.namenode",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 2,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "hbase.master_linux",
        "createdAt" : "2017-12-03T18:21:18Z",
        "name" : "hbase.master",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 3,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "hbase.regionserver_linux",
        "createdAt" : "2017-12-03T18:21:18Z",
        "name" : "hbase.regionserver",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10430,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "kafka_linux",
        "createdAt" : "2017-12-03T18:53:49Z",
        "name" : "kafka",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 4,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "mysql_linux",
        "createdAt" : "2017-12-03T18:21:32Z",
        "name" : "mysql",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 7,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "nginx_linux",
        "createdAt" : "2017-12-03T18:21:37Z",
        "name" : "nginx",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10428,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "opentsdb_linux",
        "createdAt" : "2017-12-03T18:53:38Z",
        "name" : "opentsdb",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 9,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "postfix_linux",
        "createdAt" : "2017-12-03T18:21:37Z",
        "name" : "postfix",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10774,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "postgresql_linux",
        "createdAt" : "2018-01-08T12:48:32Z",
        "name" : "postgresql",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10595,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "redis_linux",
        "createdAt" : "2017-12-05T22:36:48Z",
        "name" : "redis",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11222,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Cache/Redis",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "redis.cache",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11225,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.ServiceBus/namespaces",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "serviceBus",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11221,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Sql/servers",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "sql.server",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11224,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Sql/servers/databases",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "sql.server.database",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11223,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Storage/storageAccounts",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "storage.account",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 10597,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "tomcat_linux",
        "createdAt" : "2017-12-05T22:36:48Z",
        "name" : "tomcat",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11218,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Network/trafficmanagerprofiles",
        "createdAt" : "2018-01-24T14:57:36Z",
        "name" : "traffic.manager",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 11220,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "Microsoft.Web/sites",
        "createdAt" : "2018-01-24T14:57:56Z",
        "name" : "web.application",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      }, {
        "id" : 5,
        "orgId" : 2,
        "sysId" : 2,
        "key" : "zookeeper_linux",
        "createdAt" : "2017-12-03T18:21:32Z",
        "name" : "zookeeper",
        "relationshipId" : 0,
        "isStop" : false,
        "hosts" : null,
        "metrics" : null,
        "type": "type1",
        "group": "group1",
        "location": "china north"
      } ];
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
    // this.$controller('CMDBServiceDetailCtrl', { $scope: this.$scope });
  }

  getAlertStatus(item) {
    // this.$controller('AlertStatusCtrl', { $scope: this.$scope }).init();
  }

  getAnomaly(item) {
    this.$controller('AnomalyHistory', { $scope: this.$scope }).loadHistory(
      { 'num': 1, 'type': 'hours', 'value': '1小时前', 'from': 'now-1h'}, '' // item && item.name
    );
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
  }

  saveTopologyData() {
    this.data = this.serviceDepSrv.topology;
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
