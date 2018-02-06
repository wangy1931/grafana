///<reference path="../../../headers/common.d.ts" />

import _ from 'lodash';

/** @ngInject */
export function AlertdDatasource(instanceSettings, $q, backendSrv, templateSrv) {
  this.type = 'alertd';
  this.name = instanceSettings.name;
  this.supportMetrics = true;
  this.url = instanceSettings.url;
  this.directUrl = instanceSettings.directUrl;
  this.basicAuth = instanceSettings.basicAuth;
  this.withCredentials = instanceSettings.withCredentials;
  this.lastErrors = {};

  this._request = function(method, url) {
    var options: any = {
      url: this.url + url,
      method: method
    };

    if (this.basicAuth || this.withCredentials) {
      options.withCredentials = true;
    }
    if (this.basicAuth) {
      options.headers = {
        "Authorization": this.basicAuth
      };
    }

    return backendSrv.datasourceRequest(options);
  };

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
    return backendSrv.alertD({
      method: target.method,
      url: target.url,
      params: target.params
    }).then((res) => {
      return res;
    });
  }

}
