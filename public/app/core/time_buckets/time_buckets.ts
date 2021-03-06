import _ from 'lodash';
import moment from 'moment';
import { TimeBucketsCalcAutoIntervalProvider, TimeBucketsCalcIntervalProvider, parseInterval } from 'app/core/time_buckets/calc_interval';
import * as dateMath from 'app/core/utils/datemath';

const calcAutoInterval = TimeBucketsCalcAutoIntervalProvider();
const calcInterval = TimeBucketsCalcIntervalProvider();
const config = {
  'dateFormat:scaled': {
    type: 'json',
    value:
    [
      ["", "HH:mm:ss.SSS"],
      ["PT1S", "HH:mm:ss"],
      ["PT1M", "HH:mm"],
      ["PT1H", "YYYY-MM-DD HH:mm"],
      ["P1DT", "YYYY-MM-DD"],
      ["P1YT", "YYYY"]
    ],
  },
  'dateFormat': {
    value: 'MMMM Do YYYY, HH:mm:ss.SSS',
    description: 'When displaying a pretty formatted date, use this <a href="http://momentjs.com/docs/#/displaying/format/" target="_blank" rel="noopener noreferrer">format</a>',
  },
  'histogram:barTarget': {
    value: 25, // 50,
    description: 'Attempt to generate around this many bars when using "auto" interval in date histograms',
  },
  'histogram:maxBars': {
    value: 50, // 100,
    description: 'Never show more than this many bars in date histograms, scale values if needed',
  },
};

export class TimeBuckets {
  _lb: any;
  _ub: any;
  _i: any;
  __cached__: any;

  constructor() {
    let cache = {};
    const sameMoment = same(moment.isMoment);
    const sameDuration = same(moment.isDuration);

    const desc = {
      __cached__: {
        value: this
      },
    };

    const breakers = {
      setBounds: 'bounds',
      clearBounds: 'bounds',
      setInterval: 'interval'
    };

    const resources = {
      bounds: {
        setup: function () {
          return [this._lb, this._ub];
        },
        changes: function (prev) {
          return !sameMoment(prev[0], this._lb) || !sameMoment(prev[1], this._ub);
        }
      },
      interval: {
        setup: function () {
          return this._i;
        },
        changes: function (prev) {
          return !sameDuration(prev, this._i);
        }
      }
    };

    function cachedGetter(prop) {
      return {
        value: function cachedGetter() {
          if (cache.hasOwnProperty(prop)) {
            return cache[prop];
          }

          return cache[prop] = this[prop]();
        }
      };
    }

    function cacheBreaker(prop) {
      const resource = resources[breakers[prop]];
      const setup = resource.setup;
      const changes = resource.changes;
      const fn = this[prop];
      const self = this;

      return {
        value: function cacheBreaker() {
          const prev = setup.call(self);
          const ret = fn.apply(self, arguments);

          if (changes.call(self, prev)) {
            cache = {};
          }

          return ret;
        }
      };
    }

    function same(checkType) {
      return function (a, b) {
        if (a === b) {return true;}
        if (checkType(a) === checkType(b)) {return +a === +b;}
        return false;
      };
    }


    _.forOwn(TimeBuckets.prototype, function (fn, prop) {
      if (prop[0] === '_') {return;}

      if (breakers.hasOwnProperty(prop)) {
        desc[prop] = cacheBreaker(prop);
      } else {
        desc[prop] = cachedGetter(prop);
      }
    });
  }

  /****
   *  PUBLIC API
   ****/

  /**
   * Set the bounds that these buckets are expected to cover.
   * This is required to support interval "auto" as well
   * as interval scaling.
   *
   * @param {object} input - an object with properties min and max,
   *                       representing the edges for the time span
   *                       we should cover
   *
   * @returns {undefined}
   */
  setBounds(input?) {
    if (!input) { return this.clearBounds(); }

    let bounds;
    if (_.isPlainObject(input)) {
      bounds = [input.from, input.to];
    } else {
      bounds = Array.isArray(input) ? input : [];
    }

    const moments = _(bounds);

    const valid = moments.size() === 2 && moments.every(dateMath.isValid);
    if (!valid) {
      this.clearBounds();
      throw new Error('invalid bounds set: ' + input);
    }

    this._lb = moments.shift();
    this._ub = moments.pop();
  };

  /**
   * Clear the stored bounds
   *
   * @return {undefined}
   */
  clearBounds() {
    this._lb = this._ub = null;
  };

  /**
   * Check to see if we have received bounds yet
   *
   * @return {Boolean}
   */
  hasBounds() {
    return dateMath.isValid(this._ub) && dateMath.isValid(this._lb);
  };

