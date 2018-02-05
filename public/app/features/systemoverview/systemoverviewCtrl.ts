import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import {coreModule, appEvents} from  'app/core/core';
import config from 'app/core/config';
import store from 'app/core/store';

declare var window: any;
const HEALTH_TYPE = {
  GREEN: { TEXT: 'green', COLOR: '#66C2A5' },
  YELLOW: { TEXT: 'yellow', COLOR: '#FDAE61' },
  RED: { TEXT: 'red', COLOR: '#D53E4F' },
  GREY: { TEXT: 'grey', COLOR: '#DBE1EA' },
  BLUE: { TEXT: 'blue', COLOR: '#6FCDFB' }
};

export class SystemOverviewCtrl {
  toolkit: any;
  renderer: any;
  _dashboard: any;
  hostsResource: any;
  topologyGraphParams: any;

  healthPanel: any = {};
  alertPanel: any = {};
  exceptionPanel: any = {};
  anomalyPanel: any = {};
  servicePanel: any = {};
  hostPanel: any = {};
  predictionPanel: any = {};
  hostKpi: any = {};
  serviceKpi: any = {};
  hostPanels: any;
  switchEnabled: boolean;
  topology: any;

  tableParams: any;
  dependencies: any;

  kpiPanel: any;

  /** @ngInject */
  constructor(
    private backendSrv, private alertSrv, private contextSrv, private alertMgrSrv, private healthSrv, private serviceDepSrv,
    private hostSrv, private utilSrv, private $location, private $scope, private $modal, private $q, private $translate,
    private NgTableParams
  ) {
    $scope.ctrl = this;

    this.topologyGraphParams = {
      blockSize: 36,
      spacing: 2,
      maxChildCount: 10,
      showTooltip: true,
      showKeys: true,
      thresholds: [HEALTH_TYPE.GREEN.TEXT, HEALTH_TYPE.YELLOW.TEXT, HEALTH_TYPE.RED.TEXT, HEALTH_TYPE.GREY.TEXT],
      colors: [HEALTH_TYPE.GREEN.COLOR, HEALTH_TYPE.YELLOW.COLOR, HEALTH_TYPE.RED.COLOR, HEALTH_TYPE.GREY.COLOR],
      onClick: {
        child: this.hostNodeClickHandler.bind(this)
      }
    };

    this.tableParams = new this.NgTableParams({
      count: 5,
      sorting: { 'anomalyHealth': 'asc' }
    }, {
      counts: []
    });

    this.switchEnabled = true; // store.getBool('grafana.overview.mode');
    this.toolkit = window.jsPlumbToolkit.newInstance();

    $scope.$on("$destroy", () => {
      this.setOverviewMode();
      this.toolkit.clear();
    });

    // default data
    // Feichi: Modify
    this.kpiPanel = {
      leftTableHeads: ['i18n_hostname', 'i18n_hostname'],
      leftTableBodys: [
        { id: '', name: '', data: $translate.i18n.i18n_normal, status: 'green' },
        { id: '', name: '', data: $translate.i18n.i18n_normal, status: 'green' },
        { id: '', name: '', data: $translate.i18n.i18n_normal, status: 'green' }
      ],
      rightPanelHead: { id: '', name: '...' },
      rightItemTypes: {
        ServiceKPI: { id: 'ServiceKPI', name: 'page_overview_kpi_service', data: '...', status: 'green', metrics: {}, show: true  },
        ServiceState: { id: 'ServiceState', name: 'page_service_process', data: '...', status: 'green', metrics: {}, show: true  },
        HostNW: { id: 'HostNW', name: 'page_host_network', data: '...', status: 'green', metrics: {}, show: false },
        HostCpu: { id: 'HostCpu', name: 'page_overview_cpu_usage', data: '...', status: 'green', metrics: {}, show: false },
        HostMem: { id: 'HostMem', name: 'page_overview_mem_usage', data: '...', status: 'green', metrics: {}, show: false },
        HostIO: { id: 'HostIO', name: 'page_overview_disk_usage', data: '...', status: 'green', metrics: {}, show: false },
      },
      rightMetrics: [],
      leftSelected: '',
      rightSelected: '',
      type: '',
    }
  }

  setOverviewMode() {
    store.set('grafana.overview.mode', this.switchEnabled);
  }

