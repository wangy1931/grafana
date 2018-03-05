import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';
import appEvents from 'app/core/app_events';
import config from 'app/core/config';

export class BackendSrv {
  private inFlightRequests = {};
  private HTTP_REQUEST_CANCELLED = -1;
  private noBackendCache: boolean;
  private alertDUrl: string;
  private downloadUrl: string;
  private tokens: any;

  /** @ngInject */
  constructor(private $http, private alertSrv, private $q, private $timeout, private contextSrv) {}

  get(url, params?) {
    return this.request({ method: 'GET', url: url, params: params });
  }

  delete(url) {
    return this.request({ method: 'DELETE', url: url });
  }

  post(url, data) {
    return this.request({ method: 'POST', url: url, data: data });
  }

  patch(url, data) {
    return this.request({ method: 'PATCH', url: url, data: data });
  }

  put(url, data) {
    return this.request({ method: 'PUT', url: url, data: data });
  }

  withNoBackendCache(callback) {
    this.noBackendCache = true;
    return callback().finally(() => {
      this.noBackendCache = false;
    });
  }

  requestErrorHandler(err) {
    if (err.isHandled) {
      return;
    }

    var data = err.data || { message: 'Unexpected error' };
    if (_.isString(data)) {
      data = { message: data };
    }

    if (err.status === 422) {
      this.alertSrv.set('Validation failed', data.message, 'warning', 4000);
      throw data;
    }

    data.severity = 'error';

    if (err.status < 500) {
      data.severity = 'warning';
    }

    if (data.message) {
      let description = '';
      let message = data.message;
      if (message.length > 80) {
        description = message;
        message = 'Error';
      }
      this.alertSrv.set(message, description, data.severity, 10000);
    }

    throw data;
  }

  request(options) {
    options.retry = options.retry || 0;
    var requestIsLocal = !options.url.match(/^http/);
    var firstAttempt = options.retry === 0;

    if (requestIsLocal && !options.hasSubUrl) {
      options.url = config.appSubUrl + options.url;
      options.hasSubUrl = true;
    }

    if (this.isIE()) {
      var bust = Date.now();
      options.params ? options.params.bust = bust : options.params = {'bust': bust};
    }

    return this.$http(options).then(
      results => {
        if (options.method !== 'GET') {
          if (results && results.data.message) {
            if (options.showSuccessAlert !== false) {
              this.alertSrv.set(results.data.message, '', 'success', 3000);
            }
          }
        }
        return results.data;
      },
      err => {
        // handle unauthorized
        if (err.status === 401 && this.contextSrv.user.isSignedIn && firstAttempt) {
          return this.loginPing().then(() => {
            options.retry = 1;
            return this.request(options);
          });
        }

        this.$timeout(this.requestErrorHandler.bind(this, err), 50);
        throw err;
      }
    );
  }

  addCanceler(requestId, canceler) {
    if (requestId in this.inFlightRequests) {
      this.inFlightRequests[requestId].push(canceler);
    } else {
      this.inFlightRequests[requestId] = [canceler];
    }
  }

  resolveCancelerIfExists(requestId) {
    var cancelers = this.inFlightRequests[requestId];
    if (!_.isUndefined(cancelers) && cancelers.length) {
      cancelers[0].resolve();
    }
  }

