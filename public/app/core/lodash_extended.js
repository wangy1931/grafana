define([
  'jquery',
  'moment',
  'app/core/utils/kbn',
  'lodash'
],
function ($, moment, kbn, _) {
  'use strict';

  kbn = kbn.default;

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
      return 'i18n_empty';
    }
    if (score > 75) {
      return "i18n_good";
    } else if (score > 50) {
      return "i18n_normal_level";
    } else if (score > 25) {
      return "i18n_unhealth";
    } else {
      return "i18n_bad";
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
      "yarn": "iconfont fa-yarn",
      "zookeeper": "iconfont fa-zookeeper",
      "tomcat": "iconfont fa-tomcat",
      "opentsdb": "iconfont fa-opentsdb",
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
            obj[i] = ' - ';
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

  _.timeFrom = function (mSecond, duration, type) {
    return moment(mSecond).add(duration, type).format("YYYY-MM-DD HH:mm");
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
      "CRITICAL": "i18n_critical",
      "WARNING" : "i18n_warning",
      "NORMAL"  : "i18n_normal"
    };
    return value && map[value];
  };

  _.alertTypeFormatter = function (value) {
    const map = {
      "MUTI_ALERT": "多指标报警",
      "SINGLE_ALERT": "单指标报警",
      "LOG_ALERT": "日志报警"
    }
    return value && map[value]
  }

  _.statusFormatter = function (value) {
    if (_.isNumber(value)) {
      return value === 0 ? 'i18n_normal' : 'i18n_unnormal';
    }
    if (_.isString(value)) {
      return value === 'GREEN' ? 'i18n_normal' : (value === 'YELLOW' ? 'i18n_warning' : (value === 'RED' ? 'i18n_critical' : 'i18n_unnormal'));
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
    return /(163|126|qq|outlook|gmail|yahoo|sina|souhu|hotmail|Foxmail).com(.cn)?$/i.test(email)
  }

  _.guideMap = function() {
    return {
      '_': 'ui_summary',
      '_alerts': 'alert_and_association/alert_and_association',
      '_alerts_new': 'alert_and_association/alert_and_association',
      '_alerts_status': 'alert_and_association/alert_and_association',
      '_anomaly': 'alert_and_association/annomaly',
      '_anomaly_0': 'alert_and_association/annomaly',
      '_anomaly_history': 'alert_and_association/annomaly',
      '_association': 'zhi-neng-fen-xi/gu-zhang-su-yuan',
      '_cmdb_config': 'collector',
      '_cmdb_config_edit': 'collector',
      '_cmdb_config_metrics': 'ui_summary',
      '_cmdb_metrics': 'collector',
      '_cmdb_servicecustom': 'ui_summary',
      '_dashboardlist': 'ui_dashboard',
      '_dashboard_db_cloudwiz-backend': 'ui_dashboard/graph',
      '_host_topology': 'ui_summary',
      '_logs': 'zhi-neng-fen-xi/ri-zhi-cha-kan',
      '_logs_rules': 'ui_summary',
      '_logs_rules_new': 'ui_summary',
      '_oncallerschedule': 'oncaller',
      '_oncallers': 'oncaller',
      '_org': 'guan-li-gong-neng',
      '_org_new': 'ui_summary',
      '_org_users': 'ui_summary',
      '_profile': 'ui_summary',
      '_rca': 'zhi-neng-fen-xi/gu-zhang-su-yuan',
      '_report': 'zhi-neng-fen-xi/jian-kang-bao-gao',
      '_report_template': 'zhi-neng-fen-xi/jian-kang-bao-gao',
      '_service_topology': 'ui_summary',
      '_service_dependency': 'ui_summary',
      '_topn': 'ui_summary'
    }
  }

  _.getAlertType = function(type) {
    var map = {
      'ZABBIX_ALERT': 'iconfont fa-zabbix',
      'ONEAPM_ALERT': 'iconfont fa-oneapm',
      'BMC_ALERT': 'iconfont fa-bmc',
      'LOG_ALERT': 'fa fa-clipboard',
      'SINGLE_ALERT': 'fa fa-dashboard',
      'MUTI_ALERT': 'fa fa-dashboard',
    }
    return map[type] || 'fa fa-dashboard';
  }

  _.getOsDashboard = function(os) {
    if (/windows/i.test(os)) return 'windows_machine_host_topology';
    if (/zabbix/i.test(os)) return 'zabbix_host_topology';
    return 'machine_host_topology';
  }

  _.getServiceDashboard = function(service) {
    if (/hadoop/i.test(service)) return 'hadoop';
    if (/hbase/i.test(service)) return 'hbase';
    return service;
  }

  return _;
});