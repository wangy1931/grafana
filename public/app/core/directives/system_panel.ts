import $ from 'jquery';
import _ from 'lodash';

import coreModule from 'app/core/core_module';
import 'jquery.flot';
import 'jquery.flot.pie';

function systemPanel($parse, alertMgrSrv, healthSrv, datasourceSrv, contextSrv, backendSrv, $location, $q) {
  return {
    restrict: 'E',
    link: function (scope, elem, attr) {
      scope.enter = function (systemId) {
        contextSrv.user.systemId = systemId;
        contextSrv.hostNum = scope.hostList.length;
        backendSrv.post("/api/system/pick",{SystemId: systemId});
        if (contextSrv.hostNum) {
          contextSrv.toggleSideMenu();
          $location.url("/");
        } else {
          $location.url("/setting/agent");
        }
      };
      scope.init = function () {
        scope.servies = [];
        scope.serviesStatus = {normal: 0, unnormal: 0};
        scope.hostList = [];
        scope.hostStatus = {normal: 0, unnormal: 0};
        scope.critical = 0;
        scope.warn = 0;
        scope.alertNum = 0;
      };
      var getter = $parse(attr.sys), system = getter(scope);
      contextSrv.user.systemId = system;
      var setPie = function(type, system, pieData) {
        if (pieData.length > 1){
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
                  show: false,
              }
            }
          },
          legend: {
            show: false
          },
          colors: colors
        });
      };

      var getPlatform = function() {
        backendSrv.get('/api/static/hosts').then(function(result) {
          scope.platform = result.hosts;
        });
      };
      //------get service satatus
      var getService = backendSrv.getServices().then(function(response) {
        var count = _.countBy(response.data, {alive: 0});
        scope.serviesStatus.normal = count.true || 0;
        scope.serviesStatus.unnormal = count.false || 0;
        scope.servies = response.data;
      });

      //------- get Alerts status
      var getAlertNum = alertMgrSrv.load().then(function(response) {
        return response.data.length;
      });

      var getAlertStatus = alertMgrSrv.loadTriggeredAlerts().then(function onSuccess(response) {
        var count = _.countBy(response.data, {level: 'CRITICAL'});
        return {critical: count.true || 0, warn: count.false || 0};
      });

      //------- get health/anomaly status
      var getHealth = healthSrv.load().then(function (data) {
        scope.numMetrics = data.numMetrics;
        scope.numAnomalyMetrics = data.numAnomalyMetrics;
        scope.health = data.health;
        var annomalyPieData = [
          {label: "", data: scope.numMetrics},
          {label: "", data: scope.numAnomalyMetrics},
        ];
        setPie('sys_annomaly', system, annomalyPieData);
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
          scope.hostList = response.data;
          var count = _.countBy(scope.hostList, {"collector.state": 0});
          scope.hostStatus.unnormal = count.false || 0;
          scope.hostStatus.normal = count.true || 0;
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
      $q.all([getHostStatus, getAlertNum, getAlertStatus]).then(function(result) {
        var hostNum = result[0],
            alertRulesNum = result[1],
            alertStatus = result[2];
        if (typeof(hostNum) === "undefined"){
          getPlatform();
        } else {
          scope.alertNum = alertRulesNum * hostNum;
          scope.warn = alertStatus.warn;
          scope.critical = alertStatus.critical;
          var alertPieData = [
            {label: "", data: (scope.alertNum ? scope.alertNum : 1) - scope.warn - scope.critical},
            {label: "", data: scope.warn},
            {label: "", data: scope.critical}
          ];
          setPie('sys_alert', system, alertPieData);
        }
      }, function() {
        getPlatform();
      });

      scope.init();
    }
  };
}

coreModule.directive('systemPanel', systemPanel);
