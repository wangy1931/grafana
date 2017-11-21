define([
  'angular',
  'lodash',
  '../core_module',
  'app/core/config',
  'app/core/utils/datemath',
],
function (angular, _, coreModule, config, dateMath) {
  'use strict';

  coreModule.default.service('datasourceSrv', function($q, $injector, $rootScope, templateSrv) {
    var self = this;

    this.init = function() {
      this.datasources = {};
    };

    this.get = function(name) {
      if (!name) {
        return this.get(config.defaultDatasource);
      }

      name = templateSrv.replace(name);

      if (name === 'default') {
        return this.get(config.defaultDatasource);
      }

      if (this.datasources[name]) {
        return $q.when(this.datasources[name]);
      }

      return this.loadDatasource(name);
    };

    this.loadDatasource = function(name) {
      var dsConfig = config.datasources[name];
      if (!dsConfig) {
        return $q.reject({message: "Datasource named " + name + " was not found"});
      }

      var deferred = $q.defer();
      var pluginDef = dsConfig.meta;

      System.import(pluginDef.module).then(function(plugin) {
        // check if its in cache now
        if (self.datasources[name]) {
          deferred.resolve(self.datasources[name]);
          return;
        }

        // plugin module needs to export a constructor function named Datasource
        if (!plugin.Datasource) {
          throw "Plugin module is missing Datasource constructor";
        }

        var instance = $injector.instantiate(plugin.Datasource, {instanceSettings: dsConfig});
        instance.meta = pluginDef;
        instance.name = name;
        self.datasources[name] = instance;
        deferred.resolve(instance);
      }).catch(function(err) {
        $rootScope.appEvent('alert-error', [dsConfig.name + ' plugin failed', err.toString()]);
      });

      return deferred.promise;
    };

    this.getAll = function() {
      return config.datasources;
    };

    this.getAnnotationSources = function() {
      var sources = [];

      this.addDataSourceVariables(sources);

      _.each(config.datasources, function(value) {
        if (value.meta && value.meta.annotations) {
          sources.push(value);
        }
      });

      return sources;
    };

    this.getMetricSources = function(options) {
      var metricSources = [];

      _.each(config.datasources, function(value, key) {
        if (value.meta && value.meta.metrics) {
          metricSources.push({value: key, name: key, meta: value.meta});

          if (key === config.defaultDatasource) {
            metricSources.push({value: null, name: 'default', meta: value.meta});
          }
        }
      });

      if (!options || !options.skipVariables) {
        this.addDataSourceVariables(metricSources);
      }

      metricSources.sort(function(a, b) {
        // these two should always be at the bottom
        if (a.meta.id === "mixed" || a.meta.id === "grafana") {
          return 1;
        }
        if (b.meta.id === "mixed" || b.meta.id === "grafana") {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        return 0;
      });

      return metricSources;
    };

    this.getStatus = function(query, startTime, endTime) {
      var end = endTime ? dateMath.parse(endTime, false).valueOf() : null;
      return this.get('opentsdb').then(function(datasource) {
        return datasource.performTimeSeriesQuery(query, dateMath.parse(startTime, false).valueOf(), end).then(function(response) {
          if (_.isEmpty(response.data)) {
            throw Error;
          }
          return response.data;
        });
      });
    };

    this.getHostStatus = function(query, startTime, endTime) {
      return this.getStatus(query, startTime, endTime).then(function (response) {
        var service = _.getMetricName(query[0].metric);
        var status = null;
        var host = null;
        _.each(response, function (metricData) {
          host = metricData.tags.host;
          if (_.isObject(metricData)) {
            status = metricData.dps[Object.keys(metricData.dps)[0]];
            if(typeof(status) !== "number") {
              throw Error;
            }
          }
        });
        return {name: service, status: status, host: host};
      });
    };

    this.getHostResource = function (query, startTime, endTime) {
      return this.getStatus(query, startTime, endTime).then(function (response) {
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
    };

    this.addDataSourceVariables = function(list) {
      // look for data source variables
      for (var i = 0; i < templateSrv.variables.length; i++) {
        var variable = templateSrv.variables[i];
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
    };

    this.init();
  });
});
