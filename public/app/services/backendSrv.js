define([
  'angular',
  'lodash',
  'config',
],
function (angular, _, config) {
  'use strict';

  var module = angular.module('grafana.services');

  module.service('backendSrv', function($http, alertSrv, $timeout, contextSrv) {
    var self = this;
    this.alertDUrl;
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

      return $http(options).then(null, function(err) {
        // handle unauthorized for backend requests
        if (requestIsLocal && firstAttempt  && err.status === 401) {
          return self.loginPing().then(function() {
            options.retry = 1;
            return self.datasourceRequest(options);
          });
        }

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
        if (system.Id == id) {
          sys = system.SystemsName;
        }
      });
      return sys;
    };

    //update system cache when systems change
    this.updateSystemsMap = function() {
      this.get('/api/auth/keys').then(function (tokens) {
        self.tokens = tokens;
      });

      return this.get("/api/user/system").then(function (systems) {
        contextSrv.systemsMap = systems;
      });
    };

    this.updateSystemId = function(id) {
      contextSrv.system = id;
    };

    this.initAlertDUrl = function () {
      this.get('/api/alertsource').then(function (result) {
        self.alertDUrl = result.alert.alert_urlroot;
      });
    };

    this.getToken = function () {
      return _.chain(self.tokens).filter({'name': contextSrv.system}).first().pick('key').values().first().value();
    };

    this.alertD = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      options.url = self.alertDUrl + options.url;
      options.params.token = this.getToken();
      if (_.isEmpty(options.params.token)) {
        alertSrv.set("错误", "无法获取TOKEN", "warning", 4000);
      }
      return this.datasourceRequest(options);
    };
  });
});