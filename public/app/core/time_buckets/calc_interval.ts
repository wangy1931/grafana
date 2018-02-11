import _ from 'lodash';
import moment from 'moment';

const d = moment.duration;

const units = ['y', 'M', 'w', 'd', 'h', 'm', 's', 'ms'];
const unitsAsc = units.sort((prev: any, val: any) => prev - Number(moment.duration(1, val).valueOf()));
const unitsDesc = unitsAsc.reverse();

export function TimeBucketsCalcAutoIntervalProvider() {
  // these are the rounding rules used by roundInterval()
  const roundingRules = [
    [ d(500, 'ms'), d(100, 'ms') ],
    [ d(5, 'second'), d(1, 'second') ],
    [ d(7.5, 'second'), d(5, 'second') ],
    [ d(15, 'second'), d(10, 'second') ],
    [ d(45, 'second'), d(30, 'second') ],
    [ d(3, 'minute'), d(1, 'minute') ],
    [ d(9, 'minute'), d(5, 'minute') ],
    [ d(20, 'minute'), d(10, 'minute') ],
    [ d(45, 'minute'), d(30, 'minute') ],
    [ d(2, 'hour'), d(1, 'hour') ],
    [ d(6, 'hour'), d(3, 'hour') ],
    [ d(24, 'hour'), d(12, 'hour') ],
    [ d(1, 'week'), d(1, 'd') ],
    [ d(3, 'week'), d(1, 'week') ],
    [ d(1, 'year'), d(1, 'month') ],
    [ Infinity, d(1, 'year') ]
  ];

  const revRoundingRules = roundingRules.slice(0).reverse();

  function find(rules, check, last?) {
    function pick(buckets, duration) {
      const target = duration / buckets;
      let lastResp;

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const resp = check(rule[0], rule[1], target);

        if (resp == null) {
          if (!last) { continue; }
          if (lastResp) { return lastResp; }
          break;
        }

        if (!last) { return resp; }
        lastResp = resp;
      }

      // fallback to just a number of milliseconds, ensure ms is >= 1
      const ms = Math.max(Math.floor(target), 1);
      return moment.duration(ms, 'ms');
    }

    return function (buckets, duration) {
      const interval = pick(buckets, duration);
      if (interval) { return moment.duration(interval._data); }
      return null;
    };
  }

  return {
    near: find(revRoundingRules, function near(bound, interval, target) {
      if (bound > target) { return interval; }
    }, true),

    lessThan: find(revRoundingRules, function (bound, interval, target) {
      if (interval < target) { return interval; }
    }),

    atLeast: find(revRoundingRules, function atLeast(bound, interval, target) {
      if (interval <= target) { return interval; }
    }),
  };
}

export function TimeBucketsCalcIntervalProvider() {
  const unitsDesc = unitsAsc.reverse();
  const largeMax = unitsDesc.indexOf('M');

  /**
   * Convert a moment.duration into an es
   * compatible expression, and provide
   * associated metadata
   *
   * @param  {moment.duration} duration
   * @return {object}
   */
  function esDuration(duration) {
    for (let i = 0; i < unitsDesc.length; i++) {
      const unit = unitsDesc[i];
      const val = duration.as(unit);
      // find a unit that rounds neatly
      if (val >= 1 && Math.floor(val) === val) {

        // if the unit is "large", like years, but
        // isn't set to 1 ES will puke. So keep going until
        // we get out of the "large" units
        if (i <= largeMax && val !== 1) {
          continue;
        }

        return {
          value: val,
          unit: unit,
          expression: val + unit
        };
      }
    }

    const ms = duration.as('ms');
    return {
      value: ms,
      unit: 'ms',
      expression: ms + 'ms'
    };
  }

  return esDuration;
}

export function parseInterval(interval) {
  // Assume interval is in the form (value)(unit), such as "1h"
  const INTERVAL_STRING_RE = new RegExp('^([0-9\\.]*)\\s*(' + units.join('|') + ')$');

  const matches = String(interval).trim().match(INTERVAL_STRING_RE);

  if (!matches) { return null; }

  try {
    const value = parseFloat(matches[1]) || 1;
    const unit: any = matches[2];

    const duration = moment.duration(value, unit);

    // There is an error with moment, where if you have a fractional interval between 0 and 1, then when you add that
    // interval to an existing moment object, it will remain unchanged, which causes problems in the ordered_x_keys
    // code. To counteract this, we find the first unit that doesn't result in a value between 0 and 1.
    // For example, if you have '0.5d', then when calculating the x-axis series, we take the start date and begin
    // adding 0.5 days until we hit the end date. However, since there is a bug in moment, when you add 0.5 days to
    // the start date, you get the same exact date (instead of being ahead by 12 hours). So instead of returning
    // a duration corresponding to 0.5 hours, we return a duration corresponding to 12 hours.
    const selectedUnit = _.find(units, function (unit) {
      return Math.abs(duration.as(unit)) >= 1;
    });

    return moment.duration(duration.as(selectedUnit), selectedUnit);
  } catch (e) {
    return null;
  }
}
