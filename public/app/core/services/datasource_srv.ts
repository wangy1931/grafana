import System from 'systemjs/dist/system.js';
import _ from 'lodash';
import coreModule from 'app/core/core_module';
import config from 'app/core/config';
import * as dateMath from 'app/core/utils/datemath';

export class DatasourceSrv {
  datasources: any;

  /** @ngInject */
  constructor(private $q, private $injector, $rootScope, private templateSrv) {
    this.init();
  }

  init() {
    this.datasources = {};
  }

  get(name) {
    if (!name) {
      return this.get(config.defaultDatasource);
    }

    name = this.templateSrv.replace(name);

    if (name === 'default') {
      return this.get(config.defaultDatasource);
    }

    if (this.datasources[name]) {
      return this.$q.when(this.datasources[name]);
    }

    return this.loadDatasource(name);
  }

  loadDatasource(name) {
    var dsConfig = config.datasources[name];
    if (!dsConfig) {
      return this.$q.reject({ message: 'Datasource named ' + name + ' was not found' });
    }

    var deferred = this.$q.defer();
    var pluginDef = dsConfig.meta;

    System.import(pluginDef.module)
      .then(plugin => {
        // check if its in cache now
        if (this.datasources[name]) {
          deferred.resolve(this.datasources[name]);
          return;
        }

        // plugin module needs to export a constructor function named Datasource
        if (!plugin.Datasource) {
          throw new Error('Plugin module is missing Datasource constructor');
        }

        var instance = this.$injector.instantiate(plugin.Datasource, { instanceSettings: dsConfig });
        instance.meta = pluginDef;
        instance.name = name;
        this.datasources[name] = instance;
        deferred.resolve(instance);
      })
      .catch(function(err) {
        this.$rootScope.appEvent('alert-error', [dsConfig.name + ' plugin failed', err.toString()]);
      });

    return deferred.promise;
  }

  getAll() {
    return config.datasources;
  }

  getAnnotationSources() {
    return _.reduce(config.datasources, function(memo, value) {

      if (value.meta && value.meta.annotations) {
        memo.push(value);
      }

      return memo;
    }, []);
  }

  getMetricSources(options) {
    var metricSources = [];

    _.each(config.datasources, function(value, key) {
      if (value.meta && value.meta.metrics) {
        metricSources.push({
          value: key === config.defaultDatasource ? null : key,
          name: key,
          meta: value.meta,
        });
      }
    });

    if (!options || !options.skipVariables) {
      this.addDataSourceVariables(metricSources);
    }

    metricSources.sort(function(a, b) {
      if (a.meta.builtIn || a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });

    return metricSources;
  }

  addDataSourceVariables(list) {
    // look for data source variables
    for (var i = 0; i < this.templateSrv.variables.length; i++) {
      var variable = this.templateSrv.variables[i];
      if (variable.type !== 'datasource') {
        continue;
      }

      var first = variable.current.value;
      if (first === 'default') {
        first = config.defaultDatasource;
      }

      var ds = config.datasources[first];

      if (ds) {
        list.push({
          name: '$' + variable.name,
          value: '$' + variable.name,
          meta: ds.meta,
        });
      }
    }
  }

  getStatus(query, startTime, endTime) {
    var end = endTime ? dateMath.parse(endTime, false).valueOf() : null;
    return this.get('opentsdb').then((datasource) => {
      return datasource.performTimeSeriesQuery(query, dateMath.parse(startTime, false).valueOf(), end)
        .then((response) => {
          if (_.isEmpty(response.data)) {
            throw Error;
          }
          return response.data;
        });
    });
  }

  getHostStatus(query, startTime, endTime) {
    return this.getStatus(query, startTime, endTime).then((response) => {
      var service = _.getMetricName(query[0].metric);
      var status = null;
      var host = null;
      _.each(response, function (metricData) {
        host = metricData.tags.host;
        if (_.isObject(metricData)) {
          status = metricData.dps[Object.keys(metricData.dps)[0]];
          if (typeof(status) !== "number") {
            throw Error;
          }
        }
      });
      return {name: service, status: status, host: host};
    });
  }

  getHostResource(query, startTime, endTime) {
    return this.getStatus(query, startTime, endTime).then((response) => {
      var service = _.getMetricName(query[0].metric);
      var value = null;
      var host = null;
      var time = null;
      var result = [];
      _.each(response, function (metricData) {
        host = metricData.tags.host;
        if (_.isObject(metricData)) {
          time = _.last(Object.keys(metricData.dps));
          value = metricData.dps[time];
          // if (typeof(value) !== "number") { throw Error; }
        }
        result.push({ name: service, value: value, host: host, time: time, tags: metricData.tags });
      });
      return result;
    });
  }
}

coreModule.service('datasourceSrv', DatasourceSrv);
