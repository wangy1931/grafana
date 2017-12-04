///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import angular from 'angular';
import moment from 'moment';
import * as dateMath from 'app/core/utils/datemath';
import coreModule from '../core_module';

coreModule.filter('stringSort', function() {
  return function(input) {
    return input.sort();
  };
});

coreModule.filter('slice', function() {
  return function(arr, start, end) {
    if (!_.isUndefined(arr)) {
      return arr.slice(start, end);
    }
  };
});

coreModule.filter('stringify', function() {
  return function(arr) {
    if (_.isObject(arr) && !_.isArray(arr)) {
      return angular.toJson(arr);
    } else {
      return _.isNull(arr) ? null : arr.toString();
    }
  };
});

coreModule.filter('moment', function() {
  return function(date, mode) {
    switch (mode) {
      case 'ago':
        return moment(date).fromNow();
    }
    return moment(date).fromNow();
  };
});

coreModule.filter('noXml', function() {
  var noXml = function(text) {
  return _.isString(text)
    ? text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    : text;
  };
  return function(text) {
    return _.isArray(text)
      ? _.map(text, noXml)
      : noXml(text);
  };
});

coreModule.filter('interpolateTemplateVars', function (templateSrv) {
  var filterFunc: any = function(text, scope) {
    var scopedVars;
    if (scope.ctrl && scope.ctrl.panel) {
      scopedVars = scope.ctrl.panel.scopedVars;
    } else {
      scopedVars = scope.row.scopedVars;
    }

    return templateSrv.replaceWithText(text, scopedVars);
  };

  filterFunc.$stateful = true;
  return filterFunc;
});

coreModule.filter('formatItemType', () => {
  return (text) => {
    return text && text.replace('Host', '').replace('Service', '');
  };
});

coreModule.filter('translateItemType', () => {
  return (text) => {
    var map = {
      "mem": "内存",
      "io" : "磁盘",
      "nw" : "网络",
      "cpu": "CPU",
      "kpi": "服务 KPI",
      "state": "服务状态"
    };
    return text && map[text.toLowerCase()];
  };
});

coreModule.filter('formatAnomalyHealth', () => {
  return (value) => {
    return value === 100 ? value : (value < 26 ? value + " (持续异常)" : value + " (临时异常)")
  };
});

coreModule.filter('formatTimeRange', () => {
  return function (text) {
    if (!text) { return; }

    var from = text.from, to = text.to;
    var args = Array.prototype.slice.call(arguments), time = args[0], relative = args[1], index = args[2];
    moment.isMoment(from) && (from = moment(from));
    moment.isMoment(to) && (to = moment(to));

    from = dateMath.parse(from, false);
    to = dateMath.parse(to, true);

    relative = parseInt(relative);
    !_.isNaN(relative) && (
      from = moment.utc(from).subtract(relative, 'days'),
      to = moment.utc(to).subtract(relative, 'days')
    );

    return moment.utc(index === 0 ? from : to).format("YYYY-MM-DD");
  };
});

coreModule.filter('formatRCAType', () => {
  return (value) => {
    return (value === 1) ? '指标' : ((value === 2) ? '日志' : '其他');
  };
});

coreModule.filter('trustHtml', ($sce) => {
  return (value) => {
    value = _.replace(value, /\n/g, '<br>');
    value = _.replace(value, /&lt;/g, '<');
    value = _.replace(value, /&gt;/g, '>');
    value = _.replace(value, /&gt;/g, '>');
    value = _.replace(value, /&quot;/g, '"');
    var html = $sce.trustAsHtml('<div>' + value + '</div>');
    return html;
  };
});

export default {};
