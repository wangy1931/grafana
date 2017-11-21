///<reference path="../../headers/common.d.ts" />

import _ from 'lodash';
import moment from 'moment';
import * as dateMath from './datemath';

var spans = {
  's': {display: '秒'},
  'm': {display: '分钟'},
  'h': {display: '小时'},
  'd': {display: '天'},
  'w': {display: '周'},
  'M': {display: '个月'},
  'y': {display: '年'},
};

var rangeOptions = [
  // { from: 'now/d',    to: 'now/d',    display: '今天',                 section: 2 },
  // { from: 'now/d',    to: 'now',      display: '截至今天',        section: 2 },
  // { from: 'now/w',    to: 'now/w',    display: '今周',                   section: 2 },
  // { from: 'now/w',    to: 'now',      display: '到今周',          section: 2 },
  // { from: 'now/M',    to: 'now/M',    display: '今月',            section: 2 },
  // { from: 'now/y',    to: 'now/y',    display: '今年',             section: 2 },

  // { from: 'now-1d/d', to: 'now-1d/d', display: '昨天',             section: 1 },
  // { from: 'now-2d/d', to: 'now-2d/d', display: '截至昨天',  section: 1 },
  // { from: 'now-7d/d', to: 'now-7d/d', display: '上一周的今天',    section: 1 },
  // { from: 'now/w', to: 'now+1w/w', display: '未来一周',         section: 1 },
  // { from: 'now/M', to: 'now+1M/M', display: '未来一月',        section: 1 },
  // { from: 'now/y', to: 'now+1y/y', display: '未来一年',         section: 1 },

  // { from: 'now-5m',   to: 'now',      display: '5  分钟之前',        section: 3 },
  // { from: 'now-15m',  to: 'now',      display: '15 分钟之前',       section: 3 },
  // { from: 'now-30m',  to: 'now',      display: '30 分钟之前',       section: 3 },
  // { from: 'now-1h',   to: 'now',      display: '1  小时之前',           section: 3 },
  // { from: 'now-6h',   to: 'now',      display: '6  小时之前',          section: 3 },
  // { from: 'now-12h',  to: 'now',      display: '12 小时之前',         section: 3 },
  // { from: 'now-24h',  to: 'now',      display: '24 小时之前',         section: 3 },
  // { from: 'now-7d',   to: 'now',      display: '7  天之前',           section: 3 },

  // { from: 'now-30d',  to: 'now',      display: '30 天之前',          section: 0 },
  // { from: 'now-60d',  to: 'now',      display: '60 天之前',          section: 0 },
  // { from: 'now-90d',  to: 'now',      display: '90 天之前',          section: 0 },
  // { from: 'now-6M',   to: 'now',      display: '6  个月之前',         section: 0 },
  // { from: 'now-1y',   to: 'now',      display: '1  年之前',           section: 0 },
  // { from: 'now-2y',   to: 'now',      display: '2  年之前',          section: 0 },
  // { from: 'now-5y',   to: 'now',      display: '5  年之前',          section: 0 },
  { from: 'now/d',    to: 'now/d',    display: 'Today',                 section: 2 },
  { from: 'now/d',    to: 'now',      display: 'Today so far',          section: 2 },
  { from: 'now/w',    to: 'now/w',    display: 'This week',             section: 2 },
  { from: 'now/w',    to: 'now',      display: 'This week so far',      section: 2 },
  { from: 'now/M',    to: 'now/M',    display: 'This month',            section: 2 },
  { from: 'now/M',    to: 'now',      display: 'This month so far',     section: 2 },
  { from: 'now/y',    to: 'now/y',    display: 'This year',             section: 2 },
  { from: 'now/y',    to: 'now',      display: 'This year so far',      section: 2 },

  { from: 'now-1d/d', to: 'now-1d/d', display: 'Yesterday',             section: 1 },
  { from: 'now-2d/d', to: 'now-2d/d', display: 'Day before yesterday',  section: 1 },
  { from: 'now-7d/d', to: 'now-7d/d', display: 'This day last week',    section: 1 },
  { from: 'now-1w/w', to: 'now-1w/w', display: 'Previous week',         section: 1 },
  { from: 'now-1M/M', to: 'now-1M/M', display: 'Previous month',        section: 1 },
  { from: 'now-1y/y', to: 'now-1y/y', display: 'Previous year',         section: 1 },

  { from: 'now-5m',   to: 'now',      display: 'Last 5 minutes',        section: 3 },
  { from: 'now-15m',  to: 'now',      display: 'Last 15 minutes',       section: 3 },
  { from: 'now-30m',  to: 'now',      display: 'Last 30 minutes',       section: 3 },
  { from: 'now-1h',   to: 'now',      display: 'Last 1 hour',           section: 3 },
  { from: 'now-3h',   to: 'now',      display: 'Last 3 hours',          section: 3 },
  { from: 'now-6h',   to: 'now',      display: 'Last 6 hours',          section: 3 },
  { from: 'now-12h',  to: 'now',      display: 'Last 12 hours',         section: 3 },
  { from: 'now-24h',  to: 'now',      display: 'Last 24 hours',         section: 3 },

  { from: 'now-2d',   to: 'now',      display: 'Last 2 days',           section: 0 },
  { from: 'now-7d',   to: 'now',      display: 'Last 7 days',           section: 0 },
  { from: 'now-30d',  to: 'now',      display: 'Last 30 days',          section: 0 },
  { from: 'now-90d',  to: 'now',      display: 'Last 90 days',          section: 0 },
  { from: 'now-6M',   to: 'now',      display: 'Last 6 months',         section: 0 },
  { from: 'now-1y',   to: 'now',      display: 'Last 1 year',           section: 0 },
  { from: 'now-2y',   to: 'now',      display: 'Last 2 years',          section: 0 },
  { from: 'now-5y',   to: 'now',      display: 'Last 5 years',          section: 0 },
];