  datasourceRequest(options) {
    options.retry = options.retry || 0;

    // A requestID is provided by the datasource as a unique identifier for a
    // particular query. If the requestID exists, the promise it is keyed to
    // is canceled, canceling the previous datasource request if it is still
    // in-flight.
    var requestId = options.requestId;
    if (requestId) {
      this.resolveCancelerIfExists(requestId);
      // create new canceler
      var canceler = this.$q.defer();
      options.timeout = canceler.promise;
      this.addCanceler(requestId, canceler);
    }

    var requestIsLocal = !options.url.match(/^http/);
    var firstAttempt = options.retry === 0;

    if (this.isIE()) {
      var bust = Date.now();
      options.params ? options.params.bust = bust : options.params = {'bust': bust};
    }

    return this.$http(options)
      .then(response => {
        appEvents.emit('ds-request-response', response);
        return response;
      })
      .catch(err => {
        if (err.status === this.HTTP_REQUEST_CANCELLED) {
          throw { err, cancelled: true };
        }

        // handle unauthorized for backend requests
        if (requestIsLocal && firstAttempt && err.status === 401) {
          return this.loginPing().then(() => {
            options.retry = 1;
            if (canceler) {
              canceler.resolve();
            }
            return this.datasourceRequest(options);
          });
        }

        // populate error obj on Internal Error
        if (_.isString(err.data) && err.status === 500) {
          err.data = {
            error: err.statusText,
            response: err.data,
          };
        }

        // for Prometheus
        // if (err.data && !err.data.message && _.isString(err.data.error)) {
        //   err.data.message = err.data.error;
        // }
        appEvents.emit('ds-request-error', err);
        throw err;
      })
      .finally(() => {
        // clean up
        if (options.requestId) {
          this.inFlightRequests[options.requestId].shift();
        }
      });
  }

  loginPing() {
    return this.request({ url: '/api/login/ping', method: 'GET', retry: 1 });
  }

  search(query) {
    return this.get('/api/search', query);
  }

  getDashboard(type, slug) {
    return this.get('/api/dashboards/' + type + '/' + slug);
  }

  // getDashboardByUid(uid: string) {
  //   return this.get(`/api/dashboards/uid/${uid}`);
  // }
  saveDashboard(dash, options) {
    options = options || {};

    return this.post('/api/dashboards/db/', {
      dashboard: dash,
      // folderId: options.folderId,
      overwrite: options.overwrite === true,
      // message: options.message || '',
    });
  }

  // createDashboardFolder(name) {
  //   const dash = {
  //     schemaVersion: 16,
  //     title: name.trim(),
  //     editable: true,
  //     panels: [],
  //   };
  //   return this.post('/api/dashboards/db/', {
  //     dashboard: dash,
  //     isFolder: true,
  //     overwrite: false,
  //   }).then(res => {
  //     return this.getDashboard('db', res.slug);
  //   });
  // }
  saveFolder(dash, options) {
    options = options || {};

    return this.post('/api/dashboards/db/', {
      dashboard: dash,
      // isFolder: true,
      overwrite: options.overwrite === true,
      // message: options.message || '',
    });
  }

  getSystemById(id) {
    var sys = '';
    _.each(this.contextSrv.systemsMap, system => {
      if (system.Id === parseInt(id)) {
        sys = system.SystemsName;
      }
    });
    return sys;
  }

  updateSystemsMap() {
    var getTokens = this.updateTokens();

    var getSystems = this.get("/api/user/system").then(
      systems => {
        this.contextSrv.systemsMap = systems;
      }
    );
    return this.$q.all([getTokens, getSystems]);
  }

  updateTokens() {
    var updateToken = this.get('/api/auth/keys').then(
      tokens => {
        this.tokens = tokens;
      }
    );
    return this.$q.all([updateToken, this.initCustomizedSources()]);
  }

  updateSystemId(id) {
    this.contextSrv.user.systemId = id;
  }

  initCustomizedSources() {
    return this.get('/api/customized_sources').then(
      result => {
        this.alertDUrl = result.alert;
        this.downloadUrl = result.download;
        this.contextSrv.elkUrl = result.elk;
      }
    );
  }

  getToken() {
    return _.chain(this.tokens)
      .filter({ 'name': this.contextSrv.user.systemId.toString() })
      .first()
      .pick('key')
      .values()
      .first()
      .value();
  }

  alertD(options) {
    if (_.isEmpty(options.params)) {
      options.params = {};
    }
    if (this.tokens) {
      options.url = this.alertDUrl + options.url;
      options.params.token = this.getToken();
      return this.datasourceRequest(options);
    }
    return this.updateTokens()
      .then(() => {
        options.url = this.alertDUrl + options.url;
        options.params.token = this.getToken();
      })
      .then(() => {
        if (_.isEmpty(options.params.token)) {
          this.alertSrv.set("错误,无法获取TOKEN", "请联系service@cloudwiz.cn", "warning", 4000);
          var d = this.$q.defer();
          d.resolve({});
          return d.promise;
        }
        return this.datasourceRequest(options);
      });
  }