  // copy from anomalyMetic.js
  // 有改动
  setPanelMetaHost(panelDef, metric, hostname) {
    var alias = metric + ".anomaly{host=" + hostname + "}";
    var panel = panelDef;
    panel.title = metric + "{host=" + hostname + "}" + this.$translate.i18n.i18n_anomaly_metric;
    panel.targets[0].metric = metric;
    panel.targets[0].tags.host = hostname;
    panel.targets[1].metric = metric + ".anomaly";
    panel.targets[1].tags.host = hostname;
    panel.targets[2].metric = metric + ".prediction.min";
    panel.targets[2].tags.host = hostname;
    panel.targets[3].metric = metric + ".prediction.max";
    panel.targets[3].tags.host = hostname;

    panel.seriesOverrides[0].alias = alias;
    panel.seriesOverrides[1].alias = metric + ".prediction.min{host=" + hostname + "}";
    panel.seriesOverrides[1].fill  = 0;
    panel.seriesOverrides[1].linewidth  = 0;
    panel.seriesOverrides[2].alias = metric + ".prediction.max{host=" + hostname + "}";
    panel.seriesOverrides[2].fillBelowTo = metric + ".prediction.min{host=" + hostname + "}";
    panel.seriesOverrides[2].linewidth  = 0;
    panel.seriesOverrides[2].fill = 0;
    return panelDef;
  }

  init() {
    if (+this.contextSrv.user.systemId === 0 && this.contextSrv.user.orgId) {
      this.$location.url("/systems");
      this.contextSrv.sidmenu = false;
      return;
    }

    this.backendSrv.get('/api/static/template/overview').then(response => {
      this._dashboard = response;
      this.getAlertStatus();
      this.getAnomaly();
      this.getSystemAnomaly();
      this.getHostSummary();
      this.getServices();
    }).then(() => {
      this.$scope.initDashboard({
        meta     : { canStar: false, canShare: false, canEdit: false, canSave: false },
        dashboard: this._dashboard
      }, this.$scope);
    });
  }

  // 机器资源信息
  getHostSummary() {
    this.hostSrv.getHostInfo().then(response => {
      this.hostPanels = response;
    }, err => {
      this.hostPanels = [];
    });
  }