var absoluteFormat = 'MMM D, YYYY HH:mm:ss';

var rangeIndex = {};
_.each(rangeOptions, function (frame) {
  rangeIndex[frame.from + ' to ' + frame.to] = frame;
});

export  function getRelativeTimesList(timepickerSettings, currentDisplay) {
  var groups = _.groupBy(rangeOptions, (option: any) => {
    option.active = option.display === currentDisplay;
    return option.section;
  });

  // _.each(timepickerSettings.time_options, (duration: string) => {
  //   let info = describeTextRange(duration);
  //   if (info.section) {
  //     groups[info.section].push(info);
  //   }
  // });

  return groups;
}

function formatDate(date) {
  return date.format(absoluteFormat);
}

// handles expressions like
// 5m
// 5m to now/d
// now/d to now
// now/d
// if no to <expr> then to now is assumed
export function describeTextRange(expr: any) {
  let isLast = (expr.indexOf('+') !== 0);
  if (expr.indexOf('now') === -1) {
    expr = (isLast ? 'now-' : 'now') + expr;
  }

  let opt = rangeIndex[expr + ' to now'];
  if (opt) {
    return opt;
  }

  if (isLast) {
    opt = {from: expr, to: 'now'};
  } else {
    opt = {from: 'now', to: expr};
  }

  let parts = /^now([-+])(\d+)(\w)/.exec(expr);
  if (parts) {
    let unit = parts[3];
    let amount = parseInt(parts[2]);
    let span = spans[unit];
    if (span) {
      // opt.display = amount + ' ' + span.display + '之前';
      opt.display = isLast ? 'Last ' : 'Next ';
      opt.display += amount + ' ' + span.display;
      opt.section = span.section;
    }
  } else {
    opt.display = opt.from + ' 至 ' + opt.to;
    opt.invalid = true;
  }

  return opt;
}

export function describeTimeRange(range) {
  var option = rangeIndex[range.from.toString() + ' to ' + range.to.toString()];
  if (option) {
    return option.display;
  }

  if (moment.isMoment(range.from) && moment.isMoment(range.to)) {
    return formatDate(range.from) + ' 至 ' + formatDate(range.to);
  }

  if (moment.isMoment(range.from)) {
    var toMoment = dateMath.parse(range.to, true);
    return formatDate(range.from) + ' 至 ' + toMoment.fromNow();
  }

  if (moment.isMoment(range.to)) {
    var from = dateMath.parse(range.from, false);
    return from.fromNow() + ' 至 ' + formatDate(range.to);
  }

  if (range.to.toString() === 'now') {
    var res = describeTextRange(range.from);
    return res.display;
  }

  return range.from.toString() + ' 至 ' + range.to.toString();
}