  /**
   * Return the current bounds, if we have any.
   *
   * THIS DOES NOT CLONE THE BOUNDS, so editing them
   * may have unexpected side-effects. Always
   * call bounds.min.clone() before editing
   *
   * @return {object|undefined} - If bounds are not defined, this
   *                      returns undefined, else it returns the bounds
   *                      for these buckets. This object has two props,
   *                      min and max. Each property will be a moment()
   *                      object
   *
   */
  getBounds() {
    if (!this.hasBounds()) { return; }
    return {
      min: this._lb,
      max: this._ub
    };
  };

  /**
   * Get a moment duration object representing
   * the distance between the bounds, if the bounds
   * are set.
   *
   * @return {moment.duration|undefined}
   */
  getDuration() {
    if (!this.hasBounds()) { return; }
    return moment.duration(this._ub - this._lb, 'ms');
  };

  /**
   * Update the interval at which buckets should be
   * generated.
   *
   * Input can be one of the following:
   *  - Any object from src/ui/agg_types/buckets/_interval_options.js
   *  - "auto"
   *  - Pass a valid moment unit
   *  - a moment.duration object.
   *
   * @param {object|string|moment.duration} input - see desc
   */
  setInterval(input) {
    let interval = input;

    // selection object -> val
    if (_.isObject(input)) {
      interval = input.val;
    }

    if (!interval || interval === 'auto') {
      this._i = 'auto';
      return;
    }

    if (_.isString(interval)) {
      input = interval;
      interval = parseInterval(interval);
      if (+interval === 0) {
        interval = null;
      }
    }

    // if the value wasn't converted to a duration, and isn't
    // already a duration, we have a problem
    if (!moment.isDuration(interval)) {
      throw new TypeError('"' + input + '" is not a valid interval.');
    }

    this._i = interval;
  };

  /**
   * Get the interval for the buckets. If the
   * number of buckets created by the interval set
   * is larger than config:histogram:maxBars then the
   * interval will be scaled up. If the number of buckets
   * created is less than one, the interval is scaled back.
   *
   * The interval object returned is a moment.duration
   * object that has been decorated with the following
   * properties.
   *
   * interval.description: a text description of the interval.
   *   designed to be used list "field per {{ desc }}".
   *     - "minute"
   *     - "10 days"
   *     - "3 years"
   *
   * interval.expr: the elasticsearch expression that creates this
   *   interval. If the interval does not properly form an elasticsearch
   *   expression it will be forced into one.
   *
   * interval.scaled: the interval was adjusted to
   *   accomidate the maxBars setting.
   *
   * interval.scale: the numer that y-values should be
   *   multiplied by
   *
   * interval.scaleDescription: a description that reflects
   *   the values which will be produced by using the
   *   interval.scale.
   *
   *
   * @return {[type]} [description]
   */
  getInterval() {
    const duration = this.getDuration();
    const interval = this._i;
    const self = this;

    return decorateInterval(maybeScaleInterval(readInterval(interval)));

    // either pull the interval from state or calculate the auto-interval
    function readInterval(interval) {
      if (moment.isDuration(interval)) { return interval; }
      return calcAutoInterval.near(config['histogram:barTarget'].value, duration);
    }

    // check to see if the interval should be scaled, and scale it if so
    function maybeScaleInterval(interval) {
      if (!self.hasBounds()) { return interval; }

      const maxLength = config['histogram:maxBars'].value;
      const approxLen = duration / interval;
      let scaled;

      if (approxLen > maxLength) {
        scaled = calcAutoInterval.lessThan(maxLength, duration);
      } else {
        return interval;
      }

      if (+scaled === +interval) { return interval; }

      decorateInterval(interval);
      return _.assign(scaled, {
        preScaled: interval,
        scale: interval / scaled,
        scaled: true
      });
    }

    // append some TimeBuckets specific props to the interval
    function decorateInterval(interval) {
      const esInterval = calcInterval(interval);
      interval.esValue = esInterval.value;
      interval.esUnit = esInterval.unit;
      interval.expression = esInterval.expression;
      interval.overflow = duration > interval ? moment.duration(interval - duration) : false;

      const prettyUnits = moment.normalizeUnits(esInterval.unit);
      if (esInterval.value === 1) {
        interval.description = prettyUnits;
      } else {
        interval.description = esInterval.value + ' ' + prettyUnits + 's';
      }

      return interval;
    }
  };

  /**
   * Get a date format string that will represent dates that
   * progress at our interval.
   *
   * Since our interval can be as small as 1ms, the default
   * date format is usually way too much. with `dateFormat:scaled`
   * users can modify how dates are formatted within series
   * produced by TimeBuckets
   *
   * @return {string}
   */
  getScaledDateFormat() {
    const interval = this.getInterval();
    const rules = config['dateFormat:scaled'].value;

    for (let i = rules.length - 1; i >= 0; i--) {
      const rule = rules[i];
      if (!rule[0] || interval >= moment.duration(rule[0])) {
        return rule[1];
      }
    }

    return config['dateFormat'].value;
  };
}
