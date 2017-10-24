define([
  'angular',
  'lodash',
  'app/core/config'
],
  function (angular, _, config) {
    'use strict';

    var module = angular.module('grafana.controllers');

    module.filter('formatItemType', function () {
      return function (text) {
        return text.replace('Host', '').replace('Service', '');
      };
    });

    module.filter('translateItemType', function () {
      return function (text) {
        var map = {
          "mem": "内存",
          "io" : "磁盘",
          "nw" : "网络",
          "cpu": "CPU",
          "kpi": "服务 KPI",
          "state": "服务状态"
        };
        return map[text.toLowerCase()];
      };
    });

    module.controller('SystemOverviewCtrl', function ($scope, $location, $q, $modal, backendSrv, alertSrv,
      contextSrv, datasourceSrv, alertMgrSrv, healthSrv, serviceDepSrv, jsPlumbService) {

      var toolkit = jsPlumbService.getToolkit("serviceToolkit");

      $scope.healthPanel = {};
      $scope.alertPanel  = {};
      $scope.exceptionPanel = {};
      $scope.anomalyPanel   = {};
      $scope.servicePanel   = {};
      $scope.hostPanel      = {};
      $scope.predictionPanel = {};
      $scope.panels = {};
      $scope.panel  = {};

      $scope.$on('$destroy', function () {
        toolkit.clear();
      });

      $scope.getUrl = function(url) {
        return config.appSubUrl + url;
      };

      $scope.filterEmpty = function (value) {
        if (!value) { return false };
        return value.status ? true : false;
      };

      $scope.percentFormatter = function (value) {
        return value && (value.toFixed(2) + '%');
      };

      $scope.gbFormatter = function (value) {
        return value && ((value / Math.pow(1024, 3)).toFixed(2) + 'GB');
      };

      $scope.statusFormatter = function (value) {
        if (_.isNumber(value)) {
          return value === 0 ? '正常' : '异常';
        }
        if (_.isString(value)) {
          return value === 'GREEN' ? '正常' : (value === 'YELLOW' ? '警告' : (value === 'RED' ? '严重' : '异常'));
        }
      };

      var setPie = function (element, pieData, colors, innerRadius) {
        $.plot(element, pieData, {
          series: {
            pie: {
              innerRadius: innerRadius || 0.7,
              show: true,
            }
          },
          colors: colors
        });
      };

      // copy from anomalyMetic.js
      // 有改动
      function setPanelMetaHost(panelDef, metric, hostname) {
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
        panel.seriesOverrides[1].linewidth = 0;
        panel.seriesOverrides[2].alias = metric + ".prediction.max{host=" + hostname + "}";
        panel.seriesOverrides[2].fillBelowTo = metric + ".prediction.min{host=" + hostname + "}";
        panel.seriesOverrides[2].linewidth = 0;
        panel.seriesOverrides[2].fill = 0;
        return panelDef;
      }

      $scope.init = function () {
        if (contextSrv.user.systemId == 0 && contextSrv.user.orgId) {
          $location.url("/systems");
          contextSrv.sidmenu = false;
          return;
        }

        backendSrv.get('/api/static/template/overview').then(function (response) {
          $scope._dashboard = response;
          $scope.getAlertStatus();
          $scope.getAnomaly();
          $scope.getSystemAnomaly();
          $scope.getHostSummary();
        }).then(function () {
          $scope.initDashboard({
            meta     : { canStar: false, canShare: false, canEdit: false, canSave: false },
            dashboard: $scope._dashboard
          }, $scope);
        });
      };

      // 报警情况
      $scope.getAlertStatus = function () {
        $scope.alertPanel.status = [
          { type: 'success', text: '系统正常', count: 0 },
          { type: 'warning', text: '警告: ', count: 0 },
          { type: 'danger', text: '严重: ', count: 0 }
        ];
        $scope.alertPanel.href = $scope.getUrl('/alerts/status');

        alertMgrSrv.loadTriggeredAlerts().then(function onSuccess(response) {
          if (response.data.length) {
            for (var i = 0; i < response.data.length; i++) {
              response.data[i].status.level === "CRITICAL" ? $scope.alertPanel.status[2].count++ : $scope.alertPanel.status[1].count++;
            }
          } else {
            $scope.alertPanel.status[0].text = '';
            $scope.alertPanel.status[0].count = '系统正常';
          }
        });
      };

      // 系统异常情况 anomaly
      $scope.getSystemAnomaly = function () {
        $scope.exceptionPanel.status = [
          { type: 'success', text: 'CPU: ', count: 0, threadhold: '80%', message: '' },
          { type: 'success', text: 'Memory: ', count: 0, threadhold: '80%', message: '' }
        ];

        backendSrv.alertD({
          method: "get",
          url: "/summary/topn?" + "threshold=80"
        }).then(function (response) {
          response = response.data;
          _.each(['cpu', 'mem'], function (key, i) {
            if (response[key].count) {
              $scope.exceptionPanel.status[i].type = 'danger';
              $scope.exceptionPanel.status[i].count = response[key].count;
              $scope.exceptionPanel.status[i].message = response[key].topList;
            }
          });
        });
      };

      // 智能检测异常指标 & 健康指数
      $scope.getAnomaly = function () {
        $scope.anomalyPanel.status = [
          { type: 'danger', text: '严重: ', count: -1 },
          { type: 'warning', text: '异常指标: ', count: 0 },
          { type: 'success', text: '指标数量: ', count: 0 }
        ];
        $scope.anomalyPanel.href = $scope.getUrl('/anomaly');

        healthSrv.load().then(function (data) {
          var healthScore = Math.floor(data.health);
          $scope.healthPanel.score = healthScore;
          $scope.healthPanel.level  = _.getLeveal(healthScore);

          var colors = healthScore > 75 ? ['#3DB779'] : (healthScore > 50 ? ['#FE9805'] : ['#BB1144'])
          setPie('.health-pie', [
            { label: "", data: healthScore },
            { label: "", data: 100 - healthScore }
          ], colors.concat(['#F3F7FA']));

          if (data.numAnomalyMetrics) {
            $scope.anomalyPanel.status[1].count = data.numAnomalyMetrics;
          } else {
            $scope.anomalyPanel.status[1].type  = 'success';
            $scope.anomalyPanel.status[1].count = 0;
          }
          $scope.anomalyPanel.status[2].count = data.numMetrics;
        });
      };

      // 服务状态
      $scope.getServices = function (scope) {
        $scope.hostsResource = {};

        toolkit = scope.toolkit;
        $scope.servicePanel.href = $scope.getUrl('/service_v2');

        serviceDepSrv.readServiceDependency().then(function (response) {
          if (!_.isNull(response.data)) {
            var dependencies = angular.fromJson(_.last(response.data).attributes[0].value);

            _.each(dependencies.nodes, function (node) {
              serviceDepSrv.readServiceStatus(node.id, node.name)
              .then(function (resp) {
                node.status = resp.data.healthStatusType;

                return resp;
              })
              .then(function (resp) {
                $scope.hostsResource[node.name] = {};

                _.forIn(resp.data.hostStatusMap, function (item, key) {
                  !$scope.hostsResource[node.name][key] && ($scope.hostsResource[node.name][key] = {
                    "host"  : item.hostName,
                    "status": item.healthStatusType,
                    "statusText": $scope.statusFormatter(item.healthStatusType)
                  });
                });
              });
            });

            toolkit.load({ data: dependencies });
          } else {
            alertSrv.set("抱歉", "您还没有创建服务依赖关系, 建议您先创建", "error", 2000);
          }
        });
      };

      $scope.nodeClickHandler = function (node) {
        $scope.selected = -1;
        $(node.el).addClass("active").siblings().removeClass("active");

        var serviceId = node.node.data.id;
        var serviceName = node.node.data.name;
        var serviceStatus = node.node.data.status;
        var hosts = [];

        $scope.hostPanel = {};

        $scope.hostPanel.currentService = {
          id: serviceId,
          name: serviceName,
          status: serviceStatus
        };

        serviceDepSrv.readHostStatus(serviceId, serviceName).then(function (response) {
          hosts = Object.keys(response.data.hostStatusMap);
        }).then(function () {
          $scope.hostPanel.hosts = [];

          _.each(hosts, function (host) {
            !_.findWhere($scope.hostPanels, { host: host }) && $scope.hostPanels.push({ host: host });
            var tmp = _.findWhere($scope.hostPanels, { host: host }) || { host: host };
            $scope.hostPanel.hosts.push(tmp);
          });
        }).then(function () {
          _.each(hosts, function (host) {
            $scope.showPrediction(0, host);
          });

          $scope.$broadcast("toggle-panel", { target: 'host' });
        });

        $scope.service = {};
        $scope.metrics = {};

        serviceDepSrv.readMetricStatus(serviceId, serviceName).then(function (response) {
          $scope.service = response.data;
        });

        // 拿 servicekpi metric 的 message, 储存在 _.metricHelpMessage 中
        var service = serviceName.split(".")[0];
        _.each([service, 'mem', 'io', 'nw', 'cpu'], function (item) {
          backendSrv.readMetricHelpMessage(item);
        });
      };

      $scope.selectHost = function (index, host) {
        $scope.selected = ($scope.selected == index) ? -1 : index;
        $('[href="#tab-' + host + '-1"]').tab('show');
        $scope.showHost(host);
      };

      $scope.showKPI = function (host) {
        _.extend(_.find($scope.hostPanels, { host: host }), $scope.service.hostStatusMap[host]);
        $scope.selectHealthItemType(host, 'ServiceKPI');
      };

      $scope.showHost = function (host) {
        $scope.bsTableData = $scope.panels[host].topNPanel;
        $scope.$broadcast('load-table');

        $scope.predictionPanel = $scope.panels[host].predictionPanel;
        _.forIn($scope.predictionPanel, function (item, key) {
          // when prediction api returns {}
          if (item.errTip) {
            $('.prediction-item-' + $.escapeSelector(host + key)).html(item.errTip);
            return;
          }

          var score = parseFloat(item.tips[0].data);
          var colors = score > 75 ? ['#BB1144'] : (score > 50 ? ['#FE9805'] : ['#3DB779']);

          setPie('.prediction-item-' + host + key, [
            { label: "", data: score },
            { label: "", data: 100 - score }
          ], colors.concat(['#DCDFE6']), 0.8);

          $scope.predictionPanel[key].selected = $scope.percentFormatter(score);
        });
      };

      $scope.selectHealthItemType = function (host, item) {
        !$scope.service.hostStatusMap[host].itemStatusMap[item] &&  (item = 'ServiceState');
        var metrics = $scope.service.hostStatusMap[host].itemStatusMap[item].metricStatusMap;
        var metric = [];
        var alertLevel = "";

        for (var name in metrics) {
          switch (metrics[name].alertLevel) {
            case "CRITICAL":
              alertLevel = "严重";
              break;
            case "WARNING":
              alertLevel = "警告";
              break;
            default:
              alertLevel = "正常";
              break;
          }
          metric.push({
            name: name,
            alertRuleSet: metrics[name].alertRuleSet ? "有" : "无",
            alertLevel: alertLevel,
            anomalyHealth: metrics[name].health
          });
        }

        $scope.currentHost = host;
        $scope.currentItem = item;
        $scope.currentItemStatus = $scope.service.hostStatusMap[host].itemStatusMap[item].healthStatusType;
        $scope.bsTableData = metric;

        $scope.$broadcast('load-table');
      };

      // 机器连接状态
      $scope.getHostSummary = function () {
        $scope.hostPanel.href = $scope.getUrl('/summary');
        var hostsResource = [];

        var query = {
          "queries": [
            {
              "metric": "cpu.usr"
            },
            {
              "metric": "collector.state"
            },
            {
              "metric": "proc.meminfo.active"
            },
            {
              "metric": "df.bytes.free",
              "tags": [
                {
                  "name": "mount",
                  "value": "/"
                }
              ]
            }
          ],
          "hostProperties": ["version", "startTime", "commit", "id"]
        };

        backendSrv.getHosts(query).then(function (response) {
          _.each(response.data, function (item) {
            hostsResource.push({
              host: item.hostname,
              id: item.id,
              startTime: item.startTime,
              commit: item.commit,
              version: item.version,
              cpu: $scope.percentFormatter(item["cpu.usr"]),
              mem: $scope.gbFormatter(item["proc.meminfo.active"]),
              disk: $scope.gbFormatter(item["df.bytes.free"]),
              status: $scope.statusFormatter(item["collector.state"])
            });
          });
        });

        $scope.hostPanels = hostsResource;
      };

      // 智能分析预测 切换周期
      $scope.changePre = function (host, type, selectedOption) {
        var panel = $scope.panels[host]['predictionPanel'][type];
        var selected = _.findIndex(panel.tips, { time: selectedOption.time });
        var score = parseFloat(panel.tips[selected].data);

        panel.selected = $scope.percentFormatter(score);

        var colors = score > 75 ? ['#BB1144'] : (score > 50 ? ['#FE9805'] : ['#3DB779']);
        setPie('.prediction-item-' + host + type, [
          { label: "", data: score },
          { label: "", data: (100 - score) }
        ], colors.concat(['#DCDFE6']), 0.8);
      };

      $scope.showPrediction = function (i, hostname) {
        var predictionPanel = {};
        $scope.panels[hostname] = {};

        var titleMap = {
          disk: '磁盘占用空间(%)',
          cpu : 'CPU使用情况(%)',
          mem : '内存使用情况(%)'
        };

        // 智能分析预测
        var prePanels = $scope._dashboard.rows[5].panels;
        _.each(prePanels, function (panel, index) {
          var params = {
            metric: contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + panel.targets[0].metric,
            host  : hostname
          };

          var type = /cpu/.test(panel.targets[0].metric) ? 'cpu' : (/mem/.test(panel.targets[0].metric) ? 'mem' : 'disk');
          predictionPanel[type] = {};
          predictionPanel[type].tips = [];
          predictionPanel[type].title = titleMap[type];

          backendSrv.getPredictionPercentage(params).then(function (response) {
            var times = ['1天后', '1周后', '1月后', '3月后', '6月后'];
            var num   = 0;
            var data  = response.data;

            if (_.isEmpty(data)) { throw Error; }

            for (var i in data) {
              var score = type === 'disk' ? 100 - data[i] : data[i];  // reponse disk 是剩余率, show disk 需要使用率
              var pre  = {
                time: times[num],
                data: $scope.percentFormatter(score)
              };

              predictionPanel[type].tips[num] = pre;
              num++;
            }

            predictionPanel[type]['selectedOption'] = predictionPanel[type].tips[0];
            $scope.panels[hostname]['predictionPanel'] = predictionPanel;
          }).catch(function () {
            predictionPanel[type].errTip = '暂无预测数据';
            $scope.panels[hostname]['predictionPanel'] = predictionPanel;
          });
        });

        // topN
        var hostTopN = [];
        var temp = {};
        var promiseList = [];

        var topPanels = $scope._dashboard.rows[6].panels;
        _.each(topPanels, function (panel) {
          var metric = panel.targets[0].metric;
          var queries = [{
            "metric"    : contextSrv.user.orgId + "." + contextSrv.user.systemId + "." + metric,
            "aggregator": "p99",
            "downsample": "1m-avg",
            "tags"      : { "host": hostname, "pid_cmd": "*" }
          }];

          var q = datasourceSrv.getHostResource(queries, 'now-1h').then(function (response) {
            var topN = metric.slice(0, metric.indexOf("."));
            temp[topN] = (response);
          }).finally(function () {
            var d = $q.defer();
            d.resolve();
            return d.promise;
          });

          promiseList.push(q);
        });

        $q.all(promiseList).then(function () {
          var tt = {};
          temp = temp.cpu.concat(temp.mem);

          _.each(temp, function (v) {
            if (!tt[v.tags.pid_cmd]) { tt[v.tags.pid_cmd] = {}; }

            tt[v.tags.pid_cmd]["pid"] = "HOST: " + v.tags.host + "&nbsp;&nbsp;&nbsp;&nbsp;PID: " + v.tags.pid_cmd;
            tt[v.tags.pid_cmd]["host"] = v.tags.host;

            /cpu/.test(v.name) && (tt[v.tags.pid_cmd]["cpu"] = parseFloat(v.value) || 0);
            /mem/.test(v.name) && (tt[v.tags.pid_cmd]["mem"] = parseFloat(v.value) || 0);
          });

          _.each(Object.keys(tt), function (v) {
            hostTopN.push(tt[v]);
          });

          $scope.panels[hostname]['topNPanel'] = hostTopN;
        }, function () {
          hostTopN = [];
        });
      };

      // 弹窗 查看历史情况
      $scope.showModal = function (index, metric, host) {
        $scope.row = $scope._dashboard.rows[index];
        $scope.panel = $scope._dashboard.rows[index].panels[0];

        if (index === 7) {
          setPanelMetaHost($scope.panel, metric, host);
          healthSrv.transformPanelMetricType($scope.panel);
        }

        var healthModal = $modal({
          scope: $scope,
          templateUrl: 'public/app/features/systemoverview/partials/system_overview_modal.html',
          show: false
        });

        healthModal.$promise.then(healthModal.show);
      };

      $scope.renderParams = {
        view : {
          nodes: {
            "default": {
              template: "node",
              events  : {
                click: $scope.nodeClickHandler
              }
            }
          }
        },
        layout:{
          type: "Absolute"
        },
        jsPlumb: {
          Anchor: "Continuous",
          Endpoint: "Blank",
          Connector: ["StateMachine", { cssClass: "connectorClass", hoverClass: "connectorHoverClass" }],
          PaintStyle: { strokeWidth: 1, stroke: '#32b2e1' },
          HoverPaintStyle: { stroke: "orange" },
          Overlays: [
            ["Arrow", { fill: "#09098e", width: 10, length: 10, location: 1 }]
          ]
        },
        lassoFilter: ".controls, .controls *, .miniview, .miniview *",
        dragOptions: {
          filter: ".delete *"
        },
        consumeRightClick: false,
        enablePanButtons: false,
        enableWheelZoom: false
      };

      this.getHostSummary = $scope.getHostSummary;
    });
  });
