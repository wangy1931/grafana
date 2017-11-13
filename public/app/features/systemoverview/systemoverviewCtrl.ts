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
  hostKpiPanel: any = {};
  serviceKpiPanel: any = {};
  hostPanels: any;
  selected0: number = -1;
  selected1: number = -1;
  switchEnabled: boolean;
  topology: any;

  tableParams: any;
  dependencies: any;

  /** @ngInject */
  constructor(
    private backendSrv,
    private alertSrv,
    private contextSrv,
    private alertMgrSrv,
    private healthSrv,
    private serviceDepSrv,
    private jsPlumbService,
    private hostSrv,
    private utilSrv,
    private $location,
    private $scope,
    private $modal,
    private $q,
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

    this.switchEnabled = store.getBool('grafana.overview.mode');

    this.toolkit = window.jsPlumbToolkit.newInstance();
    $scope.$on("$destroy", () => {
      store.set('grafana.overview.mode', this.switchEnabled);
      this.toolkit.clear();
    });
  }

  // copy from anomalyMetic.js
  // 有改动
  setPanelMetaHost(panelDef, metric, hostname) {
    var alias = metric + ".anomaly{host=" + hostname + "}";
    var panel = panelDef;
    panel.title = metric + "{host=" + hostname + "}" + "指标异常情况";
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

  // 报警情况
  getAlertStatus() {
    this.alertPanel.status = [
      { health: HEALTH_TYPE.GREEN.TEXT, text: '系统正常', count: 0 },
      { health: HEALTH_TYPE.YELLOW.TEXT, text: '警告: ', count: 0 },
      { health: HEALTH_TYPE.RED.TEXT, text: '严重: ', count: 0 }
    ];

    this.alertMgrSrv.loadTriggeredAlerts().then(response => {
      if (response.data.length) {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].status.level === "CRITICAL" ? this.alertPanel.status[2].count++ : this.alertPanel.status[1].count++;
        }
      } else {
        this.alertPanel.status[0].text = '';
        this.alertPanel.status[0].count = '系统正常';
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
      { health: HEALTH_TYPE.RED.TEXT, text: '严重: ', count: -1 },
      { health: HEALTH_TYPE.YELLOW.TEXT, text: '异常指标: ', count: 0 },
      { health: HEALTH_TYPE.GREEN.TEXT, text: '指标数量: ', count: 0 }
    ];

    this.healthSrv.load().then(data => {
      var healthScore = Math.floor(data.health);
      this.healthPanel.score = healthScore;
      this.healthPanel.level = _.getLeveal(healthScore);

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
          var q = this.serviceDepSrv.readServiceStatus(node.id, node.name)
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
                "statusText": _.statusFormatter(item.healthStatusType)
              });
            });
          });

          promiseList.push(q);
        });

        this.$q.all(promiseList).finally(() => {
          this.toolkit.load({ type: "json", data: this.dependencies }).render(this.renderFactory());
        });

      } else {
        this.alertSrv.set("抱歉", "您还没有创建服务依赖关系, 建议您先创建", "error", 2000);
      }
    });
  }

  serviceNodeClickHandler(node) {
    this.selected0 = -1;
    $(node.el).addClass("active").siblings().removeClass("active");

    var serviceId = node.node.data.id;
    var serviceName = node.node.data.name;
    var serviceStatus = node.node.data.status;
    var hosts = [];

    this.topology = this.hostSrv.topology;
    this.servicePanel.currentService = {
      id: serviceId,
      name: serviceName,
      status: serviceStatus
    };
    this.servicePanel.hosts = [];

    this.serviceDepSrv.readMetricStatus(serviceId, serviceName).then(response => {
      hosts = Object.keys(response.data.hostStatusMap);
      this.serviceKpiPanel = response.data;

      return response.data;
    }).then(resp => {
      hosts.forEach(host => {
        !_.findWhere(this.hostPanels, { host: host }) && this.hostPanels.push({ host: host });
        var tmp = _.findWhere(this.hostPanels, { host: host }) || { host: host };
        tmp.healthType = _.find(this.topology, { name: host }).value;
        this.servicePanel.hosts.push(tmp);
      });

      // refresh service-dependency-graph, service status
      // _.find(this.dependencies.nodes, { name: serviceName }).status = "red"; // resp.healthStatusType.toLowerCase();
      // this.toolkit.updateNode(node.node.data.id, { status: "red" });
    });

    // 拿 servicekpi metric 的 message, 储存在 _.metricHelpMessage 中
    var service = serviceName.split(".")[0];
    this.backendSrv.readMetricHelpMessage(service);
  }

  // 机器状态
  getHostSummary() {
    this.hostSrv.getHostInfo().then(response => {
      this.hostPanels = response;
    }, err => {
      this.hostPanels = [];
    });
  }

  hostNodeClickHandler(node) {
    this.selected1 = -1;

    this.hostPanel.currentHost = {
      id: node._private_.id,
      name: node.name,
      status: node.value
    };

    this.hostPanel.host = _.filter(this.hostPanels, { host: node.name });

    // get host kpi
    this.hostSrv.getHostKpi({ hostname: node.name }).then(response => {
      this.hostKpiPanel = response.data;
    });

    // 拿 host kpi metric 的 message, 储存在 _.metricHelpMessage 中
    ['mem', 'io', 'nw', 'cpu'].forEach(item => {
      this.backendSrv.readMetricHelpMessage(item);
    });
  }

  selectHost(index, host, type) {
    if (type === 'service') {
      this.selected0 = (this.selected0 === index) ? -1 : index;
      this.selectServiceKpi(host, 'ServiceKPI');
    }
    if (type === 'host') {
      this.selected1 = (this.selected1 === index) ? -1 : index;
      this.selectHostKpi(host, 'HostIO');
    }
  }

  selectServiceKpi(host, item) {
    !this.serviceKpiPanel.hostStatusMap[host].itemStatusMap[item] &&  (item = 'ServiceState');
    var metrics = this.serviceKpiPanel.hostStatusMap[host].itemStatusMap[item].metricStatusMap;
    var metricsTable = this.handleKpiMetrics(metrics, host);

    this.servicePanel.currentItem = item;
    this.servicePanel.currentItemStatus = this.serviceKpiPanel.hostStatusMap[host].itemStatusMap[item].healthStatusType;

    this.tableParams.settings({
      dataset: metricsTable
    });
  }

  selectHostKpi(host, item) {
    var metrics = this.hostKpiPanel.itemStatusMap[item].metricStatusMap;
    var metricsTable = this.handleKpiMetrics(metrics, host);

    this.hostPanel.currentItem = item;
    this.hostPanel.currentItemStatus = this.hostKpiPanel.healthStatusType;

    this.tableParams.settings({
      dataset: metricsTable
    });
  }

  handleKpiMetrics(metrics, host) {
    var metricsTable = [];
    _.each(metrics, (value, key) => {
      var health = parseInt(value.health);
      metricsTable.push({
        name: key,
        host: host,
        alertRuleSet: value.alertRuleSet ? '有' : '无',
        alertLevel: _.translateAlertLevel(value.alertLevel),
        anomalyHealth: health,
        snoozeState: value.snoozeState,
        triggerRed: health === 0,
        triggerYellow: health > 0 && health < 26 && !value.snoozeState,
        metricHelp: _.metricHelpMessage[key] ? _.metricHelpMessage[key].definition : key
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
              click: this.serviceNodeClickHandler.bind(this),
              // mouseover: this.serviceNodeOverHandler.bind(this),
              // mouseout : this.serviceNodeOutHandler.bind(this)
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
  }

  switchPanel(type, name) {
    if (type === 'host') {
      this.switchEnabled = false;
      this.topology = this.hostSrv.topology;
      this.hostNodeClickHandler(_.find(this.topology, { name: name }));
    }
  }

  toHostTopology(id, host) {
    this.$location.url(`/host_topology?id=${id}&name=${host}&tabId=1`);
  }

};

coreModule.controller('SystemOverviewCtrl', SystemOverviewCtrl);
