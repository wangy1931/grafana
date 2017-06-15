define([
    'jquery',
    'lodash',
    '../core_module',
    'app/core/utils/datemath',
    'jquery.flot',
    'jquery.flot.pie',
  ],
  function ($, _, coreModule, dateMath) {
    'use strict';

    coreModule.directive('systemPanel', function ($parse, alertMgrSrv, healthSrv, datasourceSrv, contextSrv, backendSrv, $location, $q) {
      return {
        restrict: 'E',
        link: function (scope, elem, attr) {
          scope.enter = function (systemId) {
            contextSrv.system = systemId;
            contextSrv.hostNum = scope.hostList.length;
            if(contextSrv.hostNum) {
              scope.appEvent("toggle-sidemenu");
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
          datasourceSrv.get("opentsdb").then(function (datasource) {
            scope.datasource = datasource;
          }).then(function () {
            contextSrv.system = system;
            //------get service satatus
            var getService = function() {
              var serviesMap = _.allServies();
              _.each(Object.keys(serviesMap), function (key) {
                var queries = [{
                  "metric": contextSrv.user.orgId + "." + system + "." + key + ".state",
                  "aggregator": "sum",
                  "downsample": "10m-sum",
                }];

                scope.datasource.performTimeSeriesQuery(queries, dateMath.parse('now-10m', false).valueOf(), null).then(function (response) {
                  if (_.isEmpty(response.data)) {
                    throw Error;
                  }
                  var service = {
                    "name": serviesMap[key],
                    "status": response.data[0].dps[Object.keys(response.data[0].dps)[0]]
                  };
                  if(service.status) {
                    scope.seriesStatus.unnormal++;
                  } else {
                    scope.seriesStatus.normal++;
                  }
                  scope.servies.push(service);
                }).catch(function () {
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
              var pieData = [];
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
            var getHostStatus = backendSrv.alertD({
              method: "get",
              url: "/summary",
              params: {metrics: "collector.summary"},
              headers: {'Content-Type': 'text/plain'},
            }).then(function (response) {
              if(response.data.length){
                _.each(response.data, function (summary) {
                  var host = {
                    "host": summary.tag.host,
                    "status": 0,
                  };

                  var queries = [{
                    "metric": contextSrv.user.orgId + "." + system + ".collector.state",
                    "aggregator": "sum",
                    "downsample": "1m-sum",
                    "tags": {"host": summary.tag.host}
                  }];

                  scope.datasource.performTimeSeriesQuery(queries, dateMath.parse('now-1m', false).valueOf(), null).then(function (response) {
                    if (_.isEmpty(response.data)) {
                      throw Error;
                    }
                    _.each(response.data, function (metricData) {
                      if (_.isObject(metricData)) {
                        if (metricData.dps[Object.keys(metricData.dps)[0]] > 0) {
                          host.status = 1;
                          scope.hostStatus.unnormal++;
                        } else {
                          host.status = 0;
                          scope.hostStatus.normal++;
                        }
                      }
                    });
                  }).catch(function () {
                    scope.hostStatus.unnormal++;
                    host.status = 1;
                    //nothing to do ;
                  });

                  scope.hostList.push(host);
                });
                return scope.hostList.length;
              } else {
                var d = $q.defer();
                d.resolve();
                return d.promise;
              }
            }, function(err) {
              var d = $q.defer();
              d.resolve();
              return d.promise;
            });

            //------- alertNum = alertRules * hostNum;
            var setPie = function(type, system, pieData) {
              if(pieData.length > 1){
                var colors = ['rgb(61,183,121)','rgb(255,197,58)','rgb(224,76,65)'];
              } else {
                var colors = ['#555'];
              }
              $.plot("["+ type +"='" + system + "']", pieData, {
                series: {
                  pie: {
                    innerRadius: 0.5,
                    show: true,
                    label: {
                        show: true,
                        radius: 1/4,
                    }
                  }
                },
                legend:{
                  show:false
                },
                colors: colors
              });
            };

            $q.all([getHostStatus, getAlertNum, getAlertStatus, getService, getHealth]).then(function(result) {
              var hostNum = result[0],
                  alertRulesNum = result[1],
                  alertStatus = result[2],
                  getService = result[3];
              if(typeof(hostNum) == "undefined"){
                backendSrv.get('/api/static/hosts').then(function(result) {
                  scope.platform = result.hosts;
                });
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
            });
          });
          scope.init();
        }
      };
    });
  });