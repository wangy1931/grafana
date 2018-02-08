
import angular from 'angular';
import _ from 'lodash';

/** @ngInject */
export function CustomDatasource(instanceSettings, $q, backendSrv, templateSrv) {
  this.type = 'customdb';
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

}