  // 报警情况
  getAlertStatus() {
    this.alertPanel.status = [
      { health: HEALTH_TYPE.GREEN.TEXT, text: 'i18n_normal', count: 0 },
      { health: HEALTH_TYPE.YELLOW.TEXT, text: 'i18n_warning', count: 0 },
    ];

    this.alertMgrSrv.loadTriggeredAlerts().then(response => {
      if (response.data.length) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].status.level === "CRITICAL" ? this.alertPanel.status[1].count++ : this.alertPanel.status[2].count++;
        }
      } else {
        this.alertPanel.status[0].text = '';
        this.alertPanel.status[0].count = this.$translate.i18n.i18n_normal;
      }
    });
  }

  // 系统异常情况 anomaly
  getSystemAnomaly() {
    this.exceptionPanel.status = [
      { health: HEALTH_TYPE.GREEN.TEXT, text: 'CPU: ', count: 0, threadhold: '80%', message: '' },
      { health: HEALTH_TYPE.GREEN.TEXT, text: 'Memory: ', count: 0, threadhold: '80%', message: '' }
    ];

    this.backendSrv.alertD({
      method: "get",
      url: "/summary/topn?" + "threshold=80"
    }).then(response => {
      ['cpu', 'mem'].forEach((key, i) => {
        if (response.data[key].count) {
          this.exceptionPanel.status[i].health = HEALTH_TYPE.RED.TEXT;
          this.exceptionPanel.status[i].count = response.data[key].count;
          this.exceptionPanel.status[i].message = response.data[key].topList;
        }
      });
    });
  }

  // 智能检测异常指标 & 健康指数
  getAnomaly() {
    this.anomalyPanel.status = [
      { health: HEALTH_TYPE.RED.TEXT, text: 'i18n_critical', count: -1 },
      { health: HEALTH_TYPE.YELLOW.TEXT, text: 'page_overview_panel_anomaly_metric', count: 0 },
      { health: HEALTH_TYPE.GREEN.TEXT, text: 'page_overview_panel_metric_number', count: 0 }
    ];

    this.healthSrv.load().then(data => {
      var healthScore = Math.floor(data.health);
      this.healthPanel.score = healthScore;
      this.healthPanel.level = this.$translate.i18n[_.getLeveal(healthScore)];

      var colors = healthScore > 75 ? [HEALTH_TYPE.GREEN.COLOR] : (healthScore > 50 ? [HEALTH_TYPE.YELLOW.COLOR] : [HEALTH_TYPE.RED.COLOR]);
      this.utilSrv.setPie('.health-pie', [
        { label: "", data: healthScore },
        { label: "", data: 100 - healthScore }
      ], colors.concat(['#F3F7FA']));

      if (data.numAnomalyMetrics) {
        this.anomalyPanel.status[1].count = data.numAnomalyMetrics;
      } else {
        this.anomalyPanel.status[1].health = HEALTH_TYPE.GREEN.TEXT;
        this.anomalyPanel.status[1].count = 0;
      }
      this.anomalyPanel.status[2].count = data.numMetrics;
    });
  }

  // 服务状态
  getServices() {
    this.hostsResource = {};
    var promiseList = [];

    this.serviceDepSrv.readServiceDependency().then(response => {
      if (!_.isEmpty(response.data)) {
        this.dependencies = angular.fromJson(_.last(response.data).attributes[0].value);

        _.each(this.dependencies.nodes, node => {
          var q = this.getServiceStatus(node.id, node.name)
          .then(resp => {
            node.status = resp.data.healthStatusType.toLowerCase();

            return resp;
          })
          .then(resp => {
            this.hostsResource[node.name] = {};

            _.forIn(resp.data.hostStatusMap, (item, key) => {
              !this.hostsResource[node.name][key] && (this.hostsResource[node.name][key] = {
                "host"  : item.hostName,
                "status": item.healthStatusType,
                "statusText": this.$translate.i18n[_.statusFormatter(item.healthStatusType)]
              });
            });
          });

          promiseList.push(q);
        });

        this.$q.all(promiseList).finally(() => {
          this.toolkit.load({ type: "json", data: _.cloneDeep(this.dependencies) }).render(this.renderFactory());
        });

      } else {
        this.alertSrv.set(this.$translate.i18n.i18n_sorry, this.$translate.i18n.page_overview_err_dependency, "error", 2000);
      }
    });
  }

  getServiceStatus(serviceId, serviceName) {
    return this.serviceDepSrv.readServiceStatus(serviceId, serviceName);
  }

  serviceNodeClickHandler(node) {
    var serviceId = node.node.data.id;
    var serviceName = node.node.data.name;
    var serviceStatus = node.node.data.status;
    var hosts = [];

    this.topology = this.hostSrv.topology;
    this.servicePanel.currentService = {
      id: serviceId,
      name: serviceName,
      status: serviceStatus,
      icon: node.node.data.icon || ""
    };

    this.kpiPanel.type = 'service';
    this.kpiPanel.leftTableHeads = ['i18n_hostname', 'i18n_status'];
    this.kpiPanel.leftTableBodys = [];

    this.getServiceKpi(serviceId, serviceName).then(resp => {
      hosts = Object.keys(resp.hostStatusMap);

      _.each(resp.hostStatusMap, (hostMap, hostKey) => {
        this.kpiPanel.leftTableBodys.push({
          id: (_.find(this.hostPanels, { host: hostKey }) || {}).id,
          name: hostKey,
          data: this.$translate.i18n[_.statusFormatter(hostMap.healthStatusType)],
          status: hostMap.healthStatusType
        });
      });

      this.leftClickHandler({ name: hosts[0] }, 'service');
      return resp;
    }).then(resp => {
      // refresh service-dependency-graph, service status
      _.find(this.dependencies.nodes, { name: serviceName }).status = resp.healthStatusType.toLowerCase();
      this.toolkit.clear();
      this.toolkit.load({ type: "json", data: _.cloneDeep(this.dependencies) });

      $(node.el).addClass("active").siblings().removeClass("active");
    });
  }

  hostNodeClickHandler(node) {
    var promiseList = [];

    this.hostPanel.currentHost = {
      id: node._private_.id,
      name: node.name,
      status: node.value
    };

    this.kpiPanel.type = 'host';
    this.kpiPanel.leftTableHeads = ['i18n_servicename', 'i18n_status'];
    this.kpiPanel.leftTableBodys = [];

    this.getServicesOnHost(node._private_.id).then((response) => {
      // 机器上可能没有服务
      if (_.isEmpty(response.data.services)) {
        this.leftClickHandler('', 'host');
      }

      _.each(response.data.services, service => {
        var q = this.getServiceStatus(service.id, service.name)
        .then(resp => {
          service.healthStatusType = resp.data.healthStatusType;
          return resp.data;
        });
        promiseList.push(q);
      });

      this.$q.all(promiseList).finally(resp => {
        _.each(response.data.services, service => {
          this.kpiPanel.leftTableBodys.push({
            id: service.id,
            name: service.name,
            data: this.$translate.i18n[_.statusFormatter(service.healthStatusType)],
            status: service.healthStatusType,
            icon: (_.find(this.dependencies.nodes, { id: "" + service.id, name: service.name }) || {}).icon
          });
        });
        this.leftClickHandler(response.data.services[0], 'host');
      });
    });
    this.getHostKpi(node.name);
  }

  leftClickHandler(item, type) {
    var promise;
    this.kpiPanel.leftSelected = item.name;

    if (type === 'service') {
      promise = this.getHostKpi(item.name);
      this.hostPanel.currentHost = {
        id: item.id || this.kpiPanel.rightPanelHead.id,
        name: item.name,
        status: item.status
      };
    }
    if (type === 'host') {
      if (_.isEmpty(item)) {
        promise = this.$q.when([]).then(() => {
          this.serviceKpi = {};
        });
      } else {
        promise = this.getServiceKpi(item.id, item.name);
      }
      this.servicePanel.currentService = {
        id: item.id,
        name: item.name,
        status: item.status,
        icon: item.icon
      };
    }
    promise.then(() => {
      this.setServiceKpiPanel(this.kpiPanel.rightPanelHead.name);
      this.kpiPanel.rightMetrics = [];
      this.selectKpi('ServiceKPI');
    });
  }

  getServicesOnHost(hostId) {
    return this.backendSrv.alertD({
      url: `/cmdb/host?id=${hostId}`
    });
  }

  getServiceKpi(serviceId, serviceName) {
    // 拿 servicekpi metric 的 message, 储存在 _.metricHelpMessage 中
    var service = serviceName.split(".")[0];
    this.backendSrv.readMetricHelpMessage(service);

    return this.serviceDepSrv.readMetricStatus(serviceId, serviceName).then(response => {
      this.serviceKpi = response.data;

      return response.data;
    });
  }

  setServiceKpiPanel(hostname) {
    // serviceKpi 为空 或者 ServiceKPI 为空
    ['ServiceKPI', 'ServiceState'].forEach(itemKey => {
      var itemMap = this.serviceKpi.hostStatusMap && this.serviceKpi.hostStatusMap[hostname].itemStatusMap[itemKey];
      _.extend(this.kpiPanel.rightItemTypes[itemKey], {
        id: itemKey,
        data: itemMap ? this.$translate.i18n[_.statusFormatter(itemMap.healthStatusType)] : this.$translate.i18n.i18n_empty_tmp,
        status: itemMap ? itemMap.healthStatusType : 'GREY',
        metrics: itemMap ? itemMap.metricStatusMap : null
      });
    });

    // hard code: set servicekpi grey, when service state is grey
    if (this.kpiPanel.rightItemTypes['ServiceState'].status === 'GREY') {
      _.extend(this.kpiPanel.rightItemTypes['ServiceKPI'], {
        data: this.$translate.i18n[_.statusFormatter('GREY')],
        status: 'GREY',
        metrics: null
      });
    }
  }

  getHostKpi(hostname) {
    // 拿 host kpi metric 的 message, 储存在 _.metricHelpMessage 中
    ['mem', 'io', 'nw', 'cpu'].forEach(item => {
      this.backendSrv.readMetricHelpMessage(item);
    });

    this.kpiPanel.rightPanelHead = {
      id: (_.findWhere(this.hostPanels, { host: hostname }) || {}).id,
      name: hostname
    };

    return this.$q.when([]);
    // this.hostSrv.getHostKpi({ hostname: hostname }).then(response => {
    //   this.hostKpi = response.data;

    //   _.each(response.data.itemStatusMap, (itemMap, itemKey) => {
    //     var tmp = itemKey.replace('Host', '').replace('Service', '').toLowerCase();
    //     tmp = (tmp === 'io') ? 'disk' : tmp;
    //     _.extend(this.kpiPanel.rightItemTypes[itemKey], {
    //       id: itemKey,
    //       // name: itemKey,
    //       data: (_.findWhere(this.hostPanels, { host: hostname }) || {})[tmp] || _.statusFormatter(itemMap.healthStatusType),
    //       status: itemMap.healthStatusType,
    //       metrics: itemMap.metricStatusMap
    //     });
    //   });

    //   return response.data;
    // });
  }

  selectKpi(kpiItem) {
    this.kpiPanel.rightSelected = kpiItem;

    var metricsMap = this.kpiPanel.rightItemTypes[kpiItem].metrics;
    this.kpiPanel.rightMetrics = this.handleKpiMetrics(metricsMap, this.kpiPanel.rightPanelHead.name);
    this.tableParams.settings({
      dataset: this.kpiPanel.rightMetrics
    });
  }

  handleKpiMetrics(metrics, host) {
    var metricsTable = [];
    _.each(metrics, (value, key) => {
      var health = parseInt(value.health);
      var alertStatus = 'GREEN';
      if (value.alertRuleSet) {
        switch (value.alertLevel) {
          case 'NORMAL': alertStatus = 'GREEN'; break;
          case 'WARNING': alertStatus = 'YELLOW'; break;
          case 'CRITICAL': alertStatus = 'RED'; break;
        }
      } else {
        alertStatus = 'GREY';
      }
      metricsTable.push({
        name: key,
        host: host,
        alertRuleSet: value.alertRuleSet ? this.$translate.i18n.i18n_exist : this.$translate.i18n.i18n_empty,
        alertLevel: this.$translate.i18n[_.translateAlertLevel(value.alertLevel)],
        anomalyHealth: health,
        snoozeState: value.snoozeState,
        triggerRed: health === 0,
        triggerYellow: health > 0 && health < 26 && !value.snoozeState,
        metricHelp: _.metricHelpMessage[key] ? _.metricHelpMessage[key].definition : key,
        alertStatus: alertStatus
      });
    });
    return metricsTable;
  }

  // 弹窗 查看历史情况
  showModal(index, metric, host) {
    this.$scope.row = this._dashboard.rows[index];
    this.$scope.panel = this._dashboard.rows[index].panels[0];

    if (index === 7) {
      this.setPanelMetaHost(this.$scope.panel, metric, host);
      this.healthSrv.transformPanelMetricType(this.$scope.panel);
    }

    var healthModal = this.$modal({
      scope: this.$scope,
      templateUrl: 'public/app/features/systemoverview/partials/system_overview_modal.html',
      show: false
    });

    healthModal.$promise.then(healthModal.show);
  }

  renderFactory() {
    var canvasElement = document.querySelector(`.jtk-canvas`);

    return {
      container: canvasElement,
      view: {
        nodes: {
          "default": {
            template: "tmplNode",
            events: {
              click: this.serviceNodeClickHandler.bind(this)
            }
          }
        }
      },
      layout: {
        type: "Absolute"
      },
      lassoFilter: ".controls, .controls *, .miniview, .miniview *",
      dragOptions: {
        filter: ".delete *, .add *"
      },
      events: {
        canvasClick: (e) => {
          this.toolkit.clearSelection();
        }
      },
      jsPlumb: {
        Anchor: "Continuous",
        Connector: [ "StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" } ],
        Endpoint: "Blank",
        PaintStyle: { strokeWidth: 1, stroke: HEALTH_TYPE.BLUE.COLOR },
        Overlays: [
          ["Arrow", { fill: HEALTH_TYPE.BLUE.COLOR, width: 10, length: 10, location: 1 }]
        ]
      },
      consumeRightClick: false,
      enablePanButtons: false,
      enableWheelZoom: false
    };
  }

  switch() {
    this.servicePanel.currentService = {};
    this.hostPanel.currentHost = {};
    this.switchEnabled = !this.switchEnabled;
  }

};

coreModule.controller('SystemOverviewCtrl', SystemOverviewCtrl);
