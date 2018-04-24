///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';

/** @ngInject */
export function AlertdDatasource(instanceSettings, $q, backendSrv, templateSrv, contextSrv) {
  this.type = 'alertd';
  this.name = instanceSettings.name;
  this.supportMetrics = true;
  this.url = instanceSettings.url;
  this.directUrl = instanceSettings.directUrl;
  this.basicAuth = instanceSettings.basicAuth;
  this.withCredentials = instanceSettings.withCredentials;
  this.lastErrors = {};
  this.prefix = contextSrv.user.orgId + "." + contextSrv.user.systemId + ".";

  this.renderTemplate = function(format, data) {
    var originalSettings = _.templateSettings;
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };

    var template = _.template(templateSrv.replace(format));
    var result;
    try {
      result = template(data);
    } catch (e) {
      result = null;
    }

    _.templateSettings = originalSettings;

    return result;
  };

  this.query = (options) => {
    var target = options.targets[0];

    switch (target.api) {
      case 'predict':
        return this.getPredictQuery(options);
      default:
        var d = $q.defer();
        d.resolve({ data: [] });
        return d.promise;
    }
  }

  this.getPredictQuery = (options) => {
    var target = options.targets[0];
    return backendSrv.alertD({
      method: "GET",
      url: "/predict",
      params: target.params
    }).then((res) => {
      if (res.data.dataPointsEmpty) {
        var result = this.getPredictCaculations(res.data, options);
      } else {
        var result = this.getPredictDataPoints(res.data, options);
      }
      return result;
    }).then((res) => {
      return this.getTsdbDatasource(res, options);
    });
  }

  this.getTsdbDatasource = (res, options) => {
    var target = options.targets[0];
    var reqBody  = {
      start: options.range.from.valueOf(),
      end: options.range.to.valueOf(),
      queries: [{
        metric: this.prefix + target.params.metric,
        aggregator: "sum",
        tags: {host: target.params.host}
      }],
      msResolution: false,
      globalAnnotations: true
    };

    var option = {
      method: 'POST',
      url: backendSrv.opentsdbUrlIntranet + '/api/query',
      data: reqBody,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }

    return backendSrv.datasourceRequest(option).then((tsdbres) => {
      _.each(tsdbres.data, (target) => {
        var tmp = {
          target: target.metric.replace(this.prefix, '') + '{' + target.tags.host + '}',
          datapoints: _.map(target.dps, (value, second) => { return [value, second * 1000]})
        }
        res.push(tmp);
      });
      return {data: res};
    });
  }

  this.getPredictDataPoints = (params, options) => {
    var target = options.targets[0];
    var result = [{
      target: target.params.metric + ".upperLimit{" + target.params.host + "}",
      datapoints: []
    },{
      target: target.params.metric + ".lowerLimit{" + target.params.host + "}",
      datapoints: []
    }];
    result[0].datapoints = _.map(params.secToMaxMap, (value, second) => {
      return [value, second * 1000]
    });
    result[1].datapoints = _.map(params.secToMinMap, (value, second) => {
      return [value, second * 1000]
    });
    return result;
  }

  this.getPredictCaculations = (params, options) => {
    var target = options.targets[0];
    var result = [{
      target: target.params.metric + ".upperLimit{" + target.params.host + "}",
      datapoints: []
    },{
      target: target.params.metric + ".lowerLimit{" + target.params.host + "}",
      datapoints: []
    }];
    var from = Math.round(options.range.from.valueOf() / 1000);
    var to = Math.round(options.range.to.valueOf() / 1000);
    var step = Math.round((to - from) / 360);
    do {
      result[0].datapoints.push(this.caculate(params.upperLimit, from));
      result[1].datapoints.push(this.caculate(params.lowerLimit, from));
      from += step;
    } while (from < to);

    return result;
  }

  this.caculate = (params, seconds) => {
    var value = params.first * seconds * seconds + params.second * seconds + params.third;
    return [value, seconds * 1000]
  }

}