  logCluster(options) {
    if (_.isEmpty(options.params)) {
      options.params = {};
    }
    options.withCredentials = true;
    options.url = this.contextSrv.elkUrl + options.url;
    return this.datasourceRequest(options);
  }

  knowledge(options) {
    if (_.isEmpty(options.params)) {
      options.params = {};
    }
    options.withCredentials = true;
    options.url = this.contextSrv.elkUrl + "/knowledgebase/article" + options.url;
    return this.datasourceRequest(options);
  }

  suggestTagHost(query, callback) {
    this.alertD({
      method: "get",
      url: "/summary",
      params: {metrics: "collector.summary"},
      headers: {'Content-Type': 'text/plain'},
    })
    .then(response => {
      var hosts = [];
      _.each(response.data, summary => {
        hosts.push(summary.tag.host);
      });
      return hosts;
    })
    .then(callback);
  }

  getPrediction(params) {
    return this.alertD({
      method: "get",
      url: "/anomaly/prediction",
      params: params,
      headers: {'Content-Type': 'application/json;'},
    });
  }

  getPredictionPercentage(params) {
    return this.alertD({
      method: "get",
      url   : "/anomaly/prediction/usages",
      params: params,
      headers: {'Content-Type': 'application/json;'}
    });
  }

  getHostsNum() {
    return this.alertD({
      method: "get",
      url: "/cmdb/host"
    }).then(response => {
      return response.data.length;
    });
  }

  saveCustomSoftware(params, url) {
    return this.alertD({
      method: "post",
      url: url,
      data: angular.toJson(params),
      headers: {'Content-Type': 'application/json;'},
    });
  }

  editServiceHost(params) {
    return this.alertD({
      method: "post",
      url: "/cmdb/relationship/overwrite",
      data: angular.toJson(params),
      headers: {'Content-Type': 'application/json;'},
    });
  }

  readMetricHelpMessage(key) {
    !_.metricMessage[key] && this.get('/api/static/metric/' + key)
      .then(result => {
        _.metricMessage[key] = result;
        _.extend(_.metricHelpMessage, result);
      })
      .catch(err => {
        // set isHandled true, then alertSrv won't show
        err.isHandled = true;
      });
  }

  getHosts(query) {
    return this.alertD({
      method: "POST",
      url   : "/host/metrics",
      data  : query
    });
  }

  getServices() {
    return this.alertD({
      method: 'get',
      url   : "/cmdb/service/metrics"
    });
  }

  getKpi(params) {
    return this.alertD({
      method: 'get',
      url   : '/service/kpi',
      params: params
    });
  }

  editKpi(params) {
    return this.alertD({
      method: 'post',
      url   : '/service/kpi',
      params: params
    });
  }

  importMetricsKpi() {
    return this.get('/api/static/metric/kpi');
  }

  isIE() {
    var userAgent = navigator.userAgent;
    return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
  }

  getOpentsdbExpressionQuery(query, opentsdbUrl) {
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
          "id": "aa",
          "expr": query.metricExpression, // "a + b"
          "join": {
            "operator": "intersection",
            "useQueryTags": true,
            "includeAggTags": false
          }
        }
      ],
      "outputs": [
        { "id": "aa", "alias": "Mega expression" }
      ]
    };

    return this.datasourceRequest({
      method: 'POST',
      url: opentsdbUrl + '/api/query/exp',
      data: tmpl
    });
  }

  switchOrg(orgId) {
    this.post('/api/user/using/' + orgId, {}).then(() => {
      this.contextSrv.sidemenu = false;
      window.location.href = config.appSubUrl + '/systems';
    });
  }

  getOrgsMenu() {
    var item: any = [];
    return this.get('/api/user/orgs').then(orgs => {
      orgs.forEach((org, index) => {
        if (org.orgId === this.contextSrv.user.orgId) {
          return;
        }

        item.push({
          id: org.orgId,
          text: org.name,
          url: org.name,
          click: () => {
            this.switchOrg(org.orgId);
          }
        });
      });
      return item;
    });
  }
}

coreModule.service('backendSrv', BackendSrv);
