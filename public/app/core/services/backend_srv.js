define([
  'angular',
  'lodash',
  '../core_module',
  'app/core/config',
],
function (angular, _, coreModule, config) {
  'use strict';

  coreModule.default.service('backendSrv', function($http, alertSrv, $timeout, contextSrv, $q) {
    var self = this;
    this.alertDUrl;
    this.downloadUrl;
    this.tokens = null;

    this.get = function(url, params) {
      return this.request({ method: 'GET', url: url, params: params });
    };

    this.delete = function(url) {
      return this.request({ method: 'DELETE', url: url });
    };

    this.post = function(url, data) {
      return this.request({ method: 'POST', url: url, data: data });
    };

    this.patch = function(url, data) {
      return this.request({ method: 'PATCH', url: url, data: data });
    };

    this.put = function(url, data) {
      return this.request({ method: 'PUT', url: url, data: data });
    };

    this._handleError = function(err) {
      return function() {
        if (err.isHandled) {
          return;
        }

        var data = err.data || { message: 'Unexpected error' };
        if (_.isString(data)) {
          data = { message: data };
        }

        if (err.status === 422) {
          alertSrv.set("Validation failed", data.message, "warning", 4000);
          throw data;
        }

        data.severity = 'error';

        if (err.status < 500) {
          data.severity = "warning";
        }

        if (data.message) {
          alertSrv.set("Problem!", data.message, data.severity, 10000);
        }

        throw data;
      };
    };

    this.request = function(options) {
      options.retry = options.retry || 0;
      var requestIsLocal = options.url.indexOf('/') === 0;
      var firstAttempt = options.retry === 0;

      if (requestIsLocal && !options.hasSubUrl) {
        options.url = config.appSubUrl + options.url;
        options.hasSubUrl = true;
      }

      if (self.isIE()) {
        var bust = Date.now();
        options.params ? options.params.bust = bust : options.params = {'bust': bust};
      }

      return $http(options).then(function(results) {
        if (options.method !== 'GET') {
          if (results && results.data.message) {
            alertSrv.set(results.data.message, '', 'success', 3000);
          }
        }
        return results.data;
      }, function(err) {
        // handle unauthorized
        if (err.status === 401 && firstAttempt) {
          return self.loginPing().then(function() {
            options.retry = 1;
            return self.request(options);
          });
        }

        $timeout(self._handleError(err), 50);
        throw err;
      });
    };

    this.datasourceRequest = function(options) {
      options.retry = options.retry || 0;
      var requestIsLocal = options.url.indexOf('/') === 0;
      var firstAttempt = options.retry === 0;

      if (self.isIE()) {
        var bust = Date.now();
        options.params ? options.params.bust = bust : options.params = {'bust': bust};
      }

      return $http(options).then(null, function(err) {
        // handle unauthorized for backend requests
        if (requestIsLocal && firstAttempt  && err.status === 401) {
          return self.loginPing().then(function() {
            options.retry = 1;
            return self.datasourceRequest(options);
          });
        }

        //populate error obj on Internal Error
        if (_.isString(err.data) && err.status === 500) {
          err.data = {
            error: err.statusText,
            response: err.data,
          };
        }

        // for Prometheus
        // if (!err.data.message && _.isString(err.data.error)) {
        //   err.data.message = err.data.error;
        // }

        throw err;
      });
    };

    this.loginPing = function() {
      return this.request({url: '/api/login/ping', method: 'GET', retry: 1 });
    };

    this.search = function(query) {
      return this.get('/api/search', query);
    };

    this.getDashboard = function(type, slug) {
      return this.get('/api/dashboards/' + type + '/' + slug);
    };

    this.saveDashboard = function(dash, options) {
      options = (options || {});
      return this.post('/api/dashboards/db/', {dashboard: dash, overwrite: options.overwrite === true});
    };

    this.getSystemById = function (id) {
      var sys = '';
      _.each(contextSrv.systemsMap, function (system) {
        if (system.Id === parseInt(id)) {
          sys = system.SystemsName;
        }
      });
      return sys;
    };

    //update system cache when systems change
    this.updateSystemsMap = function () {
      var getTokens = this.updateTokens();

      var getSystems = this.get("/api/user/system").then(function (systems) {
        contextSrv.systemsMap = systems;
      });
      return $q.all([getTokens, getSystems]);
    };

    this.updateTokens = function () {
      var updateToken = this.get('/api/auth/keys').then(function (tokens) {
        self.tokens = tokens;
      });
      return $q.all([updateToken, this.initCustomizedSources()]);
    };

    this.updateSystemId = function(id) {
      contextSrv.user.systemId = id;
    };

    this.initCustomizedSources = function () {
      return this.get('/api/customized_sources').then(function (result) {
        self.alertDUrl = result.alert;
        self.downloadUrl = result.download;
        contextSrv.elkUrl = result.elk;
      });
    };

    this.getToken = function () {
      return _.chain(self.tokens).filter({'name': contextSrv.user.systemId.toString()}).first().pick('key').values().first().value();
    };

    this.alertD = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      if (self.tokens) {
        options.url = self.alertDUrl + options.url;
        options.params.token = this.getToken();
        return this.datasourceRequest(options);
      }
      return self.updateTokens().then(function () {
        options.url = self.alertDUrl + options.url;
        options.params.token = self.getToken();
      }).then(function () {
        if (_.isEmpty(options.params.token)) {
          alertSrv.set("错误,无法获取TOKEN", "请联系service@cloudwiz.cn", "warning", 4000);
          var d = $q.defer();
          d.resolve({});
          return d.promise;
        }
        return self.datasourceRequest(options);
      });
    };

    this.logCluster = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      options.withCredentials = true;
      options.url = contextSrv.elkUrl + options.url;
      return this.datasourceRequest(options);
    };

    this.knowledge = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      options.withCredentials = true;
      options.url = contextSrv.elkUrl + "/knowledgebase/article" + options.url;
      return this.datasourceRequest(options);
    };

    this.suggestTagHost = function (query, callback) {
      self.alertD({
        method: "get",
        url: "/summary",
        params: {metrics: "collector.summary"},
        headers: {'Content-Type': 'text/plain'},
      }).then(function (response) {
        var hosts = [];
        _.each(response.data, function (summary) {
          hosts.push(summary.tag.host);
        });
        return hosts;
      }).then(callback);
    };

    this.getPrediction = function(params) {
      return self.alertD({
        method: "get",
        url: "/anomaly/prediction",
        params: params,
        headers: {'Content-Type': 'application/json;'},
      });
    };

    this.getPredictionPercentage = function (params) {
      return self.alertD({
        method: "get",
        url   : "/anomaly/prediction/usages",
        params: params,
        headers: {'Content-Type': 'application/json;'}
      });
    };

    this.getHostsNum = function () {
      return this.alertD({
        method: "get",
        url: "/cmdb/host"
      }).then(function (response) {
        return response.data.length;
      });
    };

    this.saveCustomSoftware = function(params, url) {
      return this.alertD({
        method: "post",
        url: url,
        data: angular.toJson(params),
        headers: {'Content-Type': 'application/json;'},
      });
    };

    this.editServiceHost = function(params) {
      return this.alertD({
        method: "post",
        url: "/cmdb/relationship/overwrite",
        data: angular.toJson(params),
        headers: {'Content-Type': 'application/json;'},
      });
    };

    this.readMetricHelpMessage = function (key) {
      !_.metricMessage[key] && this.get('/api/static/metric/' + key).then(function (result) {
        _.metricMessage[key] = result;
        _.extend(_.metricHelpMessage, result);
      })
      .catch(function (err) {
        // set isHandled true, then alertSrv won't show
        err.isHandled = true;
      });
    };

    this.getHosts = function (query) {
      return this.alertD({
        method: "POST",
        url   : "/host/metrics",
        data  : query
      });
    };

    this.getKpi = function(params) {
      return this.alertD({
        method: 'get',
        url   : '/service/kpi',
        params: params
      });
    }

    this.editKpi = function(params) {
      return this.alertD({
        method: 'post',
        url   : '/service/kpi',
        params: params
      });
    }

    this.importMetricsKpi = function() {
      return this.get('/api/static/metric/kpi');
    }

    this.isIE = function() {
      var userAgent = navigator.userAgent;
      return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
    }

    this.getOpentsdbExpressionQuery = function (query, opentsdbUrl) {
      var tags = query.tags || [
        {
          "type": "wildcard",
          "tagk": "host",
          "filter": "*",
          "groupBy": true
        }
      ];
      var tmpl = {
        "time": {
          "start": query.timeRange.from,
          "end": query.timeRange.to,
          "aggregator": "sum",
          "downsampler": {
            "interval": "1m",
            "aggregator": "avg"
          }
        },
        "filters": [
          {
            "tags": tags,
            "id": "f1"
          }
        ],
        "metrics": query.metrics,
        "expressions": [
          {
            "id": "e",
            "expr": query.metricExpression, // "a + b"
            "join": {
              "operator": "intersection",
              "useQueryTags": true,
              "includeAggTags": false
            }
          }
        ],
        "outputs": [
          { "id": "e", "alias": "Mega expression" }
        ]
      };

      return this.datasourceRequest({
        method: 'POST',
        url: opentsdbUrl + '/api/query/exp',
        data: tmpl
      });
    }
  });
});
