define([
  'jquery',
  'lodash',
  '../core_module',
  'jquery.flot',
  'jquery.flot.pie',
], function ($, _, coreModule) {
  'use strict';

  coreModule.default.directive('systemPanel', function ($parse, alertMgrSrv, healthSrv, datasourceSrv, contextSrv, backendSrv, $location, $q) {
    return {
      restrict: 'E',
      link: function (scope, elem, attr) {
        scope.enter = function (systemId) {
          contextSrv.user.systemId = systemId;
          contextSrv.hostNum = scope.hostList.length;
          backendSrv.post("/api/system/pick",{SystemId: systemId});
          if(contextSrv.hostNum) {
            contextSrv.toggleSideMenu();
            $location.url("/");
          } else {
            $location.url("/setting/agent");
          }
        };
        scope.init = function () {
          scope.servies = [];
          scope.seriesStatus = {normal: 0, unnormal: 0};
          scope.hostList = [];
          scope.hostStatus = {normal: 0, unnormal: 0};
          scope.critical = 0;
          scope.warn = 0;
          scope.alertNum = 0;
        };
        var getter = $parse(attr.sys), system = getter(scope);
        contextSrv.user.systemId = system;
        //------get service satatus
        var getService = function() {
          var serviesMap = _.allServies();
          _.each(Object.keys(serviesMap), function (key) {
            var queries = [{
              "metric": contextSrv.user.orgId + "." + system + "." + key + ".state",
              "aggregator": "sum",
              "downsample": "1s-sum",
              "tags":{"host":"*"}
            }];

            var time = 'now-5m';

            datasourceSrv.getStatus(queries, time).then(function(response) {
              _.each(response, function (service) {
                if (_.isObject(service)) {
                  var status = service.dps[_.last(Object.keys(service.dps))];
                  if(typeof(status) !== "number") {
                    throw Error;
                  }
                  if(status > 0) {
                    scope.seriesStatus.unnormal++;
                  } else {
                    scope.seriesStatus.normal++;
                  }
                  service.status = status;
                  service.name = serviesMap[key];
                  scope.servies.push(service);
                }
              });
            });
          });
        };

        //------- get Alerts status
        var getAlertNum = alertMgrSrv.load().then(function(response) {
          return response.data.length;
        });

        var getAlertStatus = alertMgrSrv.loadTriggeredAlerts().then(function onSuccess(response) {
          var critical = 0;
          var warn = 0;
          for (var i = 0; i < response.data.length; i++) {
            var alertDetail = response.data[i];
            if (alertDetail.status.level === "CRITICAL") {
              critical++;
            } else {
              warn++;
            }
          }
          return {critical:critical, warn: warn};
        });

        //------- get health/anomaly status
        var getHealth = healthSrv.load().then(function (data) {
          scope.numMetrics = data.numMetrics;
          scope.numAnomalyMetrics = data.numAnomalyMetrics;
          scope.health = data.health;
        });

        //-------- get host status
        var query = {
          "queries": [
            {
              "metric": "collector.state"
            }
          ],
          "hostProperties": []
        };
        var getHostStatus = backendSrv.getHosts(query).then(function (response) {
          if (response.data.length) {
            _.each(response.data, function (item) {
              var host = {
                "host": item.hostname,
                "status": 0,
              };

              if (item["collector.state"] > 0) {
                host.status = 1;
                scope.hostStatus.unnormal++;
              } else {
                host.status = 0;
                scope.hostStatus.normal++;
              }

              scope.hostList.push(host);
            });
            return scope.hostList.length;
          } else {
            var d = $q.defer();
            d.resolve();
            return d.promise;
          }
        }, function() {
          getPlatform();
        });

        //------- alertNum = alertRules * hostNum;
        var setPie = function(type, system, pieData) {
          var colors = pieData.length > 1 ? ['rgb(61,183,121)','rgb(255,197,58)','rgb(224,76,65)'] : ['#555'];

          $.plot("["+ type +"='" + system + "']", pieData, {
            series: {
              pie: {
                innerRadius: 0.5,
                show: true,
                label: {
                  show: false,
                }
              }
            },
            legend:{
              show:false
            },
            colors: colors
          });
        };

        var getPlatform = function() {
          backendSrv.get('/api/static/hosts').then(function(result) {
            scope.platform = result.hosts;
          });
        };

        $q.all([getHostStatus, getAlertNum, getAlertStatus, getService, getHealth]).then(function(result) {
          var hostNum = result[0],
              alertRulesNum = result[1],
              alertStatus = result[2],
              getService = result[3];
          if(typeof(hostNum) === "undefined"){
            getPlatform();
          } else {
            getService();
            scope.alertNum = alertRulesNum * hostNum;
            scope.warn = alertStatus.warn;
            scope.critical = alertStatus.critical;
            var alertPieData = [
              {label: "", data: (scope.alertNum ? scope.alertNum : 1) - scope.warn - scope.critical},
              {label: "", data: scope.warn},
              {label: "", data: scope.critical}
            ];
            setPie('sys_alert', system, alertPieData);
            var annomalyPieData = [
              {label: "", data: scope.numMetrics},
              {label: "", data: scope.numAnomalyMetrics},
            ];
            setPie('sys_annomaly', system, annomalyPieData);
          }
        },function() {
          getPlatform();
        });

        scope.init();
      }
    };
  });
});