define([
  'jquery',
  'moment',
  'app/core/utils/kbn',
  'lodash-src'
],
function ($, moment, kbn) {
  'use strict';

  kbn = kbn.default;

  var _ = window._;

  _.findWhere = _.find;
  _.contains = _.includes;
  _.where = _.filter;
  _.pairs = _.toPairs;
  _.pluck = _.map;

  // kbn
  _.valueFormats = kbn.valueFormats;

  /*
    Mixins :)
  */
  _.mixin({
    move: function (array, fromIndex, toIndex) {
      array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
      return array;
    },
    // If variable is value, then return alt. If variable is anything else, return value;
    toggle: function (variable, value, alt) {
      return variable === value ? alt : value;
    },
    toggleInOut: function(array,value) {
      if(_.contains(array,value)) {
        array = _.without(array,value);
      } else {
        array.push(value);
      }
      return array;
    }
  });

  /*
   A metric is in the format of <orgId>.<sysId>.<metric short name>.
   Note that a metric short name may also have '.' in it.
  */
  _.getMetricName = function (metricName) {
    if (!metricName) { return ''; }

    var elem = metricName.split(".");
    if(elem.length < 3){
      return metricName;
    }
    return metricName.substring(metricName.indexOf(elem[2]));
  };

  _.excludeMetricSuffix = function (metricName) {
    return !(/(anomaly|prediction.max|prediction.min|.LB.percent|.seasonal|.trend|.noise|.prediction|.health|.system.health|.LB|.periodMinutes)$/.test(metricName));
  };

  _.allServies = function () {
    return {
      "hadoop.datanode": "Hadoop DataNode",
      "hadoop.namenode": "Hadoop NameNode",
      "hbase.master": "Hbase Master",
      "hbase.regionserver": "Hbase RegionServer",
      "kafka": "Kafka",
      "mysql": "Mysql",
      "spark": "Spark",
      "storm": "Storm",
      "yarn": "Yarn",
      "zookeeper": "Zookeeper",
      "tomcat": "Tomcat",
      "opentsdb": "OpenTSDB",
      "mongo3": "MongoDB 3.x",
      "nginx": "Nginx",
      "postgresql": "Postgresql",
      "redis": "Redis",
      "rabbitmq": "RabbitMQ",
      "iis": "IIS",
      "oracle": "Oracle",
      "weblogic": "WebLogic",
      "apache": "Apache",
      "ssdb": "SSDB",
      "play": "Play Framework",
      "elasticsearch": "ElasticSearch"
    };
  };

  _.getLeveal = function (score) {
    if (!_.isNumber(score) && _.isNaN(score) && _.isEmpty(score)) {
      return "无";
    }
    if (score > 75) {
      return "优";
    } else if (score > 50) {
      return "良";
    } else if (score > 25) {
      return "中";
    } else {
      return "差";
    }
  };

  _.serviceIconMap = function () {
    return {
      "hadoop.datanode": "iconfont fa-hadoop29",
      "hadoop.namenode": "iconfont fa-icon",
      "hbase.master": "iconfont fa-hbase",
      "hbase.regionserver": "iconfont fa-hbase",
      "kafka": "iconfont fa-kafka",
      "mysql": "iconfont fa-mysql",
      "spark": "iconfont fa-spark1",
      "storm": "iconfont fa-ApacheStorm",
      "yarn": "iconfont fa-zanwutu",
      "zookeeper": "iconfont fa-zookeeper",
      "tomcat": "iconfont fa-tomcat",
      "opentsdb": "iconfont fa-zanwutu",
      "mongo3": "iconfont fa-mongo-db1",
      "nginx": "iconfont fa-image-icon_nginx",
      "postgresql": "iconfont fa-postgresql",
      "redis": "iconfont fa-redis",
      "rabbitmq": "iconfont fa-rabbitmq",
      "weblogic": "iconfont fa-weblogic",
      "apache": "iconfont fa-Apacheyumao"
    };
  }

  _.cmdbInitObj = function(obj) {
    if(_.isObject(obj)) {
      for(var i in obj) {
        if(!_.isNumber(obj[i]) && (_.isNull(obj[i]) || _.isEmpty(obj[i]))){
          if(/^(memory|hosts|interfaces|devices|services)$/.test(i)) {
            obj[i] = null;
          } else {
            obj[i] = '暂无信息';
          }
        };
        if(_.isObject(obj[i])) {
          obj[i] = _.cmdbInitObj(obj[i]);
        }
      }
    }
    return obj;
  };

  _.transformTime = function (value) {
    return moment.unix(value).format("YYYY-MM-DD HH:mm:ss");
  };

  _.transformMillionTime = function (value) {
    return moment(value).format("YYYY-MM-DD HH:mm:ss");
  };

  _.percentFormatter = function (value) {
    return value && (value.toFixed(2) + '%');
  };

  _.gbFormatter = function (value) {
    return value && ((value / Math.pow(1024, 3)).toFixed(2) + 'GB');
  };

  // Translate
  _.translateAlertLevel = function (value) {
    var map = {
      "CRITICAL": "严重",
      "WARNING" : "警告",
      "NORMAL"  : "正常"
    };
    return value && map[value];
  };

  _.statusFormatter = function (value) {
    if (_.isNumber(value)) {
      return value === 0 ? '正常' : '异常';
    }
    if (_.isString(value)) {
      return value === 'GREEN' ? '正常' : (value === 'YELLOW' ? '警告' : (value === 'RED' ? '严重' : '异常'));
    }
  };

  // Metric
  _.metricPrefix2Type = function (prefix) {
    if (_.isNull(prefix)) {
      return "*";
    }
    if (/(iostat|cpu|df|net|proc)/.test(prefix)) {
      return "system";
    } else if (/(ssh_failed)/.test(prefix)) {
      return "security";
    }
    return prefix;
  };

  _.metricHelpMessage = {};
  _.metricMessage = {};

  _.excludeEmail = function(email) {
    return /(163|126|qq|outlook|gmail|yahoo|sina|souhu|hotmail).com(.cn)?$/.test(email)
  }

  return _;
});
