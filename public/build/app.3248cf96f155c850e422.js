webpackJsonp([2],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
///<reference path="../headers/common.d.ts" />

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_angular___default.a.module('grafana.core', ['ngRoute']));


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(462),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (Settings) {
  "use strict";

  var bootData = window.grafanaBootData || { settings: {} };
  var options = bootData.settings;
  options.bootData = bootData;

  return new Settings(options);

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 52;

/***/ }),
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var kbn = {};
kbn.valueFormats = {};
///// HELPER FUNCTIONS /////
kbn.round_interval = function (interval) {
    switch (true) {
        // 0.3s
        case (interval <= 300):
            return 100; // 0.1s
        // 0.75s
        case (interval <= 750):
            return 500; // 0.5s
        // 1.5s
        case (interval <= 1500):
            return 1000; // 1s
        // 3.5s
        case (interval <= 3500):
            return 2000; // 2s
        // 7.5s
        case (interval <= 7500):
            return 5000; // 5s
        // 12.5s
        case (interval <= 12500):
            return 10000; // 10s
        // 17.5s
        case (interval <= 17500):
            return 15000; // 15s
        // 25s
        case (interval <= 25000):
            return 20000; // 20s
        // 45s
        case (interval <= 45000):
            return 30000; // 30s
        // 1.5m
        case (interval <= 90000):
            return 60000; // 1m
        // 3.5m
        case (interval <= 210000):
            return 120000; // 2m
        // 7.5m
        case (interval <= 450000):
            return 300000; // 5m
        // 12.5m
        case (interval <= 750000):
            return 600000; // 10m
        // 12.5m
        case (interval <= 1050000):
            return 900000; // 15m
        // 25m
        case (interval <= 1500000):
            return 1200000; // 20m
        // 45m
        case (interval <= 2700000):
            return 1800000; // 30m
        // 1.5h
        case (interval <= 5400000):
            return 3600000; // 1h
        // 2.5h
        case (interval <= 9000000):
            return 7200000; // 2h
        // 4.5h
        case (interval <= 16200000):
            return 10800000; // 3h
        // 9h
        case (interval <= 32400000):
            return 21600000; // 6h
        // 24h
        case (interval <= 86400000):
            return 43200000; // 12h
        // 48h
        case (interval <= 172800000):
            return 86400000; // 24h
        // 1w
        case (interval <= 604800000):
            return 86400000; // 24h
        // 3w
        case (interval <= 1814400000):
            return 604800000; // 1w
        // 2y
        case (interval < 3628800000):
            return 2592000000; // 30d
        default:
            return 31536000000; // 1y
    }
};
kbn.secondsToHms = function (seconds) {
    var numyears = Math.floor(seconds / 31536000);
    if (numyears) {
        return numyears + 'y';
    }
    var numdays = Math.floor((seconds % 31536000) / 86400);
    if (numdays) {
        return numdays + 'd';
    }
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    if (numhours) {
        return numhours + 'h';
    }
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    if (numminutes) {
        return numminutes + 'm';
    }
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    if (numseconds) {
        return numseconds + 's';
    }
    var nummilliseconds = Math.floor(seconds * 1000.0);
    if (nummilliseconds) {
        return nummilliseconds + 'ms';
    }
    return 'less then a millisecond'; //'just now' //or other string you like;
};
kbn.to_percent = function (nr, outof) {
    return Math.floor(nr / outof * 10000) / 100 + '%';
};
kbn.addslashes = function (str) {
    str = str.replace(/\\/g, '\\\\');
    str = str.replace(/\'/g, '\\\'');
    str = str.replace(/\"/g, '\\"');
    str = str.replace(/\0/g, '\\0');
    return str;
};
kbn.interval_regex = /(\d+(?:\.\d+)?)([Mwdhmsy])/;
// histogram & trends
kbn.intervals_in_seconds = {
    y: 31536000,
    M: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1
};
kbn.calculateInterval = function (range, resolution, userInterval) {
    var lowLimitMs = 1; // 1 millisecond default low limit
    var intervalMs, lowLimitInterval;
    if (userInterval) {
        if (userInterval[0] === '>') {
            lowLimitInterval = userInterval.slice(1);
            lowLimitMs = kbn.interval_to_ms(lowLimitInterval);
        }
        else {
            return userInterval;
        }
    }
    intervalMs = kbn.round_interval((range.to.valueOf() - range.from.valueOf()) / resolution);
    if (lowLimitMs > intervalMs) {
        intervalMs = lowLimitMs;
    }
    return kbn.secondsToHms(intervalMs / 1000);
};
kbn.describe_interval = function (str) {
    var matches = str.match(kbn.interval_regex);
    if (!matches || !kbn.intervals_in_seconds.hasOwnProperty(matches[2])) {
        // if (!matches || !_.has(kbn.intervals_in_seconds, matches[2])) {
        throw new Error('Invalid interval string, expecting a number followed by one of "Mwdhmsy"');
    }
    else {
        return {
            sec: kbn.intervals_in_seconds[matches[2]],
            type: matches[2],
            count: parseInt(matches[1], 10)
        };
    }
};
kbn.interval_to_ms = function (str) {
    var info = kbn.describe_interval(str);
    return info.sec * 1000 * info.count;
};
kbn.interval_to_seconds = function (str) {
    var info = kbn.describe_interval(str);
    return info.sec * info.count;
};
kbn.query_color_dot = function (color, diameter) {
    return '<div class="icon-circle" style="' + [
        'display:inline-block',
        'color:' + color,
        'font-size:' + diameter + 'px',
    ].join(';') + '"></div>';
};
kbn.slugifyForUrl = function (str) {
    return str
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};
// kbn.exportSeriesListToCsv = function(seriesList) {
//   var text = 'Series;Time;Value\n';
//   _.each(seriesList, function(series) {
//     _.each(series.datapoints, function(dp) {
//       text += series.alias + ';' + new Date(dp[1]).toISOString() + ';' + dp[0] + '\n';
//     });
//   });
//   var blob = new Blob([text], { type: "text/csv;charset=utf-8" });
//   window.saveAs(blob, 'cloudwiz_data_export.csv');
// };
kbn.stringToJsRegex = function (str) {
    if (str[0] !== '/') {
        return new RegExp('^' + str + '$');
    }
    var match = str.match(new RegExp('^/(.*?)/(g?i?m?y?)$'));
    return new RegExp(match[1], match[2]);
};
kbn.toFixed = function (value, decimals) {
    if (value === null) {
        return "";
    }
    var factor = decimals ? Math.pow(10, Math.max(0, decimals)) : 1;
    var formatted = String(Math.round(value * factor) / factor);
    // if exponent return directly
    if (formatted.indexOf('e') !== -1 || value === 0) {
        return formatted;
    }
    // If tickDecimals was specified, ensure that we have exactly that
    // much precision; otherwise default to the value's own precision.
    if (decimals !== null) {
        var decimalPos = formatted.indexOf(".");
        var precision = decimalPos === -1 ? 0 : formatted.length - decimalPos - 1;
        if (precision < decimals) {
            return (precision ? formatted : formatted + ".") + (String(factor)).substr(1, decimals - precision);
        }
    }
    return formatted;
};
kbn.toFixedScaled = function (value, decimals, scaledDecimals, additionalDecimals, ext) {
    if (scaledDecimals === null) {
        return kbn.toFixed(value, decimals) + ext;
    }
    else {
        return kbn.toFixed(value, scaledDecimals + additionalDecimals) + ext;
    }
};
kbn.roundValue = function (num, decimals) {
    if (num === null) {
        return null;
    }
    var n = Math.pow(10, decimals);
    var formatted = (n * num).toFixed(decimals);
    return Math.round(parseFloat(formatted)) / n;
};
///// FORMAT FUNCTION CONSTRUCTORS /////
kbn.formatBuilders = {};
// Formatter which always appends a fixed unit string to the value. No
// scaling of the value is performed.
kbn.formatBuilders.fixedUnit = function (unit) {
    return function (size, decimals) {
        if (size === null) {
            return "";
        }
        return kbn.toFixed(size, decimals) + ' ' + unit;
    };
};
// Formatter which scales the unit string geometrically according to the given
// numeric factor. Repeatedly scales the value down by the factor until it is
// less than the factor in magnitude, or the end of the array is reached.
kbn.formatBuilders.scaledUnits = function (factor, extArray) {
    return function (size, decimals, scaledDecimals) {
        if (size === null) {
            return "";
        }
        var steps = 0;
        var limit = extArray.length;
        while (Math.abs(size) >= factor) {
            steps++;
            size /= factor;
            if (steps >= limit) {
                return "NA";
            }
        }
        if (steps > 0 && scaledDecimals !== null) {
            decimals = scaledDecimals + (3 * steps);
        }
        return kbn.toFixed(size, decimals) + extArray[steps];
    };
};
// Extension of the scaledUnits builder which uses SI decimal prefixes. If an
// offset is given, it adjusts the starting units at the given prefix; a value
// of 0 starts at no scale; -3 drops to nano, +2 starts at mega, etc.
kbn.formatBuilders.decimalSIPrefix = function (unit, offset) {
    var prefixes = ['n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
    prefixes = prefixes.slice(3 + (offset || 0));
    var units = prefixes.map(function (p) { return ' ' + p + unit; });
    return kbn.formatBuilders.scaledUnits(1000, units);
};
// Extension of the scaledUnits builder which uses SI binary prefixes. If
// offset is given, it starts the units at the given prefix; otherwise, the
// offset defaults to zero and the initial unit is not prefixed.
kbn.formatBuilders.binarySIPrefix = function (unit, offset) {
    var prefixes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'].slice(offset);
    var units = prefixes.map(function (p) { return ' ' + p + unit; });
    return kbn.formatBuilders.scaledUnits(1024, units);
};
// Currency formatter for prefixing a symbol onto a number. Supports scaling
// up to the trillions.
kbn.formatBuilders.currency = function (symbol) {
    var units = ['', 'K', 'M', 'B', 'T'];
    var scaler = kbn.formatBuilders.scaledUnits(1000, units);
    return function (size, decimals, scaledDecimals) {
        if (size === null) {
            return "";
        }
        var scaled = scaler(size, decimals, scaledDecimals);
        return symbol + scaled;
    };
};
kbn.formatBuilders.simpleCountUnit = function (symbol) {
    var units = ['', 'K', 'M', 'B', 'T'];
    var scaler = kbn.formatBuilders.scaledUnits(1000, units);
    return function (size, decimals, scaledDecimals) {
        if (size === null) {
            return "";
        }
        var scaled = scaler(size, decimals, scaledDecimals);
        return scaled + " " + symbol;
    };
};
///// VALUE FORMATS /////
// Dimensionless Units
kbn.valueFormats.none = kbn.toFixed;
kbn.valueFormats.short = kbn.formatBuilders.scaledUnits(1000, ['', ' K', ' Mil', ' Bil', ' Tri', ' Quadr', ' Quint', ' Sext', ' Sept']);
kbn.valueFormats.dB = kbn.formatBuilders.fixedUnit('dB');
kbn.valueFormats.ppm = kbn.formatBuilders.fixedUnit('ppm');
kbn.valueFormats.percent = function (size, decimals) {
    if (size === null) {
        return "";
    }
    return kbn.toFixed(size, decimals) + '%';
};
kbn.valueFormats.percentunit = function (size, decimals) {
    if (size === null) {
        return "";
    }
    return kbn.toFixed(100 * size, decimals) + '%';
};
// Currencies
kbn.valueFormats.currencyUSD = kbn.formatBuilders.currency('$');
kbn.valueFormats.currencyGBP = kbn.formatBuilders.currency('£');
kbn.valueFormats.currencyEUR = kbn.formatBuilders.currency('€');
kbn.valueFormats.currencyJPY = kbn.formatBuilders.currency('¥');
// Data
kbn.valueFormats.bits = kbn.formatBuilders.binarySIPrefix('b');
kbn.valueFormats.bytes = kbn.formatBuilders.binarySIPrefix('B');
kbn.valueFormats.kbytes = kbn.formatBuilders.binarySIPrefix('B', 1);
kbn.valueFormats.mbytes = kbn.formatBuilders.binarySIPrefix('B', 2);
kbn.valueFormats.gbytes = kbn.formatBuilders.binarySIPrefix('B', 3);
// Data Rate
kbn.valueFormats.pps = kbn.formatBuilders.decimalSIPrefix('pps');
kbn.valueFormats.bps = kbn.formatBuilders.decimalSIPrefix('bps');
kbn.valueFormats.Bps = kbn.formatBuilders.decimalSIPrefix('Bps');
kbn.valueFormats.KBs = kbn.formatBuilders.decimalSIPrefix('Bs', 1);
kbn.valueFormats.Kbits = kbn.formatBuilders.decimalSIPrefix('bits', 1);
kbn.valueFormats.MBs = kbn.formatBuilders.decimalSIPrefix('Bs', 2);
kbn.valueFormats.Mbits = kbn.formatBuilders.decimalSIPrefix('bits', 2);
kbn.valueFormats.GBs = kbn.formatBuilders.decimalSIPrefix('Bs', 3);
kbn.valueFormats.Gbits = kbn.formatBuilders.decimalSIPrefix('bits', 3);
// Throughput
kbn.valueFormats.ops = kbn.formatBuilders.simpleCountUnit('ops');
kbn.valueFormats.rps = kbn.formatBuilders.simpleCountUnit('rps');
kbn.valueFormats.wps = kbn.formatBuilders.simpleCountUnit('wps');
kbn.valueFormats.iops = kbn.formatBuilders.simpleCountUnit('iops');
// Energy
kbn.valueFormats.watt = kbn.formatBuilders.decimalSIPrefix('W');
kbn.valueFormats.kwatt = kbn.formatBuilders.decimalSIPrefix('W', 1);
kbn.valueFormats.voltamp = kbn.formatBuilders.decimalSIPrefix('VA');
kbn.valueFormats.kvoltamp = kbn.formatBuilders.decimalSIPrefix('VA', 1);
kbn.valueFormats.voltampreact = kbn.formatBuilders.decimalSIPrefix('var');
kbn.valueFormats.watth = kbn.formatBuilders.decimalSIPrefix('Wh');
kbn.valueFormats.kwatth = kbn.formatBuilders.decimalSIPrefix('Wh', 1);
kbn.valueFormats.joule = kbn.formatBuilders.decimalSIPrefix('J');
kbn.valueFormats.ev = kbn.formatBuilders.decimalSIPrefix('eV');
kbn.valueFormats.amp = kbn.formatBuilders.decimalSIPrefix('A');
kbn.valueFormats.volt = kbn.formatBuilders.decimalSIPrefix('V');
// Temperature
kbn.valueFormats.celsius = kbn.formatBuilders.fixedUnit('°C');
kbn.valueFormats.farenheit = kbn.formatBuilders.fixedUnit('°F');
kbn.valueFormats.kelvin = kbn.formatBuilders.fixedUnit('K');
kbn.valueFormats.humidity = kbn.formatBuilders.fixedUnit('%H');
// Pressure
kbn.valueFormats.pressurembar = kbn.formatBuilders.fixedUnit('mbar');
kbn.valueFormats.pressurehpa = kbn.formatBuilders.fixedUnit('hPa');
kbn.valueFormats.pressurehg = kbn.formatBuilders.fixedUnit('"Hg');
kbn.valueFormats.pressurepsi = kbn.formatBuilders.scaledUnits(1000, [' psi', ' ksi', ' Mpsi']);
// Length
kbn.valueFormats.lengthm = kbn.formatBuilders.decimalSIPrefix('m');
kbn.valueFormats.lengthmm = kbn.formatBuilders.decimalSIPrefix('m', -1);
kbn.valueFormats.lengthkm = kbn.formatBuilders.decimalSIPrefix('m', 1);
kbn.valueFormats.lengthmi = kbn.formatBuilders.fixedUnit('mi');
// Velocity
kbn.valueFormats.velocityms = kbn.formatBuilders.fixedUnit('m/s');
kbn.valueFormats.velocitykmh = kbn.formatBuilders.fixedUnit('km/h');
kbn.valueFormats.velocitymph = kbn.formatBuilders.fixedUnit('mph');
kbn.valueFormats.velocityknot = kbn.formatBuilders.fixedUnit('kn');
// Volume
kbn.valueFormats.litre = kbn.formatBuilders.decimalSIPrefix('L');
kbn.valueFormats.mlitre = kbn.formatBuilders.decimalSIPrefix('L', -1);
kbn.valueFormats.m3 = kbn.formatBuilders.decimalSIPrefix('m3');
// Time
kbn.valueFormats.hertz = kbn.formatBuilders.decimalSIPrefix('Hz');
kbn.valueFormats.ms = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    if (Math.abs(size) < 1000) {
        return kbn.toFixed(size, decimals) + ' ms';
    }
    else if (Math.abs(size) < 60000) {
        // Less than 1 min
        return kbn.toFixedScaled(size / 1000, decimals, scaledDecimals, 3, ' s');
    }
    else if (Math.abs(size) < 3600000) {
        // Less than 1 hour, devide in minutes
        return kbn.toFixedScaled(size / 60000, decimals, scaledDecimals, 5, ' min');
    }
    else if (Math.abs(size) < 86400000) {
        // Less than one day, devide in hours
        return kbn.toFixedScaled(size / 3600000, decimals, scaledDecimals, 7, ' hour');
    }
    else if (Math.abs(size) < 31536000000) {
        // Less than one year, devide in days
        return kbn.toFixedScaled(size / 86400000, decimals, scaledDecimals, 8, ' day');
    }
    return kbn.toFixedScaled(size / 31536000000, decimals, scaledDecimals, 10, " year");
};
kbn.valueFormats.s = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    // Less than 1 µs, devide in ns
    if (Math.abs(size) < 0.000001) {
        return kbn.toFixedScaled(size * 1e9, decimals, scaledDecimals - decimals, -9, ' ns');
    }
    // Less than 1 ms, devide in µs
    if (Math.abs(size) < 0.001) {
        return kbn.toFixedScaled(size * 1e6, decimals, scaledDecimals - decimals, -6, ' µs');
    }
    // Less than 1 second, devide in ms
    if (Math.abs(size) < 1) {
        return kbn.toFixedScaled(size * 1e3, decimals, scaledDecimals - decimals, -3, ' ms');
    }
    if (Math.abs(size) < 60) {
        return kbn.toFixed(size, decimals) + ' s';
    }
    else if (Math.abs(size) < 3600) {
        // Less than 1 hour, devide in minutes
        return kbn.toFixedScaled(size / 60, decimals, scaledDecimals, 1, ' min');
    }
    else if (Math.abs(size) < 86400) {
        // Less than one day, devide in hours
        return kbn.toFixedScaled(size / 3600, decimals, scaledDecimals, 4, ' hour');
    }
    else if (Math.abs(size) < 604800) {
        // Less than one week, devide in days
        return kbn.toFixedScaled(size / 86400, decimals, scaledDecimals, 5, ' day');
    }
    else if (Math.abs(size) < 31536000) {
        // Less than one year, devide in week
        return kbn.toFixedScaled(size / 604800, decimals, scaledDecimals, 6, ' week');
    }
    return kbn.toFixedScaled(size / 3.15569e7, decimals, scaledDecimals, 7, " year");
};
kbn.valueFormats['µs'] = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    if (Math.abs(size) < 1000) {
        return kbn.toFixed(size, decimals) + ' µs';
    }
    else if (Math.abs(size) < 1000000) {
        return kbn.toFixedScaled(size / 1000, decimals, scaledDecimals, 3, ' ms');
    }
    else {
        return kbn.toFixedScaled(size / 1000000, decimals, scaledDecimals, 6, ' s');
    }
};
kbn.valueFormats.ns = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    if (Math.abs(size) < 1000) {
        return kbn.toFixed(size, decimals) + ' ns';
    }
    else if (Math.abs(size) < 1000000) {
        return kbn.toFixedScaled(size / 1000, decimals, scaledDecimals, 3, ' µs');
    }
    else if (Math.abs(size) < 1000000000) {
        return kbn.toFixedScaled(size / 1000000, decimals, scaledDecimals, 6, ' ms');
    }
    else if (Math.abs(size) < 60000000000) {
        return kbn.toFixedScaled(size / 1000000000, decimals, scaledDecimals, 9, ' s');
    }
    else {
        return kbn.toFixedScaled(size / 60000000000, decimals, scaledDecimals, 12, ' min');
    }
};
kbn.valueFormats.m = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    if (Math.abs(size) < 60) {
        return kbn.toFixed(size, decimals) + ' min';
    }
    else if (Math.abs(size) < 1440) {
        return kbn.toFixedScaled(size / 60, decimals, scaledDecimals, 2, ' hour');
    }
    else if (Math.abs(size) < 10080) {
        return kbn.toFixedScaled(size / 1440, decimals, scaledDecimals, 3, ' day');
    }
    else if (Math.abs(size) < 604800) {
        return kbn.toFixedScaled(size / 10080, decimals, scaledDecimals, 4, ' week');
    }
    else {
        return kbn.toFixedScaled(size / 5.25948e5, decimals, scaledDecimals, 5, ' year');
    }
};
kbn.valueFormats.h = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    if (Math.abs(size) < 24) {
        return kbn.toFixed(size, decimals) + ' hour';
    }
    else if (Math.abs(size) < 168) {
        return kbn.toFixedScaled(size / 24, decimals, scaledDecimals, 2, ' day');
    }
    else if (Math.abs(size) < 8760) {
        return kbn.toFixedScaled(size / 168, decimals, scaledDecimals, 3, ' week');
    }
    else {
        return kbn.toFixedScaled(size / 8760, decimals, scaledDecimals, 4, ' year');
    }
};
kbn.valueFormats.d = function (size, decimals, scaledDecimals) {
    if (size === null) {
        return "";
    }
    if (Math.abs(size) < 7) {
        return kbn.toFixed(size, decimals) + ' day';
    }
    else if (Math.abs(size) < 365) {
        return kbn.toFixedScaled(size / 7, decimals, scaledDecimals, 2, ' week');
    }
    else {
        return kbn.toFixedScaled(size / 365, decimals, scaledDecimals, 3, ' year');
    }
};
///// FORMAT MENU /////
kbn.getUnitFormats = function () {
    return [
        {
            text: 'none',
            submenu: [
                { text: 'none', value: 'none' },
                { text: 'short', value: 'short' },
                { text: 'percent (0-100)', value: 'percent' },
                { text: 'percent (0.0-1.0)', value: 'percentunit' },
                { text: 'Humidity (%H)', value: 'humidity' },
                { text: 'ppm', value: 'ppm' },
                { text: 'decibel', value: 'dB' },
            ]
        },
        {
            text: 'currency',
            submenu: [
                { text: 'Dollars ($)', value: 'currencyUSD' },
                { text: 'Pounds (£)', value: 'currencyGBP' },
                { text: 'Euro (€)', value: 'currencyEUR' },
                { text: 'Yen (¥)', value: 'currencyJPY' },
            ]
        },
        {
            text: 'time',
            submenu: [
                { text: 'Hertz (1/s)', value: 'hertz' },
                { text: 'nanoseconds (ns)', value: 'ns' },
                { text: 'microseconds (µs)', value: 'µs' },
                { text: 'milliseconds (ms)', value: 'ms' },
                { text: 'seconds (s)', value: 's' },
                { text: 'minutes (m)', value: 'm' },
                { text: 'hours (h)', value: 'h' },
                { text: 'days (d)', value: 'd' },
            ]
        },
        {
            text: 'data',
            submenu: [
                { text: 'bits', value: 'bits' },
                { text: 'bytes', value: 'bytes' },
                { text: 'kilobytes', value: 'kbytes' },
                { text: 'megabytes', value: 'mbytes' },
                { text: 'gigabytes', value: 'gbytes' },
            ]
        },
        {
            text: 'data rate',
            submenu: [
                { text: 'packets/sec', value: 'pps' },
                { text: 'bits/sec', value: 'bps' },
                { text: 'bytes/sec', value: 'Bps' },
                { text: 'kilobits/sec', value: 'Kbits' },
                { text: 'kilobytes/sec', value: 'KBs' },
                { text: 'megabits/sec', value: 'Mbits' },
                { text: 'megabytes/sec', value: 'MBs' },
                { text: 'gigabytes/sec', value: 'GBs' },
                { text: 'gigabits/sec', value: 'Gbits' },
            ]
        },
        {
            text: 'throughput',
            submenu: [
                { text: 'ops/sec (ops)', value: 'ops' },
                { text: 'reads/sec (rps)', value: 'rps' },
                { text: 'writes/sec (wps)', value: 'wps' },
                { text: 'I/O ops/sec (iops)', value: 'iops' },
            ]
        },
        {
            text: 'length',
            submenu: [
                { text: 'millimetre (mm)', value: 'lengthmm' },
                { text: 'meter (m)', value: 'lengthm' },
                { text: 'kilometer (km)', value: 'lengthkm' },
                { text: 'mile (mi)', value: 'lengthmi' },
            ]
        },
        {
            text: 'velocity',
            submenu: [
                { text: 'm/s', value: 'velocityms' },
                { text: 'km/h', value: 'velocitykmh' },
                { text: 'mph', value: 'velocitymph' },
                { text: 'knot (kn)', value: 'velocityknot' },
            ]
        },
        {
            text: 'volume',
            submenu: [
                { text: 'millilitre', value: 'mlitre' },
                { text: 'litre', value: 'litre' },
                { text: 'cubic metre', value: 'm3' },
            ]
        },
        {
            text: 'energy',
            submenu: [
                { text: 'watt (W)', value: 'watt' },
                { text: 'kilowatt (kW)', value: 'kwatt' },
                { text: 'volt-ampere (VA)', value: 'voltamp' },
                { text: 'kilovolt-ampere (kVA)', value: 'kvoltamp' },
                { text: 'volt-ampere reactive (var)', value: 'voltampreact' },
                { text: 'watt-hour (Wh)', value: 'watth' },
                { text: 'kilowatt-hour (kWh)', value: 'kwatth' },
                { text: 'joule (J)', value: 'joule' },
                { text: 'electron volt (eV)', value: 'ev' },
                { text: 'Ampere (A)', value: 'amp' },
                { text: 'Volt (V)', value: 'volt' },
            ]
        },
        {
            text: 'temperature',
            submenu: [
                { text: 'Celcius (°C)', value: 'celsius' },
                { text: 'Farenheit (°F)', value: 'farenheit' },
                { text: 'Kelvin (K)', value: 'kelvin' },
            ]
        },
        {
            text: 'pressure',
            submenu: [
                { text: 'Millibars', value: 'pressurembar' },
                { text: 'Hectopascals', value: 'pressurehpa' },
                { text: 'Inches of mercury', value: 'pressurehg' },
                { text: 'PSI', value: 'pressurepsi' },
            ]
        }
    ];
};
/* harmony default export */ __webpack_exports__["default"] = (kbn);


/***/ }),
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["parse"] = parse;
/* harmony export (immutable) */ __webpack_exports__["isValid"] = isValid;
/* harmony export (immutable) */ __webpack_exports__["parseDateMath"] = parseDateMath;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
///<reference path="../../headers/common.d.ts" />


var units = ['y', 'M', 'w', 'd', 'h', 'm', 's', 'ms'];
function parse(text, roundUp) {
    if (!text) {
        return undefined;
    }
    if (__WEBPACK_IMPORTED_MODULE_1_moment___default.a.isMoment(text)) {
        return text;
    }
    if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isDate(text)) {
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(text);
    }
    var time;
    var mathString = '';
    var index;
    var parseString;
    if (text.substring(0, 3) === 'now') {
        time = __WEBPACK_IMPORTED_MODULE_1_moment___default()();
        mathString = text.substring('now'.length);
    }
    else {
        index = text.indexOf('||');
        if (index === -1) {
            parseString = text;
            mathString = ''; // nothing else
        }
        else {
            parseString = text.substring(0, index);
            mathString = text.substring(index + 2);
        }
        // We're going to just require ISO8601 timestamps, k?
        time = __WEBPACK_IMPORTED_MODULE_1_moment___default()(parseString);
    }
    if (!mathString.length) {
        return time;
    }
    return parseDateMath(mathString, time, roundUp);
}
function isValid(text) {
    var date = parse(text);
    if (!date) {
        return false;
    }
    if (__WEBPACK_IMPORTED_MODULE_1_moment___default.a.isMoment(date)) {
        return date.isValid();
    }
    return false;
}
function parseDateMath(mathString, time, roundUp) {
    var dateTime = time;
    var i = 0;
    var len = mathString.length;
    while (i < len) {
        var c = mathString.charAt(i++);
        var type;
        var num;
        var unit;
        if (c === '/') {
            type = 0;
        }
        else if (c === '+') {
            type = 1;
        }
        else if (c === '-') {
            type = 2;
        }
        else {
            return undefined;
        }
        if (isNaN(mathString.charAt(i))) {
            num = 1;
        }
        else if (mathString.length === 2) {
            num = mathString.charAt(i);
        }
        else {
            var numFrom = i;
            while (!isNaN(mathString.charAt(i))) {
                i++;
                if (i > 10) {
                    return undefined;
                }
            }
            num = parseInt(mathString.substring(numFrom, i), 10);
        }
        if (type === 0) {
            // rounding is only allowed on whole, single, units (eg M or 1M, not 0.5M or 2M)
            if (num !== 1) {
                return undefined;
            }
        }
        unit = mathString.charAt(i++);
        if (!__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.contains(units, unit)) {
            return undefined;
        }
        else {
            if (type === 0) {
                if (roundUp) {
                    dateTime.endOf(unit);
                }
                else {
                    dateTime.startOf(unit);
                }
            }
            else if (type === 1) {
                dateTime.add(num, unit);
            }
            else if (type === 2) {
                dateTime.subtract(num, unit);
            }
        }
    }
    return dateTime;
}


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
  'use strict';

  return {
    get: function(key) {
      return window.localStorage[key];
    },
    set: function(key, value) {
      window.localStorage[key] = value;
    },
    getBool: function(key, def) {
      if (def !== void 0 && !this.exists(key)) {
        return def;
      }
      return window.localStorage[key] === 'true';
    },
    exists: function(key) {
      return window.localStorage[key] !== void 0;
    },
    delete: function(key) {
      window.localStorage.removeItem(key);
    }

  };

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 130 */,
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module, global) {
var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
};
exports.root = (objectTypes[typeof self] && self) || (objectTypes[typeof window] && window);
/* tslint:disable:no-unused-variable */
var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
var freeGlobal = objectTypes[typeof global] && global;
if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    exports.root = freeGlobal;
}
//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(127)(module), __webpack_require__(69)))

/***/ }),
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directives_annotation_tooltip__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__directives_annotation_tooltip___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__directives_annotation_tooltip__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__directives_dash_class__ = __webpack_require__(465);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__directives_dash_class___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__directives_dash_class__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directives_confirm_click__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__directives_confirm_click___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__directives_confirm_click__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__directives_dash_edit_link__ = __webpack_require__(467);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__directives_dash_edit_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__directives_dash_edit_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__directives_dash_upload__ = __webpack_require__(468);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__directives_dash_upload___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__directives_dash_upload__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__directives_dropdown_typeahead__ = __webpack_require__(469);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__directives_dropdown_typeahead___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__directives_dropdown_typeahead__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_grafana_version_check__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__directives_grafana_version_check___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__directives_grafana_version_check__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_metric_segment__ = __webpack_require__(471);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__directives_metric_segment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__directives_metric_segment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__directives_misc__ = __webpack_require__(472);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__directives_misc___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__directives_misc__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__directives_ng_model_on_blur__ = __webpack_require__(473);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__directives_ng_model_on_blur___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__directives_ng_model_on_blur__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__directives_password_strenght__ = __webpack_require__(474);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__directives_password_strenght___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__directives_password_strenght__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__directives_spectrum_picker__ = __webpack_require__(475);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__directives_spectrum_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__directives_spectrum_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__directives_tags__ = __webpack_require__(476);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__directives_tags___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__directives_tags__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__directives_value_select_dropdown__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__directives_value_select_dropdown___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__directives_value_select_dropdown__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__directives_plugin_component__ = __webpack_require__(478);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__directives_rebuild_on_change__ = __webpack_require__(483);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__directives_give_focus__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__jquery_extended__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__jquery_extended___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__jquery_extended__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__partials__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__partials___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__partials__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__directives_system_panel__ = __webpack_require__(487);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__directives_service_dep__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__directives_service_dep___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__directives_service_dep__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__directives_log_tabpane__ = __webpack_require__(489);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__directives_log_tabpane___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__directives_log_tabpane__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__directives_tagpicker__ = __webpack_require__(490);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__directives_tagpicker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__directives_tagpicker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__directives_loading__ = __webpack_require__(491);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__directives_ng_enter__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__directives_auto_refresh__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_topology_graph__ = __webpack_require__(494);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_guide_guide__ = __webpack_require__(495);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__components_toolbar_toolbar__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_cwiz_switch__ = __webpack_require__(497);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_tree_menu_tree_menu__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_knowledge_base_knowledgeBase__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__components_time_window_time_window__ = __webpack_require__(500);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__components_time_window_time_window___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32__components_time_window_time_window__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__components_grafana_app__ = __webpack_require__(501);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__components_sidemenu_sidemenu__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__components_sidemenu_sidemenu___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_34__components_sidemenu_sidemenu__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__components_search_search__ = __webpack_require__(503);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__components_search_search___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_35__components_search_search__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__components_info_popover__ = __webpack_require__(504);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__components_colorpicker__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__components_navbar_navbar__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__directives_array_join__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__live_live_srv__ = __webpack_require__(508);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__utils_emitter__ = __webpack_require__(328);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__components_layout_selector_layout_selector__ = __webpack_require__(518);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__components_switch__ = __webpack_require__(519);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__components_dashboard_selector__ = __webpack_require__(520);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45_app_core_controllers_all__ = __webpack_require__(521);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45_app_core_controllers_all___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_45_app_core_controllers_all__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46_app_core_services_all__ = __webpack_require__(533);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46_app_core_services_all___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_46_app_core_services_all__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47_app_core_routes_routes__ = __webpack_require__(557);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__filters_filters__ = __webpack_require__(561);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__app_events__ = __webpack_require__(330);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__utils_colors__ = __webpack_require__(562);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52_app_core_i18n_locale_provider__ = __webpack_require__(563);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52_app_core_i18n_locale_provider___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_52_app_core_i18n_locale_provider__);
/* unused harmony reexport arrayJoin */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_49__core_module__["default"]; });
/* unused harmony reexport grafanaAppDirective */
/* unused harmony reexport sideMenuDirective */
/* unused harmony reexport navbarDirective */
/* unused harmony reexport searchDirective */
/* unused harmony reexport colorPicker */
/* unused harmony reexport liveSrv */
/* unused harmony reexport layoutSelector */
/* unused harmony reexport switchDirective */
/* unused harmony reexport infoPopover */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_41__utils_emitter__["a"]; });
/* unused harmony reexport appEvents */
/* unused harmony reexport dashboardSelector */
/* unused harmony reexport tagPicker */
/* unused harmony reexport colors */
/* unused harmony reexport topologyGraphDirective */
/* unused harmony reexport guideDirective */
/* unused harmony reexport toolbarDirective */
/* unused harmony reexport cwizSwitchDirective */
/* unused harmony reexport treeMenu */
/* unused harmony reexport knowledgeBaseDirective */
/* unused harmony reexport timeWindowDirective */
/* unused harmony reexport autoRefresh */
///<reference path="../headers/common.d.ts" />
///<reference path="./mod_defs.d.ts" />



















//Cloudwiz





































/***/ }),
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */,
/* 316 */,
/* 317 */,
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */,
/* 323 */,
/* 324 */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 324;

/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(131);
var Symbol = root_1.root.Symbol;
/**
 * rxSubscriber symbol is a symbol for retrieving an "Rx safe" Observer from an object
 * "Rx safety" can be defined as an object that has all of the traits of an Rx Subscriber,
 * including the ability to add and remove subscriptions to the subscription chain and
 * guarantees involving event triggering (can't "next" after unsubscription, etc).
 */
exports.$$rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 328 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Emitter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_eventemitter3__ = __webpack_require__(329);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_eventemitter3___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_eventemitter3__);
///<reference path="../../headers/common.d.ts" />

var hasOwnProp = {}.hasOwnProperty;
function createName(name) {
    return '$' + name;
}
var Emitter = /** @class */ (function () {
    function Emitter() {
        this.emitter = new __WEBPACK_IMPORTED_MODULE_0_eventemitter3___default.a();
    }
    Emitter.prototype.emit = function (name, data) {
        this.emitter.emit(name, data);
    };
    Emitter.prototype.on = function (name, handler, scope) {
        var _this = this;
        this.emitter.on(name, handler);
        if (scope) {
            scope.$on('$destroy', function () {
                _this.emitter.off(name, handler);
            });
        }
    };
    Emitter.prototype.off = function (name, handler) {
        this.emitter.off(name, handler);
    };
    return Emitter;
}());



/***/ }),
/* 329 */,
/* 330 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_emitter__ = __webpack_require__(328);
///<reference path="../headers/common.d.ts" />

var appEvents = new __WEBPACK_IMPORTED_MODULE_0__utils_emitter__["a" /* Emitter */]();
/* harmony default export */ __webpack_exports__["a"] = (appEvents);


/***/ }),
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */,
/* 341 */,
/* 342 */,
/* 343 */,
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */,
/* 348 */,
/* 349 */,
/* 350 */,
/* 351 */,
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */,
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getRelativeTimesList"] = getRelativeTimesList;
/* harmony export (immutable) */ __webpack_exports__["describeTextRange"] = describeTextRange;
/* harmony export (immutable) */ __webpack_exports__["describeTimeRange"] = describeTimeRange;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__datemath__ = __webpack_require__(128);
///<reference path="../../headers/common.d.ts" />



var language = (window.localStorage.getItem('CLOUDWIZ_LANG_KEY')) || 'zh_CN';
var spans = {
    's': { display: '秒' },
    'm': { display: '分钟' },
    'h': { display: '小时' },
    'd': { display: '天' },
    'w': { display: '周' },
    'M': { display: '个月' },
    'y': { display: '年' },
};
var rangeOptions = [
    { from: 'now/d', to: 'now/d', display: '今天', section: 2 },
    { from: 'now/d', to: 'now', display: '截至今天', section: 2 },
    { from: 'now/w', to: 'now/w', display: '今周', section: 2 },
    { from: 'now/w', to: 'now', display: '到今周', section: 2 },
    { from: 'now/M', to: 'now/M', display: '今月', section: 2 },
    { from: 'now/y', to: 'now/y', display: '今年', section: 2 },
    { from: 'now-1d/d', to: 'now-1d/d', display: '昨天', section: 1 },
    { from: 'now-2d/d', to: 'now-2d/d', display: '截至昨天', section: 1 },
    { from: 'now-7d/d', to: 'now-7d/d', display: '上一周的今天', section: 1 },
    { from: 'now/w', to: 'now+1w/w', display: '未来一周', section: 1 },
    { from: 'now/M', to: 'now+1M/M', display: '未来一月', section: 1 },
    { from: 'now/y', to: 'now+1y/y', display: '未来一年', section: 1 },
    { from: 'now-5m', to: 'now', display: '5  分钟之前', section: 3 },
    { from: 'now-15m', to: 'now', display: '15 分钟之前', section: 3 },
    { from: 'now-30m', to: 'now', display: '30 分钟之前', section: 3 },
    { from: 'now-1h', to: 'now', display: '1  小时之前', section: 3 },
    { from: 'now-6h', to: 'now', display: '6  小时之前', section: 3 },
    { from: 'now-12h', to: 'now', display: '12 小时之前', section: 3 },
    { from: 'now-24h', to: 'now', display: '24 小时之前', section: 3 },
    { from: 'now-7d', to: 'now', display: '7  天之前', section: 3 },
    { from: 'now-30d', to: 'now', display: '30 天之前', section: 0 },
    { from: 'now-60d', to: 'now', display: '60 天之前', section: 0 },
    { from: 'now-90d', to: 'now', display: '90 天之前', section: 0 },
    { from: 'now-6M', to: 'now', display: '6  个月之前', section: 0 },
    { from: 'now-1y', to: 'now', display: '1  年之前', section: 0 },
    { from: 'now-2y', to: 'now', display: '2  年之前', section: 0 },
    { from: 'now-5y', to: 'now', display: '5  年之前', section: 0 },
];
var toText = ' 至 ';
var agoText = '之前';
if (language === 'en') {
    spans = {
        's': { display: 'second' },
        'm': { display: 'minute' },
        'h': { display: 'hour' },
        'd': { display: 'day' },
        'w': { display: 'week' },
        'M': { display: 'month' },
        'y': { display: 'year' },
    };
    rangeOptions = rangeOptions = [
        { from: 'now/d', to: 'now/d', display: 'Today', section: 2 },
        { from: 'now/d', to: 'now', display: 'Today so far', section: 2 },
        { from: 'now/w', to: 'now/w', display: 'This week', section: 2 },
        { from: 'now/w', to: 'now', display: 'This week so far', section: 2 },
        { from: 'now/M', to: 'now/M', display: 'This month', section: 2 },
        { from: 'now/y', to: 'now/y', display: 'This year', section: 2 },
        { from: 'now-1d/d', to: 'now-1d/d', display: 'Yesterday', section: 1 },
        { from: 'now-2d/d', to: 'now-2d/d', display: 'Day before yesterday', section: 1 },
        { from: 'now-7d/d', to: 'now-7d/d', display: 'This day last week', section: 1 },
        { from: 'now-1w/w', to: 'now-1w/w', display: 'Previous week', section: 1 },
        { from: 'now-1M/M', to: 'now-1M/M', display: 'Previous month', section: 1 },
        { from: 'now-1y/y', to: 'now-1y/y', display: 'Previous year', section: 1 },
        { from: 'now-5m', to: 'now', display: 'Last 5 minutes', section: 3 },
        { from: 'now-15m', to: 'now', display: 'Last 15 minutes', section: 3 },
        { from: 'now-30m', to: 'now', display: 'Last 30 minutes', section: 3 },
        { from: 'now-1h', to: 'now', display: 'Last 1 hour', section: 3 },
        { from: 'now-3h', to: 'now', display: 'Last 3 hours', section: 3 },
        { from: 'now-6h', to: 'now', display: 'Last 6 hours', section: 3 },
        { from: 'now-12h', to: 'now', display: 'Last 12 hours', section: 3 },
        { from: 'now-24h', to: 'now', display: 'Last 24 hours', section: 3 },
        { from: 'now-7d', to: 'now', display: 'Last 7 days', section: 0 },
        { from: 'now-30d', to: 'now', display: 'Last 30 days', section: 0 },
        { from: 'now-60d', to: 'now', display: 'Last 60 days', section: 0 },
        { from: 'now-90d', to: 'now', display: 'Last 90 days', section: 0 },
        { from: 'now-6M', to: 'now', display: 'Last 6 months', section: 0 },
        { from: 'now-1y', to: 'now', display: 'Last 1 year', section: 0 },
        { from: 'now-2y', to: 'now', display: 'Last 2 years', section: 0 },
        { from: 'now-5y', to: 'now', display: 'Last 5 years', section: 0 },
    ];
    toText = ' to ';
    agoText = 'ago';
}
var absoluteFormat = 'MMM D, YYYY HH:mm:ss';
var rangeIndex = {};
__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.each(rangeOptions, function (frame) {
    rangeIndex[frame.from + toText + frame.to] = frame;
});
function getRelativeTimesList(timepickerSettings, currentDisplay) {
    var groups = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.groupBy(rangeOptions, function (option) {
        option.active = option.display === currentDisplay;
        return option.section;
    });
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
function describeTextRange(expr) {
    if (expr.indexOf('now') === -1) {
        expr = 'now-' + expr;
    }
    var opt = rangeIndex[expr + ' to now'];
    if (opt) {
        return opt;
    }
    opt = { from: expr, to: 'now' };
    var parts = /^now-(\d+)(\w)/.exec(expr);
    if (parts) {
        var unit = parts[2];
        var amount = parseInt(parts[1]);
        var span = spans[unit];
        if (span) {
            opt.display = amount + ' ' + span.display + agoText;
            opt.section = span.section;
            // if (amount > 1) {
            //   opt.display += 's';
            // }
        }
    }
    else {
        opt.display = opt.from + toText + opt.to;
        opt.invalid = true;
    }
    return opt;
}
function describeTimeRange(range) {
    var option = rangeIndex[range.from.toString() + toText + range.to.toString()];
    if (option) {
        return option.display;
    }
    if (__WEBPACK_IMPORTED_MODULE_1_moment___default.a.isMoment(range.from) && __WEBPACK_IMPORTED_MODULE_1_moment___default.a.isMoment(range.to)) {
        return formatDate(range.from) + toText + formatDate(range.to);
    }
    if (__WEBPACK_IMPORTED_MODULE_1_moment___default.a.isMoment(range.from)) {
        var toMoment = __WEBPACK_IMPORTED_MODULE_2__datemath__["parse"](range.to, true);
        return formatDate(range.from) + toText + toMoment.fromNow();
    }
    if (__WEBPACK_IMPORTED_MODULE_1_moment___default.a.isMoment(range.to)) {
        var from = __WEBPACK_IMPORTED_MODULE_2__datemath__["parse"](range.from, false);
        return from.fromNow() + toText + formatDate(range.to);
    }
    if (range.to.toString() === 'now') {
        var res = describeTextRange(range.from);
        return res.display;
    }
    return range.from.toString() + toText + range.to.toString();
}


/***/ }),
/* 453 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QueryCtrl", function() { return QueryCtrl; });
///<reference path="../../headers/common.d.ts" />
var QueryCtrl = /** @class */ (function () {
    function QueryCtrl($scope, $injector) {
        this.$scope = $scope;
        this.$injector = $injector;
        this.panel = this.panelCtrl.panel;
    }
    QueryCtrl.prototype.refresh = function () {
        this.panelCtrl.refresh();
    };
    return QueryCtrl;
}());



/***/ }),
/* 454 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__app__ = __webpack_require__(455);
// (function bootGrafana() {
//   'use strict';
//   var systemLocate = System.locate;
//   System.locate = function(load) {
//     var System = this;
//     return Promise.resolve(systemLocate.call(this, load)).then(function(address) {
//       return address + System.cacheBust;
//     });
//   };
//   System.cacheBust = '?bust=' + Date.now();
//   System.import('app/app').then(function(app) {
//     app.default.init();
//   }).catch(function(err) {
//     console.log('Loading app module failed: ', err);
//   });
// })();

__WEBPACK_IMPORTED_MODULE_0__app__["a" /* default */].init();


/***/ }),
/* 455 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GrafanaApp */
throw new Error("Cannot find module \"bootstrap\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vendor_filesaver__ = __webpack_require__(456);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vendor_filesaver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vendor_filesaver__);
throw new Error("Cannot find module \"lodash-src\"");
throw new Error("Cannot find module \"angular-strap\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_route__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_route___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular_route__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular_sanitize__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular_sanitize___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angular_sanitize__);
throw new Error("Cannot find module \"angular-dragdrop\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angular_bindonce__ = __webpack_require__(204);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angular_bindonce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_angular_bindonce__);
throw new Error("Cannot find module \"angular-animate\"");
throw new Error("Cannot find module \"angular-ui\"");
throw new Error("Cannot find module \"ui.calendar\"");
throw new Error("Cannot find module \"angular-strap.tpl\"");
throw new Error("Cannot find module \"angular-strap-old\"");
throw new Error("Cannot find module \"jsPlumbToolkit\"");
throw new Error("Cannot find module \"ng-quill\"");
throw new Error("Cannot find module \"ng-table\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__core_core__ = __webpack_require__(200);
///<reference path="headers/common.d.ts" />






















var GrafanaApp = /** @class */ (function () {
    function GrafanaApp() {
        this.preBootModules = [];
        this.registerFunctions = {};
        this.ngModuleDependencies = [];
    }
    GrafanaApp.prototype.useModule = function (module) {
        if (this.preBootModules) {
            this.preBootModules.push(module);
        }
        else {
            __WEBPACK_IMPORTED_MODULE_19_lodash___default.a.extend(module, this.registerFunctions);
        }
        this.ngModuleDependencies.push(module.name);
        return module;
    };
    GrafanaApp.prototype.init = function () {
        var _this = this;
        var app = __WEBPACK_IMPORTED_MODULE_17_angular___default.a.module('grafana', ['mgcrea.ngStrap', 'ngAnimate', 'ngTable', 'cloudwiz.translate']);
        app.constant('grafanaVersion', "@grafanaVersion@");
        console.log(__WEBPACK_IMPORTED_MODULE_18_app_core_config___default.a.bootData.user.locale);
        __WEBPACK_IMPORTED_MODULE_20_moment___default.a.locale(__WEBPACK_IMPORTED_MODULE_18_app_core_config___default.a.bootData.user.locale);
        app.config(['$translateProvider', function ($translateProvider) {
                $translateProvider.useStaticFilesLoader({
                    prefix: 'public/app/core/i18n/',
                    suffix: '.json'
                });
                $translateProvider.determinePreferredLanguage().fallbackLanguage('zh_CN');
                $translateProvider.useLocalStorage();
            }]);
        app.config(function ($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
            //$compileProvider.debugInfoEnabled(false);
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension|javascript):/);
            _this.registerFunctions.controller = $controllerProvider.register;
            _this.registerFunctions.directive = $compileProvider.directive;
            _this.registerFunctions.factory = $provide.factory;
            _this.registerFunctions.service = $provide.service;
            _this.registerFunctions.filter = $filterProvider.register;
            $provide.decorator("$http", ["$delegate", "$templateCache", function ($delegate, $templateCache) {
                    var get = $delegate.get;
                    $delegate.get = function (url, config) {
                        if (url.match(/\.html$/)) {
                            // some template's already exist in the cache
                            if (!$templateCache.get(url)) {
                                url += "?v=" + new Date().getTime();
                            }
                        }
                        return get(url, config);
                    };
                    return $delegate;
                }]);
        });
        this.ngModuleDependencies = [
            'grafana.core',
            'ngRoute',
            'ngSanitize',
            '$strap.directives',
            'ang-drag-drop',
            'grafana',
            'pasvaz.bindonce',
            'ui.bootstrap',
            'ui.bootstrap.tpls',
            'ui.calendar',
            'ngQuill'
        ];
        var module_types = ['controllers', 'directives', 'factories', 'services', 'filters', 'routes'];
        __WEBPACK_IMPORTED_MODULE_19_lodash___default.a.each(module_types, function (type) {
            var moduleName = 'grafana.' + type;
            _this.useModule(__WEBPACK_IMPORTED_MODULE_17_angular___default.a.module(moduleName, []));
        });
        // makes it possible to add dynamic stuff
        this.useModule(__WEBPACK_IMPORTED_MODULE_21__core_core__["b" /* coreModule */]);
        var preBootRequires = [__webpack_require__.e/* import() */(0).then(__webpack_require__.bind(null, 1171))];
        Promise.all(preBootRequires).then(function () {
            // disable tool tip animation
            __WEBPACK_IMPORTED_MODULE_16_jquery___default.a.fn.tooltip.defaults.animation = false;
            // bootstrap the app
            __WEBPACK_IMPORTED_MODULE_17_angular___default.a.bootstrap(document, _this.ngModuleDependencies).invoke(function () {
                __WEBPACK_IMPORTED_MODULE_19_lodash___default.a.each(_this.preBootModules, function (module) {
                    __WEBPACK_IMPORTED_MODULE_19_lodash___default.a.extend(module, _this.registerFunctions);
                });
                _this.preBootModules = null;
            });
        }).catch(function (err) {
            console.log('Application boot failed:', err);
        });
    };
    return GrafanaApp;
}());

/* harmony default export */ __webpack_exports__["a"] = (new GrafanaApp());


/***/ }),
/* 456 */
/***/ (function(module, exports) {

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2013-01-23
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
  || (navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
  || (function(view) {
  "use strict";
  var
      doc = view.document
      // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
    , get_URL = function() {
      return view.URL || view.webkitURL || view;
    }
    , URL = view.URL || view.webkitURL || view
    , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
    , can_use_save_link =  !view.externalHost && "download" in save_link
    , click = function(node) {
      var event = doc.createEvent("MouseEvents");
      event.initMouseEvent(
        "click", true, false, view, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
      );
      node.dispatchEvent(event);
    }
    , webkit_req_fs = view.webkitRequestFileSystem
    , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
    , throw_outside = function (ex) {
      (view.setImmediate || view.setTimeout)(function() {
        throw ex;
      }, 0);
    }
    , force_saveable_type = "application/octet-stream"
    , fs_min_size = 0
    , deletion_queue = []
    , process_deletion_queue = function() {
      var i = deletion_queue.length;
      while (i--) {
        var file = deletion_queue[i];
        if (typeof file === "string") { // file is an object URL
          URL.revokeObjectURL(file);
        } else { // file is a File
          file.remove();
        }
      }
      deletion_queue.length = 0; // clear queue
    }
    , dispatch = function(filesaver, event_types, event) {
      event_types = [].concat(event_types);
      var i = event_types.length;
      while (i--) {
        var listener = filesaver["on" + event_types[i]];
        if (typeof listener === "function") {
          try {
            listener.call(filesaver, event || filesaver);
          } catch (ex) {
            throw_outside(ex);
          }
        }
      }
    }
    , FileSaver = function(blob, name) {
      // First try a.download, then web filesystem, then object URLs
      var
          filesaver = this
        , type = blob.type
        , blob_changed = false
        , object_url
        , target_view
        , get_object_url = function() {
          var object_url = get_URL().createObjectURL(blob);
          deletion_queue.push(object_url);
          return object_url;
        }
        , dispatch_all = function() {
          dispatch(filesaver, "writestart progress write writeend".split(" "));
        }
        // on any filesys errors revert to saving with object URLs
        , fs_error = function() {
          // don't create more object URLs than needed
          if (blob_changed || !object_url) {
            object_url = get_object_url(blob);
          }
          if (target_view) {
            target_view.location.href = object_url;
          } else {
                        window.open(object_url, "_blank");
                    }
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
        }
        , abortable = function(func) {
          return function() {
            if (filesaver.readyState !== filesaver.DONE) {
              return func.apply(this, arguments);
            }
          };
        }
        , create_if_not_found = {create: true, exclusive: false}
        , slice
      ;
      filesaver.readyState = filesaver.INIT;
      if (!name) {
        name = "download";
      }
      if (can_use_save_link) {
        object_url = get_object_url(blob);
        save_link.href = object_url;
        save_link.download = name;
        click(save_link);
        filesaver.readyState = filesaver.DONE;
        dispatch_all();
        return;
      }
      // Object and web filesystem URLs have a problem saving in Google Chrome when
      // viewed in a tab, so I force save with application/octet-stream
      // http://code.google.com/p/chromium/issues/detail?id=91158
      if (view.chrome && type && type !== force_saveable_type) {
        slice = blob.slice || blob.webkitSlice;
        blob = slice.call(blob, 0, blob.size, force_saveable_type);
        blob_changed = true;
      }
      // Since I can't be sure that the guessed media type will trigger a download
      // in WebKit, I append .download to the filename.
      // https://bugs.webkit.org/show_bug.cgi?id=65440
      if (webkit_req_fs && name !== "download") {
        name += ".download";
      }
      if (type === force_saveable_type || webkit_req_fs) {
        target_view = view;
      }
      if (!req_fs) {
        fs_error();
        return;
      }
      fs_min_size += blob.size;
      req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
        fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
          var save = function() {
            dir.getFile(name, create_if_not_found, abortable(function(file) {
              file.createWriter(abortable(function(writer) {
                writer.onwriteend = function(event) {
                  target_view.location.href = file.toURL();
                  deletion_queue.push(file);
                  filesaver.readyState = filesaver.DONE;
                  dispatch(filesaver, "writeend", event);
                };
                writer.onerror = function() {
                  var error = writer.error;
                  if (error.code !== error.ABORT_ERR) {
                    fs_error();
                  }
                };
                "writestart progress write abort".split(" ").forEach(function(event) {
                  writer["on" + event] = filesaver["on" + event];
                });
                writer.write(blob);
                filesaver.abort = function() {
                  writer.abort();
                  filesaver.readyState = filesaver.DONE;
                };
                filesaver.readyState = filesaver.WRITING;
              }), fs_error);
            }), fs_error);
          };
          dir.getFile(name, {create: false}, abortable(function(file) {
            // delete file if it already exists
            file.remove();
            save();
          }), abortable(function(ex) {
            if (ex.code === ex.NOT_FOUND_ERR) {
              save();
            } else {
              fs_error();
            }
          }));
        }), fs_error);
      }), fs_error);
    }
    , FS_proto = FileSaver.prototype
    , saveAs = function(blob, name) {
      return new FileSaver(blob, name);
    }
  ;
  FS_proto.abort = function() {
    var filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, "abort");
  };
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;

  FS_proto.error =
  FS_proto.onwritestart =
  FS_proto.onprogress =
  FS_proto.onwrite =
  FS_proto.onabort =
  FS_proto.onerror =
  FS_proto.onwriteend =
    null;

  view.addEventListener("unload", process_deletion_queue, false);
  return saveAs;
}(self));

/***/ }),
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_) {
  "use strict";

  return function Settings (options) {
    var defaults = {
      datasources                   : {},
      window_title_prefix           : 'Cloudwiz 智能运维分析 - ',
      panels                        : {},
      new_panel_title: 'Panel Title',
      playlist_timespan: "1m",
      unsaved_changes_warning: true,
      appSubUrl: ""
    };

    return _.extend({}, defaults, options);
  };
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 463 */,
/* 464 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(16),
  __webpack_require__(3),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, _, coreModule) {
  'use strict';

  coreModule.default.directive('annotationTooltip', function($sanitize, dashboardSrv, $compile) {

    function sanitizeString(str) {
      try {
        return $sanitize(str);
      }
      catch(err) {
        console.log('Could not sanitize annotation string, html escaping instead');
        return _.escape(str);
      }
    }

    return {
      link: function (scope, element) {
        var event = scope.event;
        var title = sanitizeString(event.title);
        var dashboard = dashboardSrv.getCurrent();
        var time = '<i>' + dashboard.formatDate(event.min) + '</i>';

        var tooltip = '<div class="graph-annotation">';
        tooltip += '<div class="graph-annotation-title">' + title + "</div>";

        if (event.text) {
          var text = sanitizeString(event.text);
          tooltip += text.replace(/\n/g, '<br>') + '<br>';
        }

        var tags = event.tags;
        if (_.isString(event.tags)) {
          tags = event.tags.split(',');
          if (tags.length === 1) {
            tags = event.tags.split(' ');
          }
        }

        if (tags && tags.length) {
          scope.tags = tags;
          tooltip += '<span class="label label-tag small" ng-repeat="tag in tags" tag-color-from-name="tag">{{tag}}</span><br/>';
        }

        tooltip += '<div class="graph-annotation-time">' + time + '</div>' ;
        tooltip += "</div>";

        var $tooltip = $(tooltip);
        $tooltip.appendTo(element);

        $compile(element.contents())(scope);
      }
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 465 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(3),
  __webpack_require__(16),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_, $, coreModule) {
  'use strict';

  coreModule.default.directive('dashClass', function() {
    return {
      link: function($scope, elem) {

        var lastHideControlsVal;

        $scope.onAppEvent('panel-fullscreen-enter', function() {
          elem.toggleClass('panel-in-fullscreen', true);
        });

        $scope.onAppEvent('panel-fullscreen-exit', function() {
          elem.toggleClass('panel-in-fullscreen', false);
        });

        $scope.$watch('dashboard.hideControls', function() {
          if (!$scope.dashboard) {
            return;
          }

          var hideControls = $scope.dashboard.hideControls || $scope.playlist_active;

          if (lastHideControlsVal !== hideControls) {
            elem.toggleClass('hide-controls', hideControls);
            lastHideControlsVal = hideControls;
          }
        });

        $scope.$watch('playlistSrv', function(newValue) {
          elem.toggleClass('playlist-active', _.isObject(newValue));
        });
      }
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 466 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (coreModule) {
  'use strict';

  coreModule.default.directive('confirmClick', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem.bind('click', function() {
          var message = attrs.confirmation || "Are you sure you want to do that?";
          if (window.confirm(message)) {
            var action = attrs.confirmClick;
            if (action) {
              scope.$apply(scope.$eval(action));
            }
          }
        });
      },
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 467 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(16),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, coreModule) {
  'use strict';

  var editViewMap = {
    'settings':    { src: 'public/app/features/dashboard/partials/settings.html', title: "Settings" },
    'annotations': { src: 'public/app/features/annotations/partials/editor.html', title: "Annotations" },
    'templating':  { src: 'public/app/features/templating/partials/editor.html', title: "Templating" }
  };

  coreModule.default.directive('dashEditorLink', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var partial = attrs.dashEditorLink;

        elem.bind('click',function() {
          $timeout(function() {
            var editorScope = attrs.editorScope === 'isolated' ? null : scope;
            scope.appEvent('show-dash-editor', { src: partial, scope: editorScope });
          });
        });
      }
    };
  });

  coreModule.default.directive('dashEditorView', function($compile, $location) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        var editorScope;
        var lastEditor;

        function hideEditorPane() {
          if (editorScope) {
            scope.appEvent('dash-editor-hidden', lastEditor);
            editorScope.dismiss();
          }
        }

        function showEditorPane(evt, payload, editview) {
          if (editview) {
            scope.contextSrv.editview = editViewMap[editview];
            payload.src = scope.contextSrv.editview.src;
          }

          if (lastEditor === payload.src) {
            hideEditorPane();
            return;
          }

          hideEditorPane();

          lastEditor = payload.src;
          editorScope = payload.scope ? payload.scope.$new() : scope.$new();

          editorScope.dismiss = function() {
            editorScope.$destroy();
            elem.empty();
            lastEditor = null;
            editorScope = null;

            if (editview) {
              var urlParams = $location.search();
              if (editview === urlParams.editview) {
                delete urlParams.editview;
                $location.search(urlParams);
              }
            }
          };

          var src = "'" + payload.src + "'";
          var view = $('<div class="tabbed-view" ng-include="' + src + '"></div>');

          elem.append(view);
          $compile(elem.contents())(editorScope);
        }

        scope.$watch("dashboardViewState.state.editview", function(newValue, oldValue) {
          if (newValue) {
            showEditorPane(null, {}, newValue);
          } else if (oldValue) {
            scope.contextSrv.editview = null;
            if (lastEditor === editViewMap[oldValue]) {
              hideEditorPane();
            }
          }
        });

        scope.contextSrv.editview = null;
        scope.$on("$destroy", hideEditorPane);
        scope.onAppEvent('hide-dash-editor', hideEditorPane);
        scope.onAppEvent('show-dash-editor', showEditorPane);
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 468 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(2),
  __webpack_require__(93),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (coreModule, kbn) {
  'use strict';

  kbn = kbn.default;

  coreModule.default.directive('dashUpload', function(timer, alertSrv, $location) {
    return {
      restrict: 'A',
      link: function(scope) {
        function file_selected(evt) {
          var files = evt.target.files; // FileList object
          var readerOnload = function() {
            return function(e) {
              scope.$apply(function() {
                try {
                  window.grafanaImportDashboard = JSON.parse(e.target.result);
                } catch (err) {
                  console.log(err);
                  scope.appEvent('alert-error', ['导入 失败', 'JSON -> JS Serialization failed: ' + err.message]);
                  return;
                }
                var title = kbn.slugifyForUrl(window.grafanaImportDashboard.title);
                title += new Date().getTime();
                window.grafanaImportDashboard.id = null;
                $location.path('/dashboard-import/' + title);
              });
            };
          };
          for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            reader.onload = (readerOnload)(f);
            reader.readAsText(f);
          }
        }
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          // Something
          document.getElementById('dashupload').addEventListener('change', file_selected, false);
        } else {
          alertSrv.set('非常抱歉','上传失败, 您的浏览器版本过低,请换最新的谷歌浏览器/火狐浏览器','error');
        }
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 469 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(3),
  __webpack_require__(16),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_, $, coreModule) {
  'use strict';

  coreModule.default.directive('dropdownTypeahead', function($compile) {

    var inputTemplate = '<input type="text"'+
      ' class="gf-form-input input-medium tight-form-input"' +
      ' spellcheck="false" style="display:none"></input>';

    var buttonTemplate = '<a  class="gf-form-label tight-form-func dropdown-toggle"' +
      ' tabindex="1" gf-dropdown="menuItems" data-toggle="dropdown"' +
      ' data-placement="top"><i class="fa fa-plus"></i></a>';

    return {
      scope: {
        menuItems: "=dropdownTypeahead",
        dropdownTypeaheadOnSelect: "&dropdownTypeaheadOnSelect",
        model: '=ngModel'
      },
      link: function($scope, elem, attrs) {
        var $input = $(inputTemplate);
        var $button = $(buttonTemplate);
        $input.appendTo(elem);
        $button.appendTo(elem);

        if (attrs.linkText) {
          $button.html(attrs.linkText);
        }

        if (attrs.ngModel) {
          $scope.$watch('model', function(newValue) {
            _.each($scope.menuItems, function(item) {
              _.each(item.submenu, function(subItem) {
                if (subItem.value === newValue) {
                  $button.html(subItem.text);
                }
              });
            });
          });
        }

        var typeaheadValues = _.reduce($scope.menuItems, function(memo, value, index) {
          if (!value.submenu) {
            value.click = 'menuItemSelected(' + index + ')';
            memo.push(value.text);
          } else {
            _.each(value.submenu, function(item, subIndex) {
              item.click = 'menuItemSelected(' + index + ',' + subIndex + ')';
              memo.push(value.text + ' ' + item.text);
            });
          }
          return memo;
        }, []);

        $scope.menuItemSelected = function(index, subIndex) {
          var menuItem = $scope.menuItems[index];
          var payload = {$item: menuItem};
          if (menuItem.submenu && subIndex !== void 0) {
            payload.$subItem = menuItem.submenu[subIndex];
          }
          $scope.dropdownTypeaheadOnSelect(payload);
        };

        $input.attr('data-provide', 'typeahead');
        $input.typeahead({
          source: typeaheadValues,
          minLength: 1,
          items: 10,
          updater: function (value) {
            var result = {};
            _.each($scope.menuItems, function(menuItem) {
              _.each(menuItem.submenu, function(submenuItem) {
                if (value === (menuItem.text + ' ' + submenuItem.text)) {
                  result.$subItem = submenuItem;
                  result.$item = menuItem;
                }
              });
            });

            if (result.$item) {
              $scope.$apply(function() {
                $scope.dropdownTypeaheadOnSelect(result);
              });
            }

            $input.trigger('blur');
            return '';
          }
        });

        $button.click(function() {
          $button.hide();
          $input.show();
          $input.focus();
        });

        $input.keyup(function() {
          elem.toggleClass('open', $input.val() === '');
        });

        $input.blur(function() {
          $input.hide();
          $input.val('');
          $button.show();
          $button.focus();
          // clicking the function dropdown menu wont
          // work if you remove class at once
          setTimeout(function() {
            elem.removeClass('open');
          }, 200);
        });

        $compile(elem.contents())($scope);
      }
    };
  });

  coreModule.default.directive('dropdownTypeahead2', function($compile) {

    var inputTemplate = '<input type="text"'+
      ' class="gf-form-input"' +
      ' spellcheck="false" style="display:none"></input>';

    var buttonTemplate = '<a class="gf-form-input dropdown-toggle"' +
      ' tabindex="1" gf-dropdown="menuItems" data-toggle="dropdown"' +
      ' data-placement="top"><i class="fa fa-plus"></i></a>';

    return {
      scope: {
        menuItems: "=dropdownTypeahead2",
        dropdownTypeaheadOnSelect: "&dropdownTypeaheadOnSelect",
        model: '=ngModel'
      },
      link: function($scope, elem, attrs) {
        var $input = $(inputTemplate);
        var $button = $(buttonTemplate);
        $input.appendTo(elem);
        $button.appendTo(elem);

        if (attrs.linkText) {
          $button.html(attrs.linkText);
        }

        if (attrs.ngModel) {
          $scope.$watch('model', function(newValue) {
            _.each($scope.menuItems, function(item) {
              _.each(item.submenu, function(subItem) {
                if (subItem.value === newValue) {
                  $button.html(subItem.text);
                }
              });
            });
          });
        }

        var typeaheadValues = _.reduce($scope.menuItems, function(memo, value, index) {
          if (!value.submenu) {
            value.click = 'menuItemSelected(' + index + ')';
            memo.push(value.text);
          } else {
            _.each(value.submenu, function(item, subIndex) {
              item.click = 'menuItemSelected(' + index + ',' + subIndex + ')';
              memo.push(value.text + ' ' + item.text);
            });
          }
          return memo;
        }, []);

        $scope.menuItemSelected = function(index, subIndex) {
          var menuItem = $scope.menuItems[index];
          var payload = {$item: menuItem};
          if (menuItem.submenu && subIndex !== void 0) {
            payload.$subItem = menuItem.submenu[subIndex];
          }
          $scope.dropdownTypeaheadOnSelect(payload);
        };

        $input.attr('data-provide', 'typeahead');
        $input.typeahead({
          source: typeaheadValues,
          minLength: 1,
          items: 10,
          updater: function (value) {
            var result = {};
            _.each($scope.menuItems, function(menuItem) {
              _.each(menuItem.submenu, function(submenuItem) {
                if (value === (menuItem.text + ' ' + submenuItem.text)) {
                  result.$subItem = submenuItem;
                  result.$item = menuItem;
                }
              });
            });

            if (result.$item) {
              $scope.$apply(function() {
                $scope.dropdownTypeaheadOnSelect(result);
              });
            }

            $input.trigger('blur');
            return '';
          }
        });

        $button.click(function() {
          $button.hide();
          $input.show();
          $input.focus();
        });

        $input.keyup(function() {
          elem.toggleClass('open', $input.val() === '');
        });

        $input.blur(function() {
          $input.hide();
          $input.val('');
          $button.show();
          $button.focus();
          // clicking the function dropdown menu wont
          // work if you remove class at once
          setTimeout(function() {
            elem.removeClass('open');
          }, 200);
        });

        $compile(elem.contents())($scope);
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 470 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (coreModule) {
  'use strict';

  coreModule.default.directive('grafanaVersionCheck', function($http, contextSrv) {
    return {
      restrict: 'A',
      link: function(scope, elem) {
        if (contextSrv.version === 'master') {
          return;
        }

        $http({ method: 'GET', url: 'https://grafanarel.s3.amazonaws.com/latest.json' })
        .then(function(response) {
          if (!response.data || !response.data.version) {
            return;
          }

          if (contextSrv.version !== response.data.version) {
            elem.append('<i class="icon-info-sign"></i> ' +
                        '<a href="http://grafana.org/download" target="_blank"> ' +
            'New version available: ' + response.data.version +
              '</a>');
          }
        });
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 471 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(3),
  __webpack_require__(16),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (_, $, coreModule) {
  'use strict';

  coreModule.default.directive('metricSegment', function($compile, $sce) {
    var inputTemplate = '<input type="text" data-provide="typeahead" ' +
      ' class="gf-form-input input-medium"' +
      ' spellcheck="false" style="display:none"></input>';

    var linkTemplate = '<a class="gf-form-label" ng-class="segment.cssClass" ' +
      'tabindex="1" give-focus="segment.focus" ng-bind-html="segment.html"></a>';

    var selectTemplate = '<a class="gf-form-input gf-form-input--dropdown" ng-class="segment.cssClass" ' +
      'tabindex="1" give-focus="segment.focus" ng-bind-html="segment.html"></a>';

    return {
      scope: {
        segment: "=",
        getOptions: "&",
        onChange: "&",
      },
      link: function($scope, elem, attrs) {
        var $input = $(inputTemplate);
        var $button = $(attrs.styleMode === 'select' ? selectTemplate : linkTemplate);
        var segment = $scope.segment;
        var options = null;
        var cancelBlur = null;
        var linkMode = true;

        $input.appendTo(elem);
        $button.appendTo(elem);

        $scope.updateVariableValue = function(value) {
          if (value === '' || segment.value === value) {
            return;
          }

          $scope.$apply(function() {
            var selected = _.findWhere($scope.altSegments, { value: value });
            if (selected) {
              segment.value = selected.value;
              segment.html = selected.html;
              segment.fake = false;
              segment.expandable = selected.expandable;
            }
            else if (segment.custom !== 'false') {
              segment.value = value;
              segment.html = $sce.trustAsHtml(value);
              segment.expandable = true;
              segment.fake = false;
            }

            $scope.onChange();
          });
        };

        $scope.switchToLink = function(fromClick) {
          if (linkMode && !fromClick) { return; }

          clearTimeout(cancelBlur);
          cancelBlur = null;
          linkMode = true;
          $input.hide();
          $button.show();
          $scope.updateVariableValue($input.val());
        };

        $scope.inputBlur = function() {
          // happens long before the click event on the typeahead options
          // need to have long delay because the blur
          cancelBlur = setTimeout($scope.switchToLink, 200);
        };

        $scope.source = function(query, callback) {
          if (options) { return options; }

          $scope.$apply(function() {
            $scope.getOptions().then(function(altSegments) {
              $scope.altSegments = altSegments;
              options = _.map($scope.altSegments, function(alt) { return alt.value; });

              // add custom values
              if (segment.custom !== 'false') {
                if (!segment.fake && _.indexOf(options, segment.value) === -1) {
                  options.unshift(segment.value);
                }
              }

              callback(options);
            });
          });
        };

        $scope.updater = function(value) {
          if (value === segment.value) {
            clearTimeout(cancelBlur);
            $input.focus();
            return value;
          }

          $input.val(value);
          $scope.switchToLink(true);

          return value;
        };

        $scope.matcher = function(item) {
          var str = this.query;
          if (str[0] === '/') { str = str.substring(1); }
          if (str[str.length - 1] === '/') { str = str.substring(0, str.length-1); }
          try {
            return item.toLowerCase().match(str);
          } catch(e) {
            return false;
          }
        };

        $input.attr('data-provide', 'typeahead');
        $input.typeahead({ source: $scope.source, minLength: 0, items: 10000, updater: $scope.updater, matcher: $scope.matcher });

        var typeahead = $input.data('typeahead');
        typeahead.lookup = function () {
          this.query = this.$element.val() || '';
          var items = this.source(this.query, $.proxy(this.process, this));
          return items ? this.process(items) : items;
        };

        $button.keydown(function(evt) {
          // trigger typeahead on down arrow or enter key
          if (evt.keyCode === 40 || evt.keyCode === 13) {
            $button.click();
          }
        });

        $button.click(function() {
          options = null;
          $input.css('width', ($button.width() + 16) + 'px');

          $button.hide();
          $input.show();
          $input.focus();

          linkMode = false;

          var typeahead = $input.data('typeahead');
          if (typeahead) {
            $input.val('');
            typeahead.lookup();
          }
        });

        $input.blur($scope.inputBlur);

        $compile(elem.contents())($scope);
      }
    };
  });

  coreModule.default.directive('metricSegmentModel', function(uiSegmentSrv, $q) {
    return {
      template: '<metric-segment segment="segment" get-options="getOptionsInternal()" on-change="onSegmentChange()"></metric-segment>',
      restrict: 'E',
      scope: {
        property: "=",
        options: "=",
        getOptions: "&",
        onChange: "&",
      },
      link: {
        pre: function postLink($scope, elem, attrs) {

          $scope.valueToSegment = function(value) {
            var option = _.findWhere($scope.options, {value: value});
            var segment = {
              cssClass: attrs.cssClass,
              custom: attrs.custom,
              value: option ? option.text : value,
            };
            return uiSegmentSrv.newSegment(segment);
          };

          $scope.getOptionsInternal = function() {
            if ($scope.options) {
              var optionSegments = _.map($scope.options, function(option) {
                return uiSegmentSrv.newSegment({value: option.text});
              });
              return $q.when(optionSegments);
            } else {
              return $scope.getOptions();
            }
          };

          $scope.onSegmentChange = function() {
            if ($scope.options) {
              var option = _.findWhere($scope.options, {text: $scope.segment.value});
              if (option && option.value !== $scope.property) {
                $scope.property = option.value;
              } else if (attrs.custom !== 'false') {
                $scope.property = $scope.segment.value;
              }
            } else {
              $scope.property = $scope.segment.value;
            }

            // needs to call this after digest so
            // property is synced with outerscope
            $scope.$$postDigest(function() {
              $scope.onChange();
            });
          };

          $scope.segment = $scope.valueToSegment($scope.property);
        }
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 472 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
  __webpack_require__(93),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule, kbn) {
  'use strict';

  kbn = kbn.default;

  coreModule.default.directive('tip', function($compile) {
    return {
      restrict: 'E',
      link: function(scope, elem, attrs) {
        var _t = '<i class="grafana-tip fa fa-'+(attrs.icon||'question-circle')+'" bs-tooltip="\''+
          kbn.addslashes(elem.html())+'\'" data-placement=' + (attrs.placement || 'top') + ' html=true></i>';
        _t = _t.replace(/{/g, '\\{').replace(/}/g, '\\}');
        elem.replaceWith($compile(angular.element(_t))(scope));
      }
    };
  });

  coreModule.default.directive('watchChange', function() {
    return {
      scope: { onchange: '&watchChange' },
      link: function(scope, element) {
        element.on('input', function() {
          scope.$apply(function () {
            scope.onchange({ inputValue: element.val() });
          });
        });
      }
    };
  });

  coreModule.default.directive('editorOptBool', function($compile) {
    return {
      restrict: 'E',
      link: function(scope, elem, attrs) {
        var ngchange = attrs.change ? (' ng-change="' + attrs.change + '"') : '';
        var tip = attrs.tip ? (' <tip>' + attrs.tip + '</tip>') : '';
        var showIf = attrs.showIf ? (' ng-show="' + attrs.showIf + '" ') : '';

        var template = '<div class="editor-option gf-form-checkbox text-center"' + showIf + '>' +
          ' <label for="' + attrs.model + '" class="small">' +
          attrs.text + tip + '</label>' +
          '<input class="cr1" id="' + attrs.model + '" type="checkbox" ' +
          '       ng-model="' + attrs.model + '"' + ngchange +
          '       ng-checked="' + attrs.model + '"></input>' +
          ' <label for="' + attrs.model + '" class="cr1"></label>';
        elem.replaceWith($compile(angular.element(template))(scope));
      }
    };
  });

  coreModule.default.directive('editorCheckbox', function($compile, $interpolate) {
    return {
      restrict: 'E',
      link: function(scope, elem, attrs) {
        var text = $interpolate(attrs.text)(scope);
        var model = $interpolate(attrs.model)(scope);
        var ngchange = attrs.change ? (' ng-change="' + attrs.change + '"') : '';
        var tip = attrs.tip ? (' <tip>' + attrs.tip + '</tip>') : '';
        var label = '<label for="' + scope.$id + model + '" class="checkbox-label">' +
          text + tip + '</label>';

        var template =
          '<input class="cr1" id="' + scope.$id + model + '" type="checkbox" ' +
          '       ng-model="' + model + '"' + ngchange +
          '       ng-checked="' + model + '"></input>' +
          ' <label for="' + scope.$id + model + '" class="cr1"></label>';

        template = template + label;
        elem.addClass('gf-form-checkbox');
        elem.html($compile(angular.element(template))(scope));
      }
    };
  });

  coreModule.default.directive('gfDropdown', function ($parse, $compile, $timeout) {
    function buildTemplate(items, placement) {
      var upclass = placement === 'top' ? 'dropup' : '';
      var ul = [
        '<ul class="dropdown-menu ' + upclass + '" role="menu" aria-labelledby="drop1">',
        '</ul>'
      ];

      angular.forEach(items, function (item, index) {
        if (item.divider) {
          return ul.splice(index + 1, 0, '<li class="divider"></li>');
        }

        var li = '<li' + (item.submenu && item.submenu.length ? ' class="dropdown-submenu"' : '') + '>' +
          '<a tabindex="-1" ng-href="' + (item.href || '') + '"' + (item.click ? ' ng-click="' + item.click + '"' : '') +
          (item.target ? ' target="' + item.target + '"' : '') + (item.method ? ' data-method="' + item.method + '"' : '') +
          '>' + (item.text || '') + '</a>';

        if (item.submenu && item.submenu.length) {
          li += buildTemplate(item.submenu).join('\n');
        }

        li += '</li>';
        ul.splice(index + 1, 0, li);
      });
      return ul;
    }

    return {
      restrict: 'EA',
      scope: true,
      link: function postLink(scope, iElement, iAttrs) {
        var getter = $parse(iAttrs.gfDropdown), items = getter(scope);
        $timeout(function () {
          var placement = iElement.data('placement');
          var dropdown = angular.element(buildTemplate(items, placement).join(''));
          dropdown.insertAfter(iElement);
          $compile(iElement.next('ul.dropdown-menu'))(scope);
        });

        iElement.addClass('dropdown-toggle').attr('data-toggle', 'dropdown');
      }
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 473 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(2),
  __webpack_require__(93),
  __webpack_require__(452),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (coreModule, kbn, rangeUtil) {
  'use strict';

  kbn = kbn.default;

  coreModule.default.directive('ngModelOnblur', function() {
    return {
      restrict: 'A',
      priority: 1,
      require: 'ngModel',
      link: function(scope, elm, attr, ngModelCtrl) {
        if (attr.type === 'radio' || attr.type === 'checkbox') {
          return;
        }

        elm.off('input keydown change');
        elm.bind('blur', function() {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(elm.val());
          });
        });
      }
    };
  });

  coreModule.default.directive('emptyToNull', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elm, attrs, ctrl) {
        ctrl.$parsers.push(function (viewValue) {
          if(viewValue === "") { return null; }
          return viewValue;
        });
      }
    };
  });

  coreModule.default.directive('validTimeSpan', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.integer = function(modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return true;
          }
          if (viewValue.indexOf('$') === 0) {
            return true; // allow template variable
          }
          var info = rangeUtil.describeTextRange(viewValue);
          return info.invalid !== true;
        };
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 474 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (coreModule) {
  'use strict';

  coreModule.default.directive('passwordStrength', function() {
    var template = '<div class="password-strength small" ng-if="!loginMode" ng-class="strengthClass">' +
      '<em>{{strengthText}}</em>' +
      '</div>';
    return {
      template: template,
      scope: {
        password: "=",
      },
      link: function($scope) {

        $scope.strengthClass = '';

        function passwordChanged(newValue) {
          if (!newValue) {
            $scope.strengthText = "";
            $scope.strengthClass = "hidden";
            return;
          }
          if (newValue.length < 4) {
            $scope.strengthText = "密码强度:太弱";
            $scope.strengthClass = "password-strength-bad";
            return;
          }
          if (newValue.length <= 8) {
            $scope.strengthText = "密码强度:适中";
            $scope.strengthClass = "password-strength-ok";
            return;
          }

          $scope.strengthText = "密码强度:非常高";
          $scope.strengthClass = "password-strength-good";
        }

        $scope.$watch("password", passwordChanged);
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 475 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
  !(function webpackMissingModule() { var e = new Error("Cannot find module \"spectrum\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule) {
  'use strict';

  coreModule.default.directive('spectrumPicker', function() {
    return {
      restrict: 'E',
      require: 'ngModel',
      scope: false,
      replace: true,
      template: "<span><input class='input-small' /></span>",
      link: function(scope, element, attrs, ngModel) {
        var input = element.find('input');
        var options = angular.extend({
          showAlpha: true,
          showButtons: false,
          color: ngModel.$viewValue,
          change: function(color) {
            scope.$apply(function() {
              ngModel.$setViewValue(color.toRgbString());
            });
          }
        }, scope.$eval(attrs.options));

        ngModel.$render = function() {
          input.spectrum('set', ngModel.$viewValue || '');
        };

        input.spectrum(options);

        scope.$on('$destroy', function() {
          input.spectrum('destroy');
        });
      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 476 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(16),
  __webpack_require__(2),
  !(function webpackMissingModule() { var e = new Error("Cannot find module \"bootstrap-tagsinput\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, $, coreModule) {
  'use strict';

  function djb2(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    return hash;
  }

  function setColor(name, element) {
    var hash = djb2(name.toLowerCase());
    var colors = [
      "#E24D42","#1F78C1","#BA43A9","#705DA0","#466803",
      "#508642","#447EBC","#C15C17","#890F02","#757575",
      "#0A437C","#6D1F62","#584477","#629E51","#2F4F4F",
      "#BF1B00","#806EB7","#8a2eb8", "#699e00","#000000",
      "#3F6833","#2F575E","#99440A","#E0752D","#0E4AB4",
      "#58140C","#052B51","#511749","#3F2B5B",
    ];
    var borderColors = [
      "#FF7368","#459EE7","#E069CF","#9683C6","#6C8E29",
      "#76AC68","#6AA4E2","#E7823D","#AF3528","#9B9B9B",
      "#3069A2","#934588","#7E6A9D","#88C477","#557575",
      "#E54126","#A694DD","#B054DE", "#8FC426","#262626",
      "#658E59","#557D84","#BF6A30","#FF9B53","#3470DA",
      "#7E3A32","#2B5177","#773D6F","#655181",
    ];
    var color = colors[Math.abs(hash % colors.length)];
    var borderColor = borderColors[Math.abs(hash % borderColors.length)];
    element.css("background-color", color);
    element.css("border-color", borderColor);
  }

  coreModule.default.directive('tagColorFromName', function() {
    return {
      scope: { tagColorFromName: "=" },
      link: function (scope, element) {
        setColor(scope.tagColorFromName, element);
      }
    };
  });

  coreModule.default.directive('bootstrapTagsinput', function() {

    function getItemProperty(scope, property) {
      if (!property) {
        return undefined;
      }

      if (angular.isFunction(scope.$parent[property])) {
        return scope.$parent[property];
      }

      return function(item) {
        return item[property];
      };
    }

    return {
      restrict: 'EA',
      scope: {
        model: '=ngModel',
        onTagsUpdated: "&",
      },
      template: '<select multiple></select>',
      replace: false,
      link: function(scope, element, attrs) {

        if (!angular.isArray(scope.model)) {
          scope.model = [];
        }

        var select = $('select', element);

        if (attrs.placeholder) {
          select.attr('placeholder', attrs.placeholder);
        }

        select.tagsinput({
          typeahead: {
            source: angular.isFunction(scope.$parent[attrs.typeaheadSource]) ? scope.$parent[attrs.typeaheadSource] : null
          },
          itemValue: getItemProperty(scope, attrs.itemvalue),
          itemText : getItemProperty(scope, attrs.itemtext),
          tagClass : angular.isFunction(scope.$parent[attrs.tagclass]) ?
            scope.$parent[attrs.tagclass] : function() { return attrs.tagclass; }
        });

        select.on('itemAdded', function(event) {
          if (scope.model.indexOf(event.item) === -1) {
            scope.model.push(event.item);
            if (scope.onTagsUpdated) {
              scope.onTagsUpdated();
            }
          }
          var tagElement = select.next().children("span").filter(function() { return $(this).text() === event.item; });
          setColor(event.item, tagElement);
        });

        select.on('itemRemoved', function(event) {
          var idx = scope.model.indexOf(event.item);
          if (idx !== -1) {
            scope.model.splice(idx, 1);
            if (scope.onTagsUpdated) {
              scope.onTagsUpdated();
            }
          }
        });

        scope.$watch("model", function() {
          if (!angular.isArray(scope.model)) {
            scope.model = [];
          }

          select.tagsinput('removeAll');

          for (var i = 0; i < scope.model.length; i++) {
            select.tagsinput('add', scope.model[i]);
          }

        }, true);
      }
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 477 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
  'use strict';

  coreModule.default.controller('ValueSelectDropdownCtrl', function($q) {
    var vm = this;

    vm.show = function() {
      vm.oldVariableText = vm.variable.current.text;
      vm.highlightIndex = -1;

      vm.options = vm.variable.options;
      vm.selectedValues = _.filter(vm.options, {selected: true});

      vm.tags = _.map(vm.variable.tags, function(value) {
        var tag = { text: value, selected: false };
        _.each(vm.variable.current.tags, function(tagObj) {
          if (tagObj.text === value) {
            tag = tagObj;
          }
        });
        return tag;
      });

      vm.search = {
        query: '',
        options: vm.options.slice(0, Math.min(vm.options.length, 1000))
      };

      vm.dropdownVisible = true;
    };

    vm.updateLinkText = function() {
      var current = vm.variable.current;

      if (current.tags && current.tags.length) {
        // filer out values that are in selected tags
        var selectedAndNotInTag = _.filter(vm.variable.options, function(option) {
          if (!option.selected) { return false; }
          for (var i = 0; i < current.tags.length; i++)  {
            var tag = current.tags[i];
            if (_.indexOf(tag.values, option.value) !== -1) {
              return false;
            }
          }
          return true;
        });

        // convert values to text
        var currentTexts = _.pluck(selectedAndNotInTag, 'text');

        // join texts
        vm.linkText = currentTexts.join(' + ');
        if (vm.linkText.length > 0) {
          vm.linkText += ' + ';
        }
      } else {
        vm.linkText = vm.variable.current.text;
      }
    };

    vm.clearSelections = function() {
      _.each(vm.options, function(option) {
        option.selected = false;
      });

      vm.selectionsChanged(false);
    };

    vm.selectTag = function(tag) {
      tag.selected = !tag.selected;
      var tagValuesPromise;
      if (!tag.values) {
        tagValuesPromise = vm.getValuesForTag({tagKey: tag.text});
      } else {
        tagValuesPromise = $q.when(tag.values);
      }

      tagValuesPromise.then(function(values) {
        tag.values = values;
        tag.valuesText = values.join(' + ');
        _.each(vm.options, function(option) {
          if (_.indexOf(tag.values, option.value) !== -1) {
            option.selected = tag.selected;
          }
        });

        vm.selectionsChanged(false);
      });
    };

    vm.keyDown = function (evt) {
      if (evt.keyCode === 27) {
        vm.hide();
      }
      if (evt.keyCode === 40) {
        vm.moveHighlight(1);
      }
      if (evt.keyCode === 38) {
        vm.moveHighlight(-1);
      }
      if (evt.keyCode === 13) {
        if (vm.search.options.length === 0) {
          vm.commitChanges();
        } else {
          vm.selectValue(vm.search.options[vm.highlightIndex], {}, true, false);
        }
      }
      if (evt.keyCode === 32) {
        vm.selectValue(vm.search.options[vm.highlightIndex], {}, false, false);
      }
    };

    vm.moveHighlight = function(direction) {
      vm.highlightIndex = (vm.highlightIndex + direction) % vm.search.options.length;
    };

    vm.selectValue = function(option, event, commitChange, excludeOthers) {
      if (!option) { return; }

      option.selected = !option.selected;

      commitChange = commitChange || false;
      excludeOthers = excludeOthers || false;

      var setAllExceptCurrentTo = function(newValue) {
        _.each(vm.options, function(other) {
          if (option !== other) { other.selected = newValue; }
        });
      };

      // commit action (enter key), should not deselect it
      if (commitChange) {
        option.selected = true;
      }

      if (option.text === 'All' || excludeOthers) {
        setAllExceptCurrentTo(false);
        commitChange = true;
      }
      else if (!vm.variable.multi) {
        setAllExceptCurrentTo(false);
        commitChange = true;
      } else if (event.ctrlKey || event.metaKey || event.shiftKey) {
        commitChange = true;
        setAllExceptCurrentTo(false);
      }

      vm.selectionsChanged(commitChange);
    };

    vm.selectionsChanged = function(commitChange) {
      vm.selectedValues = _.filter(vm.options, {selected: true});

      if (vm.selectedValues.length > 1) {
        if (vm.selectedValues[0].text === 'All') {
          vm.selectedValues[0].selected = false;
          vm.selectedValues = vm.selectedValues.slice(1, vm.selectedValues.length);
        }
      }

      // validate selected tags
      _.each(vm.tags, function(tag) {
        if (tag.selected)  {
          _.each(tag.values, function(value) {
            if (!_.findWhere(vm.selectedValues, {value: value})) {
              tag.selected = false;
            }
          });
        }
      });

      vm.selectedTags = _.filter(vm.tags, {selected: true});
      vm.variable.current.value = _.pluck(vm.selectedValues, 'value');
      vm.variable.current.text = _.pluck(vm.selectedValues, 'text').join(' + ');
      vm.variable.current.tags = vm.selectedTags;

      if (!vm.variable.multi) {
        vm.variable.current.value = vm.selectedValues[0].value;
      }

      if (commitChange) {
        vm.commitChanges();
      }
    };

    vm.commitChanges = function() {
      // if we have a search query and no options use that
      if (vm.search.options.length === 0 && vm.search.query.length > 0) {
        vm.variable.current = {text: vm.search.query, value: vm.search.query};
      }
      else if (vm.selectedValues.length === 0) {
        // make sure one option is selected
        vm.options[0].selected = true;
        vm.selectionsChanged(false);
      }

      vm.dropdownVisible = false;
      vm.updateLinkText();

      if (vm.variable.current.text !== vm.oldVariableText) {
        vm.onUpdated();
      }
    };

    vm.queryChanged = function() {
      vm.highlightIndex = -1;
      vm.search.options = _.filter(vm.options, function(option) {
        return option.text.toLowerCase().indexOf(vm.search.query.toLowerCase()) !== -1;
      });

      vm.search.options = vm.search.options.slice(0, Math.min(vm.search.options.length, 1000));
    };

    vm.init = function() {
      vm.selectedTags = vm.variable.current.tags || [];
      vm.updateLinkText();
    };

  });

  coreModule.default.directive('valueSelectDropdown', function($compile, $window, $timeout, $rootScope) {
    return {
      scope: { variable: "=", onUpdated: "&", getValuesForTag: "&" },
      templateUrl: 'public/app/partials/valueSelectDropdown.html',
      controller: 'ValueSelectDropdownCtrl',
      controllerAs: 'vm',
      bindToController: true,
      link: function(scope, elem) {
        var bodyEl = angular.element($window.document.body);
        var linkEl = elem.find('.variable-value-link');
        var inputEl = elem.find('input');

        function openDropdown() {
          inputEl.css('width', Math.max(linkEl.width(), 30) + 'px');

          inputEl.show();
          linkEl.hide();

          inputEl.focus();
          $timeout(function() { bodyEl.on('click', bodyOnClick); }, 0, false);
        }

        function switchToLink() {
          inputEl.hide();
          linkEl.show();
          bodyEl.off('click', bodyOnClick);
        }

        function bodyOnClick (e) {
          if (elem.has(e.target).length === 0) {
            scope.$apply(function() {
              scope.vm.commitChanges();
            });
          }
        }

        scope.$watch('vm.dropdownVisible', function(newValue) {
          if (newValue) {
            openDropdown();
          } else {
            switchToLink();
          }
        });

        var cleanUp = $rootScope.$on('template-variable-value-updated', function() {
          scope.vm.updateLinkText();
        });

        scope.$on("$destroy", function() {
          cleanUp();
        });

        scope.vm.init();
      },
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 478 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_plugins_panel_unknown_module__ = __webpack_require__(479);
///<reference path="../../headers/common.d.ts" />





/** @ngInject **/
function pluginDirectiveLoader($compile, datasourceSrv, $rootScope, $q, $http, $templateCache) {
    function getTemplate(component) {
        if (component.template) {
            return $q.when(component.template);
        }
        var cached = $templateCache.get(component.templateUrl);
        if (cached) {
            return $q.when(cached);
        }
        return $http.get(component.templateUrl).then(function (res) {
            return res.data;
        });
    }
    function relativeTemplateUrlToAbs(templateUrl, baseUrl) {
        if (!templateUrl) {
            return undefined;
        }
        if (templateUrl.indexOf('public') === 0) {
            return templateUrl;
        }
        return baseUrl + '/' + templateUrl;
    }
    function getPluginComponentDirective(options) {
        // handle relative template urls for plugin templates
        options.Component.templateUrl = relativeTemplateUrlToAbs(options.Component.templateUrl, options.baseUrl);
        return function () {
            return {
                templateUrl: options.Component.templateUrl,
                template: options.Component.template,
                restrict: 'E',
                controller: options.Component,
                controllerAs: 'ctrl',
                bindToController: true,
                scope: options.bindings,
                link: function (scope, elem, attrs, ctrl) {
                    if (ctrl.link) {
                        ctrl.link(scope, elem, attrs, ctrl);
                    }
                    if (ctrl.init) {
                        ctrl.init();
                    }
                }
            };
        };
    }
    function loadPanelComponentInfo(scope, attrs) {
        var componentInfo = {
            name: 'panel-plugin-' + scope.panel.type,
            bindings: { dashboard: "=", panel: "=", row: "=" },
            attrs: { dashboard: "dashboard", panel: "panel", row: "row" },
        };
        var panelElemName = 'panel-' + scope.panel.type;
        var panelInfo = __WEBPACK_IMPORTED_MODULE_2_app_core_config___default.a.panels[scope.panel.type];
        var panelCtrlPromise = Promise.resolve(__WEBPACK_IMPORTED_MODULE_4_app_plugins_panel_unknown_module__["a" /* UnknownPanelCtrl */]);
        if (panelInfo) {
            panelCtrlPromise = __webpack_require__(52)(panelInfo.module).then(function (panelModule) {
                return panelModule.PanelCtrl;
            });
        }
        return panelCtrlPromise.then(function (PanelCtrl) {
            componentInfo.Component = PanelCtrl;
            if (!PanelCtrl || PanelCtrl.registered) {
                return componentInfo;
            }
            ;
            if (PanelCtrl.templatePromise) {
                return PanelCtrl.templatePromise.then(function (res) {
                    return componentInfo;
                });
            }
            if (panelInfo) {
                PanelCtrl.templateUrl = relativeTemplateUrlToAbs(PanelCtrl.templateUrl, panelInfo.baseUrl);
            }
            PanelCtrl.templatePromise = getTemplate(PanelCtrl).then(function (template) {
                PanelCtrl.templateUrl = null;
                PanelCtrl.template = "<grafana-panel ctrl=\"ctrl\">" + template + "</grafana-panel>";
                return componentInfo;
            });
            return PanelCtrl.templatePromise;
        });
    }
    function getModule(scope, attrs) {
        switch (attrs.type) {
            // QueryCtrl
            case "query-ctrl": {
                var datasource = scope.target.datasource || scope.ctrl.panel.datasource;
                return datasourceSrv.get(datasource).then(function (ds) {
                    scope.datasource = ds;
                    return __webpack_require__(52)(ds.meta.module).then(function (dsModule) {
                        return {
                            baseUrl: ds.meta.baseUrl,
                            name: 'query-ctrl-' + ds.meta.id,
                            bindings: { target: "=", panelCtrl: "=", datasource: "=" },
                            attrs: { "target": "target", "panel-ctrl": "ctrl", datasource: "datasource" },
                            Component: dsModule.QueryCtrl
                        };
                    });
                });
            }
            // QueryOptionsCtrl
            case "query-options-ctrl": {
                return datasourceSrv.get(scope.ctrl.panel.datasource).then(function (ds) {
                    return __webpack_require__(52)(ds.meta.module).then(function (dsModule) {
                        if (!dsModule.QueryOptionsCtrl) {
                            return { notFound: true };
                        }
                        return {
                            baseUrl: ds.meta.baseUrl,
                            name: 'query-options-ctrl-' + ds.meta.id,
                            bindings: { panelCtrl: "=" },
                            attrs: { "panel-ctrl": "ctrl" },
                            Component: dsModule.QueryOptionsCtrl
                        };
                    });
                });
            }
            // Annotations
            case "annotations-query-ctrl": {
                return __webpack_require__(52)(scope.ctrl.currentDatasource.meta.module).then(function (dsModule) {
                    return {
                        baseUrl: scope.ctrl.currentDatasource.meta.baseUrl,
                        name: 'annotations-query-ctrl-' + scope.ctrl.currentDatasource.meta.id,
                        bindings: { annotation: "=", datasource: "=" },
                        attrs: { "annotation": "ctrl.currentAnnotation", datasource: "ctrl.currentDatasource" },
                        Component: dsModule.AnnotationsQueryCtrl,
                    };
                });
            }
            // Datasource ConfigCtrl
            case 'datasource-config-ctrl': {
                var dsMeta = scope.ctrl.datasourceMeta;
                return __webpack_require__(52)(dsMeta.module).then(function (dsModule) {
                    if (!dsModule.ConfigCtrl) {
                        return { notFound: true };
                    }
                    return {
                        baseUrl: dsMeta.baseUrl,
                        name: 'ds-config-' + dsMeta.id,
                        bindings: { meta: "=", current: "=" },
                        attrs: { meta: "ctrl.datasourceMeta", current: "ctrl.current" },
                        Component: dsModule.ConfigCtrl,
                    };
                });
            }
            // AppConfigCtrl
            case 'app-config-ctrl': {
                var model_1 = scope.ctrl.model;
                return __webpack_require__(52)(model_1.module).then(function (appModule) {
                    return {
                        baseUrl: model_1.baseUrl,
                        name: 'app-config-' + model_1.id,
                        bindings: { appModel: "=", appEditCtrl: "=" },
                        attrs: { "app-model": "ctrl.model", "app-edit-ctrl": "ctrl" },
                        Component: appModule.ConfigCtrl,
                    };
                });
            }
            // App Page
            case 'app-page': {
                var appModel_1 = scope.ctrl.appModel;
                return __webpack_require__(52)(appModel_1.module).then(function (appModule) {
                    return {
                        baseUrl: appModel_1.baseUrl,
                        name: 'app-page-' + appModel_1.appId + '-' + scope.ctrl.page.slug,
                        bindings: { appModel: "=" },
                        attrs: { "app-model": "ctrl.appModel" },
                        Component: appModule[scope.ctrl.page.component],
                    };
                });
            }
            // Panel
            case 'panel': {
                return loadPanelComponentInfo(scope, attrs);
            }
            default: {
                return $q.reject({ message: "Could not find component type: " + attrs.type });
            }
        }
    }
    function appendAndCompile(scope, elem, componentInfo) {
        var child = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element(document.createElement(componentInfo.name));
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(componentInfo.attrs, function (value, key) {
            child.attr(key, value);
        });
        $compile(child)(scope);
        elem.empty();
        // let a binding digest cycle complete before adding to dom
        setTimeout(function () {
            elem.append(child);
            scope.$apply(function () {
                scope.$broadcast('refresh');
            });
        });
    }
    function registerPluginComponent(scope, elem, attrs, componentInfo) {
        if (componentInfo.notFound) {
            elem.empty();
            return;
        }
        if (!componentInfo.Component) {
            throw { message: 'Failed to find exported plugin component for ' + componentInfo.name };
        }
        if (!componentInfo.Component.registered) {
            var directiveName = attrs.$normalize(componentInfo.name);
            var directiveFn = getPluginComponentDirective(componentInfo);
            __WEBPACK_IMPORTED_MODULE_3_app_core_core_module__["default"].directive(directiveName, directiveFn);
            componentInfo.Component.registered = true;
        }
        appendAndCompile(scope, elem, componentInfo);
    }
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            getModule(scope, attrs).then(function (componentInfo) {
                registerPluginComponent(scope, elem, attrs, componentInfo);
            }).catch(function (err) {
                $rootScope.appEvent('alert-error', ['Plugin Error', err.message || err]);
                console.log('Plugin componnet error', err);
            });
        }
    };
}
__WEBPACK_IMPORTED_MODULE_3_app_core_core_module__["default"].directive('pluginComponent', pluginDirectiveLoader);


/***/ }),
/* 479 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UnknownPanelCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_plugins_sdk__ = __webpack_require__(480);
///<reference path="../../../headers/common.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var UnknownPanelCtrl = /** @class */ (function (_super) {
    __extends(UnknownPanelCtrl, _super);
    /** @ngInject */
    function UnknownPanelCtrl($scope, $injector) {
        return _super.call(this, $scope, $injector) || this;
    }
    UnknownPanelCtrl.templateUrl = 'public/app/plugins/panel/unknown/module.html';
    return UnknownPanelCtrl;
}(__WEBPACK_IMPORTED_MODULE_0_app_plugins_sdk__["a" /* PanelCtrl */]));



/***/ }),
/* 480 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadPluginCss */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_features_panel_panel_ctrl__ = __webpack_require__(481);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_features_panel_metrics_panel_ctrl__ = __webpack_require__(482);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_features_panel_metrics_panel_ctrl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_app_features_panel_metrics_panel_ctrl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_features_panel_query_ctrl__ = __webpack_require__(453);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_app_core_config__);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0_app_features_panel_panel_ctrl__["a"]; });
/* unused harmony reexport MetricsPanelCtrl */
/* unused harmony reexport QueryCtrl */




function loadPluginCss(options) {
    if (__WEBPACK_IMPORTED_MODULE_3_app_core_config___default.a.bootData.user.userTheme) {
        __webpack_require__(324)(options[config.bootData.user.userTheme] + '!css');
    }
    else {
        __webpack_require__(324)(options.light + '!css');
    }
}



/***/ }),
/* 481 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PanelCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_app_core_core__ = __webpack_require__(200);
///<reference path="../../headers/common.d.ts" />




var TITLE_HEIGHT = 25;
var EMPTY_TITLE_HEIGHT = 9;
var PANEL_PADDING = 5;

var PanelCtrl = /** @class */ (function () {
    function PanelCtrl($scope, $injector) {
        var _this = this;
        this.$injector = $injector;
        this.$scope = $scope;
        this.$_location = $injector.get('$location');
        this.$timeout = $injector.get('$timeout');
        this.contextSrv = $injector.get('contextSrv');
        this.integrateSrv = $injector.get('integrateSrv');
        this.associationSrv = $injector.get('associationSrv');
        this.$translate = $injector.get('$translate');
        this.editorTabIndex = 0;
        this.events = new __WEBPACK_IMPORTED_MODULE_4_app_core_core__["a" /* Emitter */]();
        var plugin = __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.panels[this.panel.type];
        if (plugin) {
            this.pluginId = plugin.id;
            this.pluginName = plugin.name;
        }
        $scope.$on("refresh", function (event, payload) { return _this.refresh(payload); });
        $scope.$on("render", function () { return _this.render(); });
        $scope.$on("$destroy", function () { return _this.events.emit('panel-teardown'); });
    }
    PanelCtrl.prototype.init = function () {
        this.calculatePanelHeight();
        this.publishAppEvent('panel-initialized', { scope: this.$scope });
        this.events.emit('panel-initialized');
    };
    PanelCtrl.prototype.renderingCompleted = function () {
        this.$scope.$root.performance.panelsRendered++;
    };
    PanelCtrl.prototype.refresh = function (payload) {
        // ignore if panel id is specified
        if (this.specifiedPanelId(payload)) {
            return;
        }
        this.events.emit('refresh', payload);
    };
    PanelCtrl.prototype.publishAppEvent = function (evtName, evt) {
        this.$scope.$root.appEvent(evtName, evt);
    };
    PanelCtrl.prototype.changeView = function (fullscreen, edit) {
        this.publishAppEvent('panel-change-view', {
            fullscreen: fullscreen, edit: edit, panelId: this.panel.id
        });
    };
    PanelCtrl.prototype.viewPanel = function () {
        this.changeView(true, false);
    };
    PanelCtrl.prototype.editPanel = function () {
        this.changeView(true, true);
    };
    PanelCtrl.prototype.exitFullscreen = function () {
        this.changeView(false, false);
    };
    PanelCtrl.prototype.initEditMode = function () {
        this.editorTabs = [];
        this.addEditorTab(this.$translate.i18n.i18n_general, 'public/app/partials/panelgeneral.html');
        this.editModeInitiated = true;
        this.events.emit('init-edit-mode', null);
    };
    PanelCtrl.prototype.addEditorTab = function (title, directiveFn, index) {
        var editorTab = { title: title, directiveFn: directiveFn };
        if (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isString(directiveFn)) {
            editorTab.directiveFn = function () {
                return { templateUrl: directiveFn };
            };
        }
        if (index) {
            this.editorTabs.splice(index, 0, editorTab);
        }
        else {
            this.editorTabs.push(editorTab);
        }
    };
    PanelCtrl.prototype.getMenu = function () {
        var menu = [];
        menu.push({ text: this.$translate.i18n.i18n_enlarge, click: 'ctrl.updateColumnSpan(1); dismiss();', role: 'Editor', icon: 'fa-plus', hover: 'hover-show pull-left' });
        menu.push({ text: this.$translate.i18n.i18n_narrow, click: 'ctrl.updateColumnSpan(-1); dismiss();', role: 'Editor', icon: 'fa-minus', hover: 'hover-show pull-left' });
        menu.push({ text: this.$translate.i18n.i18n_delete, click: 'ctrl.removePanel(); dismiss();', role: 'Editor', icon: 'fa-trash-o', hover: 'hover-show  pull-left' });
        menu.push({ text: this.$translate.i18n.i18n_share, click: 'ctrl.sharePanel(); dismiss();', role: 'Editor', icon: 'fa-external-link' });
        menu.push({ text: this.$translate.i18n.i18n_edit, click: 'ctrl.editPanel(); dismiss();', role: 'Editor', icon: 'fa-pencil' });
        if (this.checkMenu('association')) {
            menu.push({ text: this.$translate.i18n.page_association_title, click: 'ctrl.associateLink();', icon: 'fa-line-chart' });
        }
        if (this.checkMenu('correlation')) {
            menu.push({ text: this.$translate.i18n.page_association_info5, click: 'ctrl.correlation();', icon: 'fa-clock-o' });
        }
        return menu;
    };
    PanelCtrl.prototype.checkMenu = function (menu) {
        var pathname = window.location.pathname;
        var show = false;
        var isGraph = this.panel.type === 'graph';
        var isLine = this.panel.lines;
        switch (menu) {
            case 'association':
                show = /^\/anomaly/.test(pathname);
                break;
            case 'list':
                show = !/^\/(association|anomaly|alert|logs)/.test(pathname);
                break;
            case 'correlation':
                show = /^\/association/.test(pathname);
        }
        return show && isGraph && isLine;
    };
    PanelCtrl.prototype.getExtendedMenu = function () {
        var actions = [];
        if (!this.fullscreen) {
            actions.push({ text: this.$translate.i18n.i18n_copy, click: 'ctrl.duplicate(); dismiss();', role: 'Editor' });
        }
        actions.push({ text: this.$translate.i18n.i18n_query, click: 'ctrl.viewPanel(); dismiss();', icon: 'icon-eye-open' });
        actions.push({ text: this.$translate.i18n.i18n_view_json, click: 'ctrl.editPanelJson(); dismiss();', role: 'Editor' });
        this.events.emit('init-panel-actions', actions);
        return actions;
    };
    PanelCtrl.prototype.otherPanelInFullscreenMode = function () {
        return this.dashboard.meta.fullscreen && !this.fullscreen;
    };
    PanelCtrl.prototype.specifiedPanelId = function (payload) {
        if (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isNumber(payload) || __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isString(payload)) {
            return this.panel.id !== payload;
        }
        if (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isArray(payload)) {
            return !~payload.indexOf(this.panel.id);
        }
        return false;
    };
    PanelCtrl.prototype.calculatePanelHeight = function () {
        if (this.fullscreen) {
            var docHeight = __WEBPACK_IMPORTED_MODULE_3_jquery___default()(window).height();
            var editHeight = Math.floor(docHeight * 0.3);
            var fullscreenHeight = Math.floor(docHeight * 0.7);
            this.containerHeight = this.editMode ? editHeight : fullscreenHeight;
        }
        else {
            this.containerHeight = this.panel.height || this.row.height;
            if (__WEBPACK_IMPORTED_MODULE_1_lodash___default.a.isString(this.containerHeight)) {
                this.containerHeight = parseInt(this.containerHeight.replace('px', ''), 10);
            }
        }
        this.height = this.containerHeight - (PANEL_PADDING + (this.panel.title ? TITLE_HEIGHT : EMPTY_TITLE_HEIGHT));
    };
    PanelCtrl.prototype.render = function (payload) {
        // ignore if other panel is in fullscreen mode
        if (this.otherPanelInFullscreenMode()) {
            return;
        }
        this.calculatePanelHeight();
        this.events.emit('render', payload);
    };
    PanelCtrl.prototype.toggleEditorHelp = function (index) {
        if (this.editorHelpIndex === index) {
            this.editorHelpIndex = null;
            return;
        }
        this.editorHelpIndex = index;
    };
    PanelCtrl.prototype.duplicate = function () {
        this.dashboard.duplicatePanel(this.panel, this.row);
    };
    PanelCtrl.prototype.updateColumnSpan = function (span) {
        var _this = this;
        this.panel.span = Math.min(Math.max(Math.floor(this.panel.span + span), 1), 12);
        this.$timeout(function () {
            _this.render();
        });
    };
    PanelCtrl.prototype.removePanel = function () {
        var _this = this;
        this.publishAppEvent('confirm-modal', {
            title: this.$translate.i18n.i18n_sure_operator,
            text: this.$translate.i18n.i18n_sure_operator,
            icon: 'fa-trash',
            yesText: this.$translate.i18n.i18n_delete,
            noText: this.$translate.i18n.i18n_cancel,
            onConfirm: function () {
                _this.row.panels = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.without(_this.row.panels, _this.panel);
            }
        });
    };
    PanelCtrl.prototype.editPanelJson = function () {
        this.publishAppEvent('show-json-editor', {
            object: this.panel,
            updateHandler: this.replacePanel.bind(this)
        });
    };
    PanelCtrl.prototype.replacePanel = function (newPanel, oldPanel) {
        var _this = this;
        var row = this.row;
        var index = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.indexOf(this.row.panels, oldPanel);
        this.row.panels.splice(index, 1);
        // adding it back needs to be done in next digest
        this.$timeout(function () {
            newPanel.id = oldPanel.id;
            newPanel.span = oldPanel.span;
            _this.row.panels.splice(index, 0, newPanel);
        });
    };
    PanelCtrl.prototype.sharePanel = function () {
        var shareScope = this.$scope.$new();
        shareScope.panel = this.panel;
        shareScope.dashboard = this.dashboard;
        this.publishAppEvent('show-modal', {
            src: 'public/app/features/dashboard/partials/shareModal.html',
            scope: shareScope
        });
    };
    PanelCtrl.prototype.openInspector = function () {
        var modalScope = this.$scope.$new();
        modalScope.panel = this.panel;
        modalScope.dashboard = this.dashboard;
        modalScope.inspector = __WEBPACK_IMPORTED_MODULE_2_angular___default.a.copy(this.inspector);
        this.publishAppEvent('show-modal', {
            src: 'public/app/partials/inspector.html',
            scope: modalScope
        });
    };
    PanelCtrl.prototype.associateLink = function () {
        try {
            var host = this.panel.targets[0].tags.host;
            var metric = this.panel.targets[0].metric;
            if (host && metric) {
                this.associationSrv.setSourceAssociation({
                    metric: metric,
                    host: host,
                    distance: 200,
                });
                this.$_location.url("/association");
            }
        }
        catch (err) {
            var reg = /\'(.*?)\'/g;
            var msg = this.$translate.i18n.i18n_param_miss + ": " + err.toString().match(reg)[0];
            this.publishAppEvent('alert-warning', [this.$translate.i18n.i18n_param_miss, msg]);
        }
    };
    PanelCtrl.prototype.getDownsamplesMenu = function () {
        var downsamples = [];
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(this.panel.downsamples, function (downsample) {
            downsamples.push({ text: downsample, click: 'ctrl.setDownsample(\'' + downsample + '\');dismiss();' });
        });
        return downsamples;
    };
    PanelCtrl.prototype.setDownsample = function (interval) {
        var _this = this;
        this.panel.downsample = interval;
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.each(this.panel.targets, function (target) {
            target.downsampleInterval = interval;
        });
        this.$timeout(function () {
            _this.$scope.$broadcast('refresh', _this.panel.id);
        });
    };
    PanelCtrl.prototype.correlation = function () {
        this.$scope.$emit('analysis', 'updateTime');
    };
    return PanelCtrl;
}());



/***/ }),
/* 482 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),
/* 483 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


function getBlockNodes(nodes) {
    var node = nodes[0];
    var endNode = nodes[nodes.length - 1];
    var blockNodes;
    for (var i = 1; node !== endNode && (node = node.nextSibling); i++) {
        if (blockNodes || nodes[i] !== node) {
            if (!blockNodes) {
                blockNodes = __WEBPACK_IMPORTED_MODULE_0_jquery___default()([].slice.call(nodes, 0, i));
            }
            blockNodes.push(node);
        }
    }
    return blockNodes || nodes;
}
function rebuildOnChange($animate) {
    return {
        multiElement: true,
        terminal: true,
        transclude: true,
        priority: 600,
        restrict: 'E',
        link: function (scope, elem, attrs, ctrl, transclude) {
            var block, childScope, previousElements;
            function cleanUp() {
                if (previousElements) {
                    previousElements.remove();
                    previousElements = null;
                }
                if (childScope) {
                    childScope.$destroy();
                    childScope = null;
                }
                if (block) {
                    previousElements = getBlockNodes(block.clone);
                    $animate.leave(previousElements).then(function () {
                        previousElements = null;
                    });
                    block = null;
                }
            }
            scope.$watch(attrs.property, function rebuildOnChangeAction(value, oldValue) {
                if (childScope && value !== oldValue) {
                    cleanUp();
                }
                if (!childScope && (value || attrs.showNull)) {
                    transclude(function (clone, newScope) {
                        childScope = newScope;
                        clone[clone.length++] = document.createComment(' end rebuild on change ');
                        block = { clone: clone };
                        $animate.enter(clone, elem.parent(), elem);
                    });
                }
                else {
                    cleanUp();
                }
            });
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1__core_module__["default"].directive('rebuildOnChange', rebuildOnChange);


/***/ }),
/* 484 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

__WEBPACK_IMPORTED_MODULE_0__core_module__["default"].directive('giveFocus', function () {
    return function (scope, element, attrs) {
        element.click(function (e) {
            e.stopPropagation();
        });
        scope.$watch(attrs.giveFocus, function (newValue) {
            if (!newValue) {
                return;
            }
            setTimeout(function () {
                element.focus();
                var domEl = element[0];
                if (domEl.setSelectionRange) {
                    var pos = element.val().length * 2;
                    domEl.setSelectionRange(pos, pos);
                }
            }, 200);
        }, true);
    };
});
/* unused harmony default export */ var _unused_webpack_default_export = ({});


/***/ }),
/* 485 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(16), __webpack_require__(7), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, angular, _) {
  'use strict';

  var $win = $(window);

  $.fn.place_tt = (function () {
    var defaults = {
      offset: 5,
    };

    return function (x, y, opts) {
      opts = $.extend(true, {}, defaults, opts);

      return this.each(function () {
        var $tooltip = $(this), width, height;

        $tooltip.addClass('grafana-tooltip');

        $("#tooltip").remove();
        $tooltip.appendTo(document.body);

        if (opts.compile) {
          angular.element(document).injector().invoke(["$compile", "$rootScope", function($compile, $rootScope) {
            var tmpScope = $rootScope.$new(true);
            _.extend(tmpScope, opts.scopeData);

            $compile($tooltip)(tmpScope);
            tmpScope.$digest();
            tmpScope.$destroy();
          }]);
        }

        width = $tooltip.outerWidth(true);
        height = $tooltip.outerHeight(true);

        $tooltip.css('left', x + opts.offset + width > $win.width() ? x - opts.offset - width : x + opts.offset);
        $tooltip.css('top', y + opts.offset + height > $win.height() ? y - opts.offset - height : y + opts.offset);
      });
    };
  })();

  $.escapeSelector = function (selector) {
    return selector.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
  };

  return $;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 486 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 487 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_core_module__ = __webpack_require__(2);
throw new Error("Cannot find module \"jquery.flot\"");
throw new Error("Cannot find module \"jquery.flot.pie\"");





function systemPanel($parse, alertMgrSrv, healthSrv, datasourceSrv, contextSrv, backendSrv, $location, $q) {
    return {
        restrict: 'E',
        link: function (scope, elem, attr) {
            scope.enter = function (systemId) {
                contextSrv.user.systemId = systemId;
                contextSrv.hostNum = scope.hostList.length;
                backendSrv.post("/api/system/pick", { SystemId: systemId });
                if (contextSrv.hostNum) {
                    contextSrv.toggleSideMenu();
                    $location.url("/");
                }
                else {
                    $location.url("/setting/agent");
                }
            };
            scope.init = function () {
                scope.servies = [];
                scope.serviesStatus = { normal: 0, unnormal: 0 };
                scope.hostList = [];
                scope.hostStatus = { normal: 0, unnormal: 0 };
                scope.critical = 0;
                scope.warn = 0;
                scope.alertNum = 0;
            };
            var getter = $parse(attr.sys), system = getter(scope);
            contextSrv.user.systemId = system;
            var setPie = function (type, system, pieData) {
                if (pieData.length > 1) {
                    var colors = ['rgb(61,183,121)', 'rgb(255,197,58)', 'rgb(224,76,65)'];
                }
                else {
                    var colors = ['#555'];
                }
                __WEBPACK_IMPORTED_MODULE_0_jquery___default.a.plot("[" + type + "='" + system + "']", pieData, {
                    series: {
                        pie: {
                            innerRadius: 0.5,
                            show: true,
                            label: {
                                show: false,
                            },
                            stroke: {
                                width: 0
                            }
                        }
                    },
                    legend: {
                        show: false
                    },
                    colors: colors
                });
            };
            var getPlatform = function () {
                backendSrv.get('/api/static/hosts').then(function (result) {
                    scope.platform = result.hosts;
                });
            };
            //------get service satatus
            var getService = backendSrv.getServices().then(function (response) {
                var count = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.countBy(response.data, { alive: 0 });
                scope.serviesStatus.normal = count.true || 0;
                scope.serviesStatus.unnormal = count.false || 0;
                scope.servies = response.data;
            });
            //------- get Alerts status
            var getAlertNum = alertMgrSrv.load().then(function (response) {
                return response.data.length;
            });
            var getAlertStatus = alertMgrSrv.loadTriggeredAlerts().then(function onSuccess(response) {
                var count = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.countBy(response.data, { level: 'CRITICAL' });
                return { critical: count.true || 0, warn: count.false || 0 };
            });
            //------- get health/anomaly status
            var getHealth = healthSrv.load().then(function (data) {
                scope.numMetrics = data.numMetrics;
                scope.numAnomalyMetrics = data.numAnomalyMetrics;
                scope.health = data.health;
                var annomalyPieData = [
                    { label: "", data: scope.numMetrics },
                    { label: "", data: scope.numAnomalyMetrics },
                ];
                setPie('sys_annomaly', system, annomalyPieData);
            });
            //-------- get host status
            var query = {
                "queries": [
                    {
                        "metric": "collector.state"
                    }
                ],
                "hostProperties": []
            };
            var getHostStatus = backendSrv.getHosts(query).then(function (response) {
                if (response.data.length) {
                    scope.hostList = response.data;
                    var count = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.countBy(scope.hostList, { "collector.state": 0 });
                    scope.hostStatus.unnormal = count.false || 0;
                    scope.hostStatus.normal = count.true || 0;
                    return scope.hostList.length;
                }
                else {
                    var d = $q.defer();
                    d.resolve();
                    return d.promise;
                }
            }, function () {
                getPlatform();
            });
            //------- alertNum = alertRules * hostNum;
            $q.all([getHostStatus, getAlertNum, getAlertStatus]).then(function (result) {
                var hostNum = result[0], alertRulesNum = result[1], alertStatus = result[2];
                if (typeof (hostNum) === "undefined") {
                    getPlatform();
                }
                else {
                    scope.alertNum = alertRulesNum * hostNum;
                    scope.warn = alertStatus.warn;
                    scope.critical = alertStatus.critical;
                    var alertPieData = [
                        { label: "", data: (scope.alertNum ? scope.alertNum : 1) - scope.warn - scope.critical },
                        { label: "", data: scope.warn },
                        { label: "", data: scope.critical }
                    ];
                    setPie('sys_alert', system, alertPieData);
                }
            }, function () {
                getPlatform();
            });
            scope.init();
        }
    };
}
__WEBPACK_IMPORTED_MODULE_2_app_core_core_module__["default"].directive('systemPanel', systemPanel);


/***/ }),
/* 488 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(16),
    __webpack_require__(3),
    __webpack_require__(2)
  ], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, _, coreModule) {
    'use strict';

    coreModule.default.directive('node', function(jsPlumbFactory) {
      return jsPlumbFactory.node({
        templateUrl: "node_template.tpl",
        inherit:["remove", "edit"]
      });
    });

    // coreModule.directive('group', function(jsPlumbFactory) {
    //   return jsPlumbFactory.group({
    //     templateUrl: "group_template.tpl",
    //     inherit:["remove", "toggleGroup"]
    //   });
    // });
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 489 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(16),
  __webpack_require__(3),
  __webpack_require__(2)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, _, coreModule) {
  'use strict';

  coreModule.default.directive('logTabpane', function ($parse, $compile, $http) {
    return {
      restrict: 'EA',
      link: function (scope, elem, attr) {
        var templateUrl = attr.template;

        var template = $http.get(templateUrl, { cache: true }).then(function (res) {
          return res.data;
        });

        template.then(function (response) {
          var $template = $(response);
          elem.html($template);

          $compile(elem.contents())(scope);
        });

        scope.$on('log-refresh', function () {
          template.then(function (response) {
            var $template = $(response);
            elem.html($template);

            $compile(elem.contents())(scope);
          });
        });

      }
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 490 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),
/* 491 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_core_module__ = __webpack_require__(2);



var template = "\n<div class=\"load-wrapper\">\n  <div class=\"load\">\n    <div class=\"ring\">\n      <div class=\"ball-holder\">\n        <div class=\"ball\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n";
function cwLoading($compile, $timeout) {
    return {
        multiElement: true,
        scope: true,
        restrict: 'EA',
        link: function ($scope, elem, attrs) {
            var $loading = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(template);
            var duration = parseInt(attrs.duration);
            function show() {
                $loading.appendTo(elem);
                $compile(elem.contents())($scope);
            }
            function hide() {
                $loading.remove();
            }
            $scope.$watch(attrs.show, function (newValue, oldValue) {
                if (__WEBPACK_IMPORTED_MODULE_0_angular___default.a.isString(newValue)) {
                    newValue = !!newValue.match(/true|,?(show),?/i);
                }
                if (newValue === true) {
                    show();
                    if (!isNaN(duration)) {
                        $timeout(hide, duration);
                    }
                }
                else {
                    hide();
                }
            });
        }
    };
}
__WEBPACK_IMPORTED_MODULE_2_app_core_core_module__["default"].directive('cwLoading', cwLoading);


/***/ }),
/* 492 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_module__ = __webpack_require__(2);

__WEBPACK_IMPORTED_MODULE_0__core_module__["default"].directive('ngEnter', function () {
    return function (scope, elem, attrs) {
        elem.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});


/***/ }),
/* 493 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export autoRefresh */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_utils_kbn__ = __webpack_require__(93);


// Usage:
// html: <div auto-refresh></div>
// controller: $scope.refresh_interval = '30s', $scope.refresh_func = this.someFunction.bind(this)
function autoRefresh($timeout, timer) {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, elem, attr) {
            var refresh_timer;
            var interval = scope.refresh_interval;
            if (interval) {
                setAutoRefresh(interval);
            }
            function setAutoRefresh(interval) {
                var _i = __WEBPACK_IMPORTED_MODULE_1_app_core_utils_kbn__["default"].interval_to_ms(interval);
                var wait_ms = _i - (Date.now() % _i);
                $timeout(function () {
                    start_scheduled_refresh(_i);
                    // refreshView();
                }, wait_ms);
            }
            function start_scheduled_refresh(after_ms) {
                cancel_scheduled_refresh();
                refresh_timer = $timeout(function () {
                    start_scheduled_refresh(after_ms);
                    refreshView();
                }, after_ms);
            }
            function cancel_scheduled_refresh() {
                $timeout.cancel(refresh_timer);
                // timer.cancel(refresh_timer);
            }
            function refreshView() {
                scope.refresh_func();
            }
            scope.$on('$destroy', function () {
                cancel_scheduled_refresh();
            });
        }
    };
}
__WEBPACK_IMPORTED_MODULE_0__core_module__["default"].directive('autoRefresh', autoRefresh);


/***/ }),
/* 494 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TopologyGraphCtrl */
/* unused harmony export topologyGraphDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
throw new Error("Cannot find module \"d3.graph\"");
///<reference path="../../headers/common.d.ts" />



var template = "\n  <div class=\"search\" ng-show=\"ctrl.search\">\n    <form class=\"gf-form-group tidy-form\">\n      <div>\n          <div class=\"gf-form\">\n              <ul class=\"gf-form-list tidy-form-list\" style=\"text-align:right; overflow: inherit; width: 100%;\">\n                  <li class=\"tidy-form-item\">\n                      <em translate=\"i18n_search\"></em> {{ ctrl.types[ctrl.type] }}\n                  </li>\n                  <li class=\"tidy-form-item tidy-form-item-dropdown\">\n                      <input type=\"text\" class=\"input-xlarge tidy-form-input last\"\n                            ng-model='ctrl.query'\n                            spellcheck='false'\n                            bs-typeahead-old=\"ctrl.searchList\"\n                            placeholder=\"{{ ctrl.$translate.i18n.page_topology_search_input }}\"\n                            ng-enter=\"ctrl.searchItem()\"\n                            ng-blur=\"ctrl.searchItem()\" />\n                  </li>\n                  <li class=\"tidy-form-item\" ng-hide=\"ctrl.type === 'service'\">\n                      <em translate=\"page_topology_group_tag\"></em>\n                  </li>\n                  <li class=\"tidy-form-item\" ng-hide=\"ctrl.type === 'service'\">\n                      <button type=\"button\" class=\"kpi-btn btn btn-default\" ng-model=\"ctrl.group\" data-placement=\"bottom-auto\"\n                              bs-options=\"f.value as f.text for f in ctrl.groupOptions\" bs-select ng-change=\"ctrl.getGraph();\" placeholder=\"{{ ctrl.$translate.i18n.i18n_select_choose }}\">\n                          <span class=\"caret\"></span>\n                      </button>\n                  </li>\n                  <li class=\"tidy-form-item\" translate=\"page_host_kpi_stat\"></li>\n                  <li class=\"tidy-form-item\">\n                      <button type=\"button\" class=\"kpi-btn btn btn-default\" ng-model=\"ctrl.filter\" data-placement=\"bottom-auto\"\n                              bs-options=\"f.value as f.text for f in ctrl.filterOptions\" bs-select ng-change=\"ctrl.filterBy();\" placeholder=\"{{ ctrl.$translate.i18n.i18n_select_choose }}\">\n                          <span class=\"caret\"></span>\n                      </button>\n                  </li>\n                  <li class=\"tidy-form-item pull-right\" ng-hide=\"ctrl.hideClear\">\n                      <button class=\"btn btn-primary\" style=\"padding: 0.4rem 1rem;\" ng-click=\"ctrl.clearSelected();\"><em translate=\"page_topology_clear_select\"></em> {{ ctrl.types[ctrl.type] }}</button>\n                  </li>\n              </ul>\n              <div class=\"clearfix\"></div>\n          </div>\n      </div>\n    </form>\n  </div>\n\n  <div class=\"heatmap\">\n    <div id=\"heatmap\"></div>\n    <div class=\"clearfix\"></div>\n  </div>\n";
var TopologyGraphCtrl = /** @class */ (function () {
    /** @ngInject */
    function TopologyGraphCtrl($scope, $location, $timeout, backendSrv, contextSrv, $rootScope, hostSrv, serviceDepSrv, alertSrv, $translate) {
        this.$scope = $scope;
        this.$location = $location;
        this.$timeout = $timeout;
        this.backendSrv = backendSrv;
        this.contextSrv = contextSrv;
        this.$rootScope = $rootScope;
        this.hostSrv = hostSrv;
        this.serviceDepSrv = serviceDepSrv;
        this.alertSrv = alertSrv;
        this.$translate = $translate;
        this.groupOptions = [{ 'text': $translate.i18n.i18n_empty, 'value': '' }];
        this.filterOptions = [
            { 'text': $translate.i18n.i18n_all, 'value': '' },
            { 'text': $translate.i18n.i18n_normal, 'value': 'GREEN' },
            { 'text': $translate.i18n.i18n_warning, 'value': 'YELLOW' },
            { 'text': $translate.i18n.i18n_critical, 'value': 'RED' },
            { 'text': $translate.i18n.i18n_breakdown, 'value': 'GREY' }
        ];
        this.heatmap = window.d3.select('#heatmap');
        this.types = {
            'host': $translate.i18n.i18n_host,
            'service': $translate.i18n.i18n_service
        };
        !this.$scope.ctrl.type && (this.$scope.ctrl.type = 'host');
        this.hideClear = (this.$location.path() === '/');
        this.getGraph();
        this.getAllTagsKey();
        this.$scope.$on('topology-update', this.updateTopology.bind(this));
    }
    TopologyGraphCtrl.prototype.getGraph = function () {
        var params = {};
        this.group && (params['groupby'] = this.group);
        // reset data empty
        this.data = [];
        // default: type === 'host'
        var type = this.$scope.ctrl.type;
        if (type === 'service') {
            this.serviceDepSrv.getServiceTopologyData().then(this.renderGraph.bind(this));
        }
        else {
            this.hostSrv.getHostTopologyData(params).then(this.renderGraph.bind(this));
        }
    };
    TopologyGraphCtrl.prototype.renderGraph = function (response) {
        this.searchList = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.map(response, 'name');
        this.searchList = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.uniq(this.searchList);
        this.data = response;
        !this.rendered && (this.heatmap = window.d3.select('#heatmap').relationshipGraph(this.$scope.ctrl.params));
        this.rendered = true;
        this.heatmap.data(this.data);
        // 有 query 机器查询时, 先做groupby 再filter
        if (this.query && this.query !== '*') {
            this.searchItem();
        }
        this.$scope.$emit('topology-loaded', this.data);
    };
    TopologyGraphCtrl.prototype.openSearch = function () {
        this.search = true;
    };
    TopologyGraphCtrl.prototype.closeSearch = function () {
        this.search = false;
    };
    TopologyGraphCtrl.prototype.clearSelected = function () {
        this.query = '';
        this.currentItem = {};
        this.heatmap.data(this.data);
    };
    TopologyGraphCtrl.prototype.searchItem = function (event) {
        if (this.query === '' || this.query === '*') {
            this.clearSelected();
        }
        else if (!~this.searchList.indexOf(this.query)) {
            this.alertSrv.set(this.$translate.i18n.page_topology_search_invalid, '', "warning", 2000);
        }
        else {
            var searchResult = this.heatmap.search({ name: this.query });
            searchResult = !__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty(searchResult) ? searchResult : __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.filter(this.data, { name: this.query });
            this.heatmap.data(searchResult);
            this.currentItem = searchResult[0];
        }
    };
    TopologyGraphCtrl.prototype.getAllTagsKey = function () {
        var _this = this;
        // init, get all tags key for group-options
        this.hostSrv.getAllTagsKey().then(function (response) {
            response.data && response.data.forEach(function (item, index) {
                response.data[index] = { 'text': item, 'value': item };
            });
            _this.groupOptions = [_this.groupOptions[0]].concat(response.data);
        });
    };
    TopologyGraphCtrl.prototype.filterBy = function () {
        // 有 query 机器查询时, filterby 没有意义
        if (this.query && this.query !== '*') {
            return;
        }
        var filteredData = this.filter.toLowerCase() ? __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.filter(this.data, { value: this.filter.toLowerCase() }) : this.data;
        this.heatmap.data(filteredData);
    };
    TopologyGraphCtrl.prototype.updateTopology = function (evt, payload) {
        this.data = payload || this.data;
        this.clearSelected();
    };
    return TopologyGraphCtrl;
}());

function topologyGraphDirective() {
    return {
        restrict: 'E',
        template: template,
        controller: TopologyGraphCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            type: "@",
            params: "=",
            currentItem: "="
        },
        link: function (scope, elem) {
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].directive('topologyGraph', topologyGraphDirective);


/***/ }),
/* 495 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GuideCtrl */
/* unused harmony export guideDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_module__ = __webpack_require__(2);
///<reference path="../../../headers/common.d.ts" />


var GuideCtrl = /** @class */ (function () {
    /** @ngInject */
    function GuideCtrl($rootScope, $scope, hostSrv, alertMgrSrv, $timeout, $q, $location, $controller, datasourceSrv) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.hostSrv = hostSrv;
        this.alertMgrSrv = alertMgrSrv;
        this.$timeout = $timeout;
        this.$q = $q;
        this.$location = $location;
        this.$controller = $controller;
        this.datasourceSrv = datasourceSrv;
        this.exceptionMetrics = [];
        this.exceptionHosts = [];
        this.selected = {};
        this.collapsed = true;
        this.fixed = false;
        this.stepIndex = 0;
        this.steps = [];
        $rootScope.onAppEvent('show-guide-book', this.showGuide.bind(this), $scope);
        // params: guide metric host start
        var searchParams = $location.search();
        searchParams.guide && (this.show = true);
        searchParams.host = searchParams.host || '*';
        __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend(this.selected, searchParams);
        // TO FIX: does not work sometimes
        $timeout(function () { _this.located(); }, 100);
        this.steps.push({
            title: 'i18n_guide_step1',
            cta: 'i18n_guide_step1',
            icon: 'icon-gf icon-gf-check',
            href: '/',
            note: '1) 系统报警<br/>2) 服务KPI<br/>3) 机器KPI',
            check: function () { return $q.when(_this.$location.path() === '/'); },
            jumpTo: function () {
                _this.$location.url('/');
            }
        });
        this.steps.push({
            title: 'i18n_guide_step2',
            cta: 'i18n_guide_step2',
            icon: 'icon-gf icon-gf-apps',
            href: '/rca',
            note: '根据故障问题，寻找根本原因',
            check: function () { return $q.when(_this.$location.path() === '/rca'); },
            jumpTo: function () {
                _this.jump('/rca');
            }
        });
        this.steps.push({
            title: 'i18n_guide_step3',
            cta: 'i18n_guide_step3',
            icon: 'iconfont fa-association',
            href: '/association',
            note: '比较高相关性指标',
            check: function () { return $q.when(_this.$location.path() === '/association'); },
            jumpTo: function () {
                _this.jump('/association');
            }
        });
        this.steps.push({
            title: 'i18n_guide_step4',
            cta: 'i18n_guide_step4',
            icon: 'fa fa-fw fa-file-text-o',
            href: '/logs',
            note: '全文搜索系统日志',
            check: function () { return $q.when(_this.$location.path() === '/logs'); },
            jumpTo: function () {
                var type = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.metricPrefix2Type(_this.selected.metric.split(".")[0]);
                var query = "type:" + type + " AND host:" + _this.selected.host;
                var path = '/logs';
                var url = path + "?guide&metric=" + _this.selected.metric + "&host=" + _this.selected.host + "&start=" + _this.selected.start + "&query=" + query;
                _this.$location.url(url);
            }
        });
        this.steps.push({
            title: 'i18n_guide_step5',
            cta: 'i18n_guide_step5',
            icon: 'iconfont fa-process',
            href: '/topn',
            note: '查看资源消耗情况',
            check: function () { return $q.when(_this.$location.path() === '/topn'); },
            jumpTo: function () {
                _this.jump('/topn');
            }
        });
        $scope.$on('$routeUpdate', function () {
            var metric = _this.$location.search().metric;
            metric && !~_this.exceptionMetrics.indexOf(metric) && _this.exceptionMetrics.push(metric);
            __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend(_this.selected, _this.$location.search());
        });
        this.init();
    }
    GuideCtrl.prototype.init = function () {
        this.stepIndex = -1;
        this.getExceptionMetrics();
        this.getExceptionHost();
        return this.nextStep().then(function (res) {
        });
    };
    GuideCtrl.prototype.nextStep = function () {
        var _this = this;
        if (this.stepIndex === this.steps.length - 1) {
            return this.$q.when();
        }
        this.stepIndex += 1;
        var currentStep = this.steps[this.stepIndex];
        return currentStep.check().then(function (current) {
            if (current) {
                currentStep.cssClass = 'active';
                return _this.$q.when();
            }
            currentStep.cssClass = 'completed';
            return _this.nextStep();
        });
    };
    GuideCtrl.prototype.showGuide = function () {
        this.show = !this.show; // true;
    };
    GuideCtrl.prototype.dismiss = function () {
        this.show = false;
    };
    GuideCtrl.prototype.collapse = function () {
        this.collapsed = !this.collapsed;
    };
    GuideCtrl.prototype.located = function () {
        this.$rootScope.appEvent('exception-located', this.selected);
    };
    GuideCtrl.prototype.jump = function (path, hash) {
        var url = path + "?guide&metric=" + this.selected.metric + "&host=" + this.selected.host + "&start=" + this.selected.start;
        url += hash ? hash : '';
        this.$location.url(url);
    };
    GuideCtrl.prototype.onSelectChange = function () {
        var search = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend(this.$location.search(), this.selected);
        this.$location.search(search);
    };
    // TO IMPROVE: how to get all exception metrics? here are only alert metrics
    GuideCtrl.prototype.getExceptionMetrics = function () {
        var _this = this;
        this.exceptionMetrics = [];
        this.alertMgrSrv.loadTriggeredAlerts().then(function (response) {
            response.data && response.data.forEach(function (item) {
                _this.exceptionMetrics.push({
                    name: __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.getMetricName(item.metric),
                    time: item.status.levelChangedTime,
                    host: item.status.monitoredEntity
                });
            });
        });
    };
    GuideCtrl.prototype.getExceptionHost = function () {
        var _this = this;
        if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty(this.hostSrv.hostInfo)) {
            this.hostSrv.getHostInfo().then(function (response) {
                _this.exceptionHosts = response;
            });
        }
        else {
            this.exceptionHosts = this.hostSrv.hostInfo;
        }
    };
    return GuideCtrl;
}());

function guideDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/core/components/guide/guide.html',
        controller: GuideCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            needHost: '@',
            guideClass: '@',
            notMetric: '@'
        },
        link: function (scope, elem, attrs, ctrl) {
            var $scrollElement = elem.parent('.page-container');
            var scroll = function () {
                var scroll = $scrollElement.scrollTop();
                var shrinkHeader = ctrl.collapsed ? 90 : 230;
                ctrl.fixed = (scroll >= shrinkHeader) ? true : false;
                scope.$digest();
            };
            ctrl.show && $scrollElement.on('scroll', __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.throttle(scroll.bind(this), 100));
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1__core_module__["default"].directive('guide', guideDirective);


/***/ }),
/* 496 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ToolbarCtrl */
/* unused harmony export toolbarDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_module__ = __webpack_require__(2);
///<reference path="../../../headers/common.d.ts" />


var template = "\n  <div class=\"toolbar-content\">\n    <div class=\"popover-content\">\n      <a href=\"{{ item.href }}\" ng-repeat=\"item in toolbarItems\" class=\"toolbar-item {{ item.class }}\" ng-click=\"item.clickHandler()\">\n        <i class=\"{{ item.icon }}\"></i>\n        <p class=\"item-name\">{{ item.itemname }}</p>\n      </a>\n    </div>\n  </div>\n";
var ToolbarCtrl = /** @class */ (function () {
    /** @ngInject */
    function ToolbarCtrl($rootScope, $scope, popoverSrv, backendSrv, $q, $location, contextSrv, $translate) {
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.popoverSrv = popoverSrv;
        this.backendSrv = backendSrv;
        this.$q = $q;
        this.$location = $location;
        this.contextSrv = contextSrv;
        this.$translate = $translate;
        this.toolbarItems = {};
        this.toolbarItems[1] = [];
        this.toolbarItems[1].push({
            class: '',
            icon: 'fa fa-fw fa-book',
            itemname: $translate.i18n.i18n_kb,
            href: '/knowledgebase',
            clickHandler: function () { },
        });
        this.toolbarItems[2] = [];
        if (!contextSrv.isViewer) {
            this.toolbarItems[2].push({
                class: '',
                icon: 'fa fa-fw fa-cloud-download',
                itemname: $translate.i18n.i18n_install_guide,
                href: '/setting/agent',
                clickHandler: function () { },
            });
        }
        this.toolbarItems[2].push({
            class: '',
            icon: 'fa fa-fw fa-info-circle',
            itemname: $translate.i18n.i18n_usage_guide,
            href: 'javascript:;',
            clickHandler: function () {
                $rootScope.appEvent('show-modal', {
                    src: 'public/app/core/components/toolbar/guide_use.html',
                    modalClass: 'guide_use',
                    scope: $scope.$new(),
                });
            }
        });
    }
    ToolbarCtrl.prototype.showPopover = function () {
        this.popoverSrv.show({
            element: __WEBPACK_IMPORTED_MODULE_0_jquery___default()(".toolbar-" + this.$scope.ctrl.id)[0],
            position: 'bottom center',
            template: template,
            classes: 'toolbar-popover',
            model: {
                toolbarItems: this.toolbarItems[+this.$scope.ctrl.id],
            },
        });
    };
    return ToolbarCtrl;
}());

function toolbarDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/core/components/toolbar/toolbar.html',
        controller: ToolbarCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {
            icon: "@",
            tooltip: "@",
            id: "@"
        },
    };
}
__WEBPACK_IMPORTED_MODULE_1__core_module__["default"].directive('toolbar', toolbarDirective);


/***/ }),
/* 497 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export CwizSwitchCtrl */
/* unused harmony export cwizSwitchDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var template = "\n<span class=\"cwiz-switch {{ ctrl.switchClass }}\" ng-class=\"{ 'checked': ctrl.enabled }\">\n  <input type=\"checkbox\" id=\"check1\" ng-class=\"{ 'checked': ctrl.enabled }\" ng-model=\"ctrl.enabled\" ng-change=\"ctrl.internalOnChange();\" hidden />\n  <label for=\"check1\"></label>\n  <span class=\"switch-text\">\n    <span class=\"on\">{{ ctrl.textOn }}</span>\n    <span class=\"off\">{{ ctrl.textOff }}</span>\n  </span>\n</span>\n";
var CwizSwitchCtrl = /** @class */ (function () {
    /** @ngInject */
    function CwizSwitchCtrl($scope, $timeout) {
        this.$scope = $scope;
        this.$timeout = $timeout;
    }
    CwizSwitchCtrl.prototype.internalOnChange = function () {
        var _this = this;
        return this.$timeout(function () {
            return _this.onChange();
        });
    };
    return CwizSwitchCtrl;
}());

function cwizSwitchDirective() {
    return {
        restrict: 'AE',
        controller: CwizSwitchCtrl,
        controllerAs: 'ctrl',
        bindToController: true,
        scope: {
            switchClass: "@",
            textOn: "@",
            textOff: "@",
            enabled: "=",
            onChange: "&"
        },
        template: template,
    };
}
__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].directive('cwizSwitch', cwizSwitchDirective);


/***/ }),
/* 498 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export TreeMenuCtrl */
/* unused harmony export treeMenu */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_core_module__ = __webpack_require__(2);




var custom_metric;
var TreeMenuCtrl = /** @class */ (function () {
    /** @ngInject */
    function TreeMenuCtrl($scope, associationSrv, $rootScope, $timeout, $controller, backendSrv, contextSrv, healthSrv, alertMgrSrv, timeSrv, $translate) {
        var _this = this;
        this.$scope = $scope;
        this.associationSrv = associationSrv;
        this.$rootScope = $rootScope;
        this.$timeout = $timeout;
        this.$controller = $controller;
        this.backendSrv = backendSrv;
        this.contextSrv = contextSrv;
        this.healthSrv = healthSrv;
        this.alertMgrSrv = alertMgrSrv;
        this.timeSrv = timeSrv;
        this.$translate = $translate;
        custom_metric = this.$translate.i18n.page_metrics_custom;
        this.isOpen = false;
        this.isLoding = true;
        this.groupType = 'metrics';
        this.limitTime = 2;
        var analysis = this.$rootScope.$on('analysis', function (event, data) {
            switch (data) {
                case 'thresholdSlider':
                    _this.associationSrv.updateRang(_this.$scope.$parent.thresholdSlider.get());
                    _this.init();
                    _this.refresh();
                    break;
                case 'updateTime':
                    _this.initByTime();
                    break;
                default:
                    var association = _this.associationSrv.sourceAssociation;
                    _this.loadAssociatedPeriods({
                        metric: association.metric,
                        host: association.host
                    }).then(function (res) {
                        _this.init();
                    });
                    break;
            }
        });
        this.$scope.$on('$destroy', function () {
            analysis();
            _this.associationSrv.sourceAssociation = {};
        });
        this.yaxisNumber = 3;
        this.prox = this.contextSrv.user.orgId + '.' + this.contextSrv.user.systemId + '.';
        this.timeRange = {
            from: this.timeSrv.timeRange().from.unix(),
            to: this.timeSrv.timeRange().to.unix()
        };
        this.backendSrv.get('/api/static/config').then(function (res) {
            _this.limitTime = res.limit_association;
        });
    }
    TreeMenuCtrl.prototype.init = function (type) {
        var _this = this;
        this.groupType = type || this.groupType;
        this.isOpen = true;
        this.isLoding = true;
        this.isAssociation = false;
        var association = this.associationSrv.sourceAssociation;
        this.clearSelected();
        var params = {
            metric: association.metric,
            host: association.host,
            minDistance: 1000 - association.max,
            maxDistance: 1000 - association.min,
            group: this.groupType,
            startSec: this.timeRange.from,
            endSec: this.timeRange.to
        };
        if (!__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty(association)) {
            if (this.periods) {
                this.loadAssociatedMetrics(params);
            }
            else {
                this.loadAssociatedPeriods({
                    metric: association.metric,
                    host: association.host
                }).then(function (res) {
                    params.startSec = res.from;
                    params.endSec = res.to;
                    _this.loadAssociatedMetrics(params);
                });
            }
        }
    };
    TreeMenuCtrl.prototype.loadAssociatedPeriods = function (params) {
        var _this = this;
        return this.alertMgrSrv.loadAssociatedPeriods(params).then(function (res) {
            _this.periods = res.data;
            if (_this.periods.length) {
                _this.updateTimeRange(_this.periods[0]);
            }
            else {
                _this.periods = [];
                _this.periods.push({
                    o1: _this.timeRange.from,
                    o2: _this.timeRange.to,
                });
            }
            return _this.timeRange;
        });
    };
    TreeMenuCtrl.prototype.loadAssociatedMetrics = function (params) {
        var _this = this;
        this.alertMgrSrv.loadAssociatedMetrics(params)
            .then(function (res) {
            if (_this.groupType === 'metrics') {
                _this.correlationMetrics = res.data;
            }
            else {
                _this.correlationHosts = res.data;
            }
            if (!__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEmpty(res.data)) {
                _this.isAssociation = true;
            }
            _this.isLoding = false;
        }, function () {
            _this.isLoding = false;
        });
    };
    TreeMenuCtrl.prototype.showTree = function () {
        var _this = this;
        this.isOpen = !this.isOpen;
        this.$timeout(function () {
            _this.$rootScope.$broadcast('render');
        });
    };
    TreeMenuCtrl.prototype.showNewAssociationManual = function () {
        var _this = this;
        var newScope = this.$scope.$new();
        newScope.datasource = this.$scope.datasource;
        newScope.addManualMetric = this.addManualMetric.bind(this);
        this.$controller('OpenTSDBQueryCtrl', { $scope: newScope });
        this.backendSrv.getHosts({
            "queries": [],
            "hostProperties": ["id"]
        }).then(function (response) {
            _this.$scope.suggestTagHost = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.map(response.data, 'hostname');
        });
        this.$scope.appEvent('show-modal', {
            src: 'public/app/partials/manual_association.html',
            modalClass: 'modal-no-header confirm-modal',
            scope: newScope
        });
    };
    TreeMenuCtrl.prototype.addManualMetric = function (target) {
        target.metric = this.prox + target.metric;
        var custom = null;
        if (this.groupType === 'metrics') {
            (!this.correlationMetrics[custom_metric]) && (this.correlationMetrics[custom_metric] = {});
            custom = this.correlationMetrics[custom_metric];
            var key = target.metric;
            var value = target.host;
            var type = 'hosts';
        }
        else {
            (!this.correlationHosts['']) && (this.correlationHosts[custom_metric] = {});
            custom = this.correlationHosts[custom_metric];
            key = target.host;
            value = target.metric;
            type = 'metrics';
        }
        (!custom[key]) && (custom[key] = {});
        custom[key][type] = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.union(custom[key][type], [value]);
        this.isAssociation = true;
    };
    TreeMenuCtrl.prototype.clearSelected = function () {
        var _this = this;
        if (this.panel) {
            var sourceMetric = this.associationSrv.sourceAssociation;
            __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.each(this.panel.targets, function (target) {
                if (!_this.checkSource(_this.prox + target.metric, target.tags.host)) {
                    target.hide = true;
                }
            });
        }
        __WEBPACK_IMPORTED_MODULE_1_jquery___default()('[type="checkbox"]').prop({ checked: false });
        __WEBPACK_IMPORTED_MODULE_1_jquery___default()('[disabled="disabled"]').prop({ checked: true });
    };
    TreeMenuCtrl.prototype.addQuery = function (event, metric, host, otherMetric) {
        var _this = this;
        if (host === custom_metric && this.groupType === 'hosts') {
            host = otherMetric;
        }
        if (this.checkSource(this.prox + metric, host)) {
            return;
        }
        else {
            var $currentTarget = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(event.currentTarget);
            var $target = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(event.target);
            if (!$target.is('input')) {
                var $input = $currentTarget.find('input');
                var checked = $input.prop('checked');
                $input.prop({ checked: !checked });
            }
            var targets = this.panel.targets;
            var isHidden = true;
            __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.each(targets, function (target) {
                if (target.metric === metric && target.tags.host === host) {
                    isHidden = false;
                    target.hide = !target.hide;
                }
            });
            if (isHidden) {
                var target = {
                    "aggregator": "avg",
                    "currentTagKey": "",
                    "currentTagValue": "",
                    "downsampleAggregator": "avg",
                    "downsampleInterval": this.panel.downsample,
                    "errors": {},
                    "hide": false,
                    "isCounter": false,
                    "metric": metric,
                    "shouldComputeRate": false,
                    "tags": { "host": host }
                };
                targets.push(target);
                var seriesOverride = {
                    "alias": metric + "{host" + "=" + host + "}",
                    "yaxis": this.yaxisNumber++
                };
                this.panel.seriesOverrides.push(seriesOverride);
            }
            this.healthSrv.transformPanelMetricType(this.panel).then(function () {
                _this.refresh();
            });
        }
    };
    TreeMenuCtrl.prototype.toggleClass = function (event, metric, host) {
        var _i = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(event.target);
        var _is = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(event.currentTarget).find('i');
        if (_i.hasClass('add-rca')) {
            _is[1].className = 'fa fa-thumbs-o-down';
            _i.hasClass('fa-thumbs-o-up')
                ? (_i.removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up') && this.addRCA(metric, host))
                : _i.removeClass('fa-thumbs-up').addClass('fa-thumbs-o-up');
        }
        else {
            _is[0].className = 'fa fa-thumbs-o-up add-rca';
            _i.hasClass('fa-thumbs-o-down')
                ? _i.removeClass('fa-thumbs-o-down').addClass('fa-thumbs-down')
                : _i.removeClass('fa-thumbs-down').addClass('fa-thumbs-o-down');
        }
    };
    TreeMenuCtrl.prototype.addRCA = function (metric, host) {
        if (!this.contextSrv.isViewer) {
            var rcaFeedback = {
                alertIds: [],
                timestampInSec: Math.round(new Date().getTime() / 1000),
                triggerMetric: {
                    name: this.associationSrv.sourceAssociation.metric,
                    host: this.associationSrv.sourceAssociation.host,
                },
                rootCauseMetrics: [{
                        name: this.prox + metric,
                        host: host,
                        confidenceLevel: 100
                    }],
                relatedMetrics: [],
                org: this.contextSrv.user.orgId,
                sys: this.contextSrv.user.systemId
            };
            this.alertMgrSrv.rcaFeedback(rcaFeedback);
        }
    };
    TreeMenuCtrl.prototype.toggleAccordion = function (event) {
        var _i = __WEBPACK_IMPORTED_MODULE_1_jquery___default()(event.currentTarget).find('i');
        _i.hasClass('fa-plus-square-o')
            ? _i.removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
            : _i.removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
    };
    TreeMenuCtrl.prototype.checkSource = function (metric, host) {
        return __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEqual(metric, this.associationSrv.sourceAssociation.metric) &&
            __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isEqual(host, this.associationSrv.sourceAssociation.host);
    };
    TreeMenuCtrl.prototype.initByTime = function () {
        var _this = this;
        var start = this.timeSrv.timeRange().from.unix();
        var from = __WEBPACK_IMPORTED_MODULE_2_moment___default()(start * 1000);
        var end = this.timeSrv.timeRange().to.unix();
        var diff = __WEBPACK_IMPORTED_MODULE_2_moment___default()().diff(from, 'days', true);
        if (diff > this.limitTime) {
            this.$scope.appEvent('alert-warning', ['您仅可以关联' + this.limitTime + '天以内的数据', '请选择' + this.limitTime + '天以内的时间区间']);
            return;
        }
        diff = __WEBPACK_IMPORTED_MODULE_2_moment___default()(end * 1000).diff(from, 'minutes');
        if (diff < 20) {
            this.$scope.appEvent('alert-warning', ['最小关联时间为20分钟', '请选择大于20分钟的时间区间']);
            return;
        }
        this.$scope.appEvent('confirm-modal', {
            title: this.$translate.i18n.i18n_confirm,
            text: this.$translate.i18n.page_association_info4,
            yesText: this.$translate.i18n.i18n_confirm,
            noText: this.$translate.i18n.i18n_cancel,
            onConfirm: function () {
                _this.timeRange.from = start;
                _this.timeRange.to = end;
                _this.periods.push({
                    o1: start,
                    o2: end
                });
                _this.init();
            }
        });
    };
    TreeMenuCtrl.prototype.updateTimeRange = function (period) {
        this.timeRange.from = period.o1;
        this.timeRange.to = period.o2;
        this.timeSrv.setTime({ from: __WEBPACK_IMPORTED_MODULE_2_moment___default()(this.timeRange.from * 1000), to: __WEBPACK_IMPORTED_MODULE_2_moment___default()(this.timeRange.to * 1000) }, false);
    };
    TreeMenuCtrl.prototype.refresh = function () {
        this.$rootScope.$broadcast('refresh', this.panel.id);
    };
    return TreeMenuCtrl;
}());

function treeMenu() {
    return {
        restrict: 'E',
        controller: TreeMenuCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        templateUrl: 'public/app/core/components/tree_menu/tree_menu.html',
        link: function (scope, elem, attrs, ctrl) {
            ctrl.panel = scope.$parent.panel;
        }
    };
}
__WEBPACK_IMPORTED_MODULE_3_app_core_core_module__["default"].directive('cwTreeMenu', treeMenu);


/***/ }),
/* 499 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export KnowledgeBaseCtrl */
/* unused harmony export knowledgeBaseDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
throw new Error("Cannot find module \"ng-quill\"");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_module__ = __webpack_require__(2);
///<reference path="../../../headers/common.d.ts" />



var KnowledgeBaseCtrl = /** @class */ (function () {
    /** @ngInject */
    function KnowledgeBaseCtrl($scope, $rootScope, backendSrv, contextSrv, $translate) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.backendSrv = backendSrv;
        this.contextSrv = contextSrv;
        this.$translate = $translate;
        this.q = "*";
        this.service = "*";
        this.services = ["*", "system", "hadoop", "hbase", "kafka", "mysql", "spark", "storm", "yarn", "zookeeper", "tomcat", "opentsdb", "mongo3", "nginx", "windows", "exchange"];
        this.fullText = [];
        this.readOnly = true;
        $scope.$on("$destroy", function () {
            window.removeEventListener('popstate', _this.pushState);
        });
    }
    KnowledgeBaseCtrl.prototype.query = function () {
        var _this = this;
        this.showList = true;
        this.showCreatForm = false;
        var params = {
            q: this.q
        };
        if (this.service !== "*") {
            params['service'] = this.service;
        }
        this.backendSrv.knowledge({
            method: "GET",
            url: "/search",
            params: params,
        }).then(function (result) {
            _this.knowledge = result.data;
            _this.knowledgeCopy = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.cloneDeep(result.data);
        });
    };
    KnowledgeBaseCtrl.prototype.initNewKnows = function () {
        this.showCreatForm = true;
        this.newKnowledge = {
            solution: "",
            service: ""
        };
    };
    KnowledgeBaseCtrl.prototype.newKnowsByLog = function () {
        var _this = this;
        this.newKnowledge.symptom = this.q;
        this.newKnowledge.org_id = this.contextSrv.user.orgId;
        this.newKnowledge.system_id = this.contextSrv.user.systemId;
        this.backendSrv.knowledge({
            method: "PUT",
            url: "",
            data: this.newKnowledge
        }).then(function (res) {
            res.data.isSuccessful && _this.$scope.appEvent('alert-success', [_this.$translate.i18n.i18n_success]);
        });
        this.showCreatForm = false;
    };
    KnowledgeBaseCtrl.prototype.cancelCreate = function () {
        this.showCreatForm = false;
    };
    KnowledgeBaseCtrl.prototype.textOverflow = function (index) {
        this.fullText[index] = !this.fullText[index];
    };
    KnowledgeBaseCtrl.prototype.editorCreated = function (editor, knowledge, isDetail) {
        if (isDetail) {
            editor.root.innerHTML = knowledge;
        }
        else {
            var tmp = knowledge.trim();
            tmp = tmp.replace(/[\r]?\n/g, '');
            tmp = tmp.replace(/<\/?[ol|li|blockquote|pre]+>/g, '');
            tmp = tmp.replace(/<.*\b">/g, '');
            tmp = tmp.replace(/<\/?.*\b>/g, '');
            var length = tmp.length > 100 ? 100 : tmp.length;
            var end = tmp.length > 100 ? '...' : '';
            editor.root.innerHTML = tmp.substring(0, length) + end;
        }
    };
    KnowledgeBaseCtrl.prototype.getDetail = function (knowledge) {
        this.showList = false;
        this.detailKnowledge = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.find(this.knowledgeCopy, { id: knowledge.id });
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.pushState);
    };
    KnowledgeBaseCtrl.prototype.getList = function () {
        this.showList = true;
    };
    // 禁用浏览器后退按钮
    KnowledgeBaseCtrl.prototype.pushState = function () {
        history.pushState(null, null, document.URL);
    };
    return KnowledgeBaseCtrl;
}());

function knowledgeBaseDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/core/components/knowledge_base/knowledge_body.html',
        controller: KnowledgeBaseCtrl,
        bindToController: true,
        transclude: true,
        controllerAs: 'ctrl',
        scope: {},
        link: function (scope, elem, attrs, ctrl) {
        }
    };
}
__WEBPACK_IMPORTED_MODULE_2__core_module__["default"].directive('knowledgeBase', knowledgeBaseDirective);


/***/ }),
/* 500 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),
/* 501 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export GrafanaCtrl */
/* unused harmony export grafanaAppDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_store__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_app_core_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />






var locale = 'zh-CN';
var GrafanaCtrl = /** @class */ (function () {
    /** @ngInject */
    function GrafanaCtrl($scope, alertSrv, utilSrv, $rootScope, $controller, contextSrv, $location, healthSrv, backendSrv) {
        $scope.init = function () {
            $scope.contextSrv = contextSrv;
            $scope._ = __WEBPACK_IMPORTED_MODULE_2_lodash___default.a;
            $rootScope.profilingEnabled = __WEBPACK_IMPORTED_MODULE_1_app_core_store___default.a.getBool('profilingEnabled');
            $rootScope.performance = { loadStart: new Date().getTime() };
            $rootScope.appSubUrl = __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.appSubUrl;
            if ($rootScope.profilingEnabled) {
                $scope.initProfiling();
            }
            alertSrv.init();
            utilSrv.init();
            if (!($location.path() === '/login' || $location.path() === '/signupfree')) {
                backendSrv.initCustomizedSources();
                backendSrv.updateTokens();
            }
            $scope.dashAlerts = alertSrv;
        };
        $scope.initDashboard = function (dashboardData, viewScope) {
            $rootScope.mainScope = viewScope;
            dashboardData.dashboard.system = contextSrv.user.systemId;
            healthSrv.transformMetricType(dashboardData.dashboard).then(function () {
                $controller('DashboardCtrl', { $scope: viewScope }).init(dashboardData);
                contextSrv.user.systemId = dashboardData.dashboard.system || 0;
            });
        };
        $rootScope.onAppEvent = function (name, callback, localScope) {
            var unbind = $rootScope.$on(name, callback);
            var callerScope = this;
            if (callerScope.$id === 1 && !localScope) {
                console.log('warning rootScope onAppEvent called without localscope');
            }
            if (localScope) {
                callerScope = localScope;
            }
            callerScope.$on('$destroy', unbind);
        };
        $rootScope.appEvent = function (name, payload) {
            $rootScope.$emit(name, payload);
        };
        $rootScope.colors = [
            "#7EB26D", "#EAB839", "#6ED0E0", "#EF843C", "#E24D42", "#1F78C1", "#BA43A9", "#705DA0",
            "#508642", "#CCA300", "#447EBC", "#C15C17", "#890F02", "#0A437C", "#6D1F62", "#584477",
            "#B7DBAB", "#F4D598", "#70DBED", "#F9BA8F", "#F29191", "#82B5D8", "#E5A8E2", "#AEA2E0",
            "#629E51", "#E5AC0E", "#64B0C8", "#E0752D", "#BF1B00", "#0A50A1", "#962D82", "#614D93",
            "#9AC48A", "#F2C96D", "#65C5DB", "#F9934E", "#EA6460", "#5195CE", "#D683CE", "#806EB7",
            "#3F6833", "#967302", "#2F575E", "#99440A", "#58140C", "#052B51", "#511749", "#3F2B5B",
            "#E0F9D7", "#FCEACA", "#CFFAFF", "#F9E2D2", "#FCE2DE", "#BADFF4", "#F9D9F9", "#DEDAF7"
        ];
        $scope.getTotalWatcherCount = function () {
            var count = 0;
            var scopes = 0;
            var root = __WEBPACK_IMPORTED_MODULE_4_jquery___default()(document.getElementsByTagName('body'));
            var f = function (element) {
                if (element.data().hasOwnProperty('$scope')) {
                    scopes++;
                    __WEBPACK_IMPORTED_MODULE_3_angular___default.a.forEach(element.data().$scope.$$watchers, function () {
                        count++;
                    });
                }
                __WEBPACK_IMPORTED_MODULE_3_angular___default.a.forEach(element.children(), function (childElement) {
                    f(__WEBPACK_IMPORTED_MODULE_4_jquery___default()(childElement));
                });
            };
            f(root);
            $rootScope.performance.scopeCount = scopes;
            return count;
        };
        $scope.initProfiling = function () {
            var count = 0;
            $scope.$watch(function digestCounter() {
                count++;
            }, function () {
                // something
            });
            $rootScope.performance.panels = [];
            $scope.$on('refresh', function () {
                if ($rootScope.performance.panels.length > 0) {
                    var totalRender = 0;
                    var totalQuery = 0;
                    __WEBPACK_IMPORTED_MODULE_2_lodash___default.a.each($rootScope.performance.panels, function (panelTiming) {
                        totalRender += panelTiming.render;
                        totalQuery += panelTiming.query;
                    });
                    console.log('total query: ' + totalQuery);
                    console.log('total render: ' + totalRender);
                    console.log('avg render: ' + totalRender / $rootScope.performance.panels.length);
                }
                $rootScope.performance.panels = [];
            });
            $scope.onAppEvent('dashboard-loaded', function () {
                count = 0;
                setTimeout(function () {
                    console.log("Dashboard::Performance Total Digests: " + count);
                    console.log("Dashboard::Performance Total Watchers: " + $scope.getTotalWatcherCount());
                    console.log("Dashboard::Performance Total ScopeCount: " + $rootScope.performance.scopeCount);
                    var timeTaken = $rootScope.performance.allPanelsInitialized - $rootScope.performance.dashboardLoadStart;
                    console.log("Dashboard::Performance - All panels initialized in " + timeTaken + " ms");
                    // measure digest performance
                    var rootDigestStart = window.performance.now();
                    for (var i = 0; i < 30; i++) {
                        $rootScope.$apply();
                    }
                    console.log("Dashboard::Performance Root Digest " + ((window.performance.now() - rootDigestStart) / 30));
                }, 3000);
            });
        };
        $scope.init();
    }
    return GrafanaCtrl;
}());

/** @ngInject */
function grafanaAppDirective(playlistSrv, contextSrv, $translate) {
    return {
        restrict: 'E',
        controller: GrafanaCtrl,
        link: function (scope, elem, attr) {
            var ignoreSideMenuHide;
            var body = __WEBPACK_IMPORTED_MODULE_4_jquery___default()('body');
            locale = attr.locale;
            // handle sidemenu open state
            scope.$watch('contextSrv.sidemenu', function (newVal) {
                if (newVal !== undefined) {
                    body.toggleClass('sidemenu-open', scope.contextSrv.sidemenu);
                    if (!newVal) {
                        contextSrv.setPinnedState(false);
                    }
                }
                if (contextSrv.sidemenu) {
                    ignoreSideMenuHide = true;
                    setTimeout(function () {
                        ignoreSideMenuHide = false;
                    }, 300);
                }
            });
            scope.$watch('contextSrv.pinned', function (newVal) {
                if (newVal !== undefined) {
                    body.toggleClass('sidemenu-pinned', newVal);
                }
            });
            // tooltip removal fix
            // manage page classes
            var pageClass;
            scope.$on("$routeChangeSuccess", function (evt, data) {
                if (pageClass) {
                    body.removeClass(pageClass);
                }
                pageClass = data.$$route.pageClass;
                if (pageClass) {
                    body.addClass(pageClass);
                }
                __WEBPACK_IMPORTED_MODULE_4_jquery___default()("#tooltip, .tooltip").remove();
            });
            // handle document clicks that should hide things
            body.click(function (evt) {
                var target = __WEBPACK_IMPORTED_MODULE_4_jquery___default()(evt.target);
                if (target.parents().length === 0) {
                    return;
                }
                if (target.parents('.dash-playlist-actions').length === 0) {
                    playlistSrv.stop();
                }
                // hide search
                if (body.find('.search-container').length > 0) {
                    if (target.parents('.search-container').length === 0) {
                        scope.$apply(function () {
                            scope.appEvent('hide-dash-search');
                        });
                    }
                }
                // hide sidemenu
                if (!ignoreSideMenuHide && !contextSrv.pinned && body.find('.sidemenu').length > 0) {
                    if (target.parents('.sidemenu').length === 0) {
                        scope.$apply(function () {
                            scope.contextSrv.toggleSideMenu();
                        });
                    }
                }
                // hide popovers
                var popover = elem.find('.popover');
                if (popover.length > 0 && target.parents('.graph-legend').length === 0) {
                    popover.hide();
                }
            });
        }
    };
}
__WEBPACK_IMPORTED_MODULE_5_app_core_core_module__["default"].directive('grafanaApp', grafanaAppDirective);
// coreModule.config(['$translateProvider', ($translateProvider) => {
//   $translateProvider.useStaticFilesLoader({
//     prefix: 'public/app/core/i18n/',
//     suffix: '.json'
//   });
//   $translateProvider.preferredLanguage('zh_CN');
// }]);


/***/ }),
/* 502 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),
/* 503 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),
/* 504 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export infoPopover */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_tether_drop__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_tether_drop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_tether_drop__);
///<reference path="../../headers/common.d.ts" />



function infoPopover() {
    return {
        restrict: 'E',
        template: '<i class="fa fa-info-circle"></i>',
        transclude: true,
        link: function (scope, elem, attrs, ctrl, transclude) {
            var offset = attrs.offset || '0 -10px';
            var position = attrs.position || 'right middle';
            var classes = 'drop-help drop-hide-out-of-bounds';
            var openOn = 'hover';
            elem.addClass('gf-form-help-icon');
            if (attrs.wide) {
                classes += ' drop-wide';
            }
            if (attrs.mode) {
                elem.addClass('gf-form-help-icon--' + attrs.mode);
            }
            transclude(function (clone, newScope) {
                var content = document.createElement("div");
                __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.each(clone, function (node) {
                    content.appendChild(node);
                });
                var drop = new __WEBPACK_IMPORTED_MODULE_2_tether_drop___default.a({
                    target: elem[0],
                    content: content,
                    position: position,
                    classes: classes,
                    openOn: openOn,
                    hoverOpenDelay: 400,
                    tetherOptions: {
                        offset: offset
                    }
                });
                scope.$on('$destroy', function () {
                    drop.destroy();
                });
            });
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].directive('infoPopover', infoPopover);


/***/ }),
/* 505 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export ColorPickerCtrl */
/* unused harmony export colorPicker */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var template = "\n<div class=\"graph-legend-popover\">\n  <div ng-show=\"ctrl.series\" class=\"p-b-1\">\n    <label>Y Axis:</label>\n    <button ng-click=\"ctrl.toggleAxis(yaxis);\" class=\"btn btn-small\"\n            ng-class=\"{'btn-success': ctrl.series.yaxis === 1,\n                       'btn-inverse': ctrl.series.yaxis === 2}\">\n      Left\n    </button>\n    <button ng-click=\"ctrl.toggleAxis(yaxis);\"\n      class=\"btn btn-small\"\n      ng-class=\"{'btn-success': ctrl.series.yaxis === 2,\n                 'btn-inverse': ctrl.series.yaxis === 1}\">\n      Right\n    </button>\n  </div>\n\n  <p class=\"m-b-0\">\n   <i ng-repeat=\"color in ctrl.colors\" class=\"pointer fa fa-circle\"\n    ng-style=\"{color:color}\"\n    ng-click=\"ctrl.colorSelected(color);\">&nbsp;</i>\n  </p>\n</div>\n";
var ColorPickerCtrl = /** @class */ (function () {
    /** @ngInject */
    function ColorPickerCtrl($scope, $rootScope) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.colors = $rootScope.colors;
        this.autoClose = $scope.autoClose;
        this.series = $scope.series;
    }
    ColorPickerCtrl.prototype.toggleAxis = function (yaxis) {
        this.$scope.toggleAxis();
        if (this.$scope.autoClose) {
            this.$scope.dismiss();
        }
    };
    ColorPickerCtrl.prototype.colorSelected = function (color) {
        this.$scope.colorSelected(color);
        if (this.$scope.autoClose) {
            this.$scope.dismiss();
        }
    };
    return ColorPickerCtrl;
}());

function colorPicker() {
    return {
        restrict: 'E',
        controller: ColorPickerCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        template: template,
    };
}
__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].directive('gfColorPicker', colorPicker);


/***/ }),
/* 506 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export NavbarCtrl */
/* unused harmony export navbarDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_module__ = __webpack_require__(2);
///<reference path="../../../headers/common.d.ts" />



var NavbarCtrl = /** @class */ (function () {
    /** @ngInject */
    function NavbarCtrl($scope, $rootScope, $location, contextSrv) {
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.contextSrv = contextSrv;
        this.showGuideNav = false;
        this.showNavbarPageBtn = false;
        !!~['/rca', '/association', '/logs', '/topn'].indexOf(this.$location.path()) && (this.showGuideNav = true);
        this.showNavbarPageBtn = (this.$location.path() === '/');
        this.deadline = __WEBPACK_IMPORTED_MODULE_1_moment___default()(contextSrv.user.deadline).diff(__WEBPACK_IMPORTED_MODULE_1_moment___default()(), 'days');
        this.priceUrl = '//cloudwiz.cn/product_price.html';
    }
    NavbarCtrl.prototype.showGuide = function () {
        this.$rootScope.appEvent('show-guide-book');
    };
    NavbarCtrl.prototype.updateIndex = function () {
        if (this.$location.path() === '/') {
            window.location.href = __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.appSubUrl + '/';
        }
        else {
            this.$location.url('/');
        }
    };
    return NavbarCtrl;
}());

function navbarDirective() {
    return {
        restrict: 'E',
        templateUrl: 'public/app/core/components/navbar/navbar.html',
        controller: NavbarCtrl,
        bindToController: true,
        transclude: true,
        controllerAs: 'ctrl',
        scope: {
            text: "@",
            titleUrl: "@",
            iconUrl: "@",
        },
        link: function (scope, elem, attrs, ctrl) {
            ctrl.icon = attrs.icon;
            elem.addClass('navbar');
        }
    };
}
__WEBPACK_IMPORTED_MODULE_2__core_module__["default"].directive('navbar', navbarDirective);


/***/ }),
/* 507 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export arrayJoin */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


function arrayJoin() {
    'use strict';
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            function split_array(text) {
                return (text || '').split(',');
            }
            function join_array(text) {
                if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isArray(text)) {
                    return (text || '').join(',');
                }
                else {
                    return text;
                }
            }
            ngModel.$parsers.push(split_array);
            ngModel.$formatters.push(join_array);
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1__core_module__["default"].directive('arrayJoin', arrayJoin);


/***/ }),
/* 508 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export LiveSrv */
/* unused harmony export liveSrv */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vendor_npm_rxjs_Observable__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vendor_npm_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vendor_npm_rxjs_Observable__);
///<reference path="../../headers/common.d.ts" />



var LiveSrv = /** @class */ (function () {
    function LiveSrv() {
        this.observers = {};
    }
    LiveSrv.prototype.getWebSocketUrl = function () {
        var l = window.location;
        return ((l.protocol === "https:") ? "wss://" : "ws://") + l.host + __WEBPACK_IMPORTED_MODULE_1_app_core_config___default.a.appSubUrl + '/ws';
    };
    LiveSrv.prototype.getConnection = function () {
        var _this = this;
        if (this.initPromise) {
            return this.initPromise;
        }
        if (this.conn && this.conn.readyState === 1) {
            return Promise.resolve(this.conn);
        }
        this.initPromise = new Promise(function (resolve, reject) {
            console.log('Live: connecting...');
            _this.conn = new WebSocket(_this.getWebSocketUrl());
            _this.conn.onclose = function (evt) {
                console.log("Live: websocket onclose", evt);
                reject({ message: 'Connection closed' });
                _this.initPromise = null;
                setTimeout(_this.reconnect.bind(_this), 2000);
            };
            _this.conn.onmessage = function (evt) {
                _this.handleMessage(evt.data);
            };
            _this.conn.onerror = function (evt) {
                _this.initPromise = null;
                reject({ message: 'Connection error' });
                console.log("Live: websocket error", evt);
            };
            _this.conn.onopen = function (evt) {
                console.log('opened');
                _this.initPromise = null;
                resolve(_this.conn);
            };
        });
        return this.initPromise;
    };
    LiveSrv.prototype.handleMessage = function (message) {
        message = JSON.parse(message);
        if (!message.stream) {
            console.log("Error: stream message without stream!", message);
            return;
        }
        var observer = this.observers[message.stream];
        if (!observer) {
            this.removeObserver(message.stream, null);
            return;
        }
        observer.next(message);
    };
    LiveSrv.prototype.reconnect = function () {
        var _this = this;
        // no need to reconnect if no one cares
        if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.keys(this.observers).length === 0) {
            return;
        }
        console.log('LiveSrv: Reconnecting');
        this.getConnection().then(function (conn) {
            __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.each(_this.observers, function (value, key) {
                _this.send({ action: 'subscribe', stream: key });
            });
        });
    };
    LiveSrv.prototype.send = function (data) {
        this.conn.send(JSON.stringify(data));
    };
    LiveSrv.prototype.addObserver = function (stream, observer) {
        var _this = this;
        this.observers[stream] = observer;
        this.getConnection().then(function (conn) {
            _this.send({ action: 'subscribe', stream: stream });
        });
    };
    LiveSrv.prototype.removeObserver = function (stream, observer) {
        var _this = this;
        console.log('unsubscribe', stream);
        delete this.observers[stream];
        this.getConnection().then(function (conn) {
            _this.send({ action: 'unsubscribe', stream: stream });
        });
    };
    LiveSrv.prototype.subscribe = function (streamName) {
        var _this = this;
        console.log('LiveSrv.subscribe: ' + streamName);
        return __WEBPACK_IMPORTED_MODULE_2_vendor_npm_rxjs_Observable__["Observable"].create(function (observer) {
            _this.addObserver(streamName, observer);
            return function () {
                _this.removeObserver(streamName, observer);
            };
        });
    };
    return LiveSrv;
}());

var instance = new LiveSrv();



/***/ }),
/* 509 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(131);
var observable_1 = __webpack_require__(510);
var toSubscriber_1 = __webpack_require__(511);
/**
 * A representation of any set of values over any amount of time. This the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is  called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Registers handlers for handling emitted values, error and completions from the observable, and
     *  executes the observable's subscriber function, which will take action to set up the underlying data stream
     * @method subscribe
     * @param {PartialObserver|Function} observerOrNext (optional) either an observer defining all functions to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the observable.
     * @param {Function} error (optional) a handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled
     * @param {Function} complete (optional) a handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var target = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        var transformer = operator && operator.call(target) || target;
        if (transformer !== target) {
            target.add(transformer);
        }
        var subscription = this._subscribe(transformer);
        if (subscription !== target) {
            target.add(subscription);
        }
        if (target.syncErrorThrowable) {
            target.syncErrorThrowable = false;
            if (target.syncErrorThrown) {
                throw target.syncErrorValue;
            }
        }
        return target;
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` imple will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.$$observable] = function () {
        return this;
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 510 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(131);
var Symbol = root_1.root.Symbol;
if (typeof Symbol === 'function') {
    if (Symbol.observable) {
        exports.$$observable = Symbol.observable;
    }
    else {
        if (typeof Symbol.for === 'function') {
            exports.$$observable = Symbol.for('observable');
        }
        else {
            exports.$$observable = Symbol('observable');
        }
        Symbol.observable = exports.$$observable;
    }
}
else {
    exports.$$observable = '@@observable';
}
//# sourceMappingURL=observable.js.map

/***/ }),
/* 511 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Subscriber_1 = __webpack_require__(512);
var rxSubscriber_1 = __webpack_require__(327);
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver && typeof nextOrObserver === 'object') {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        else if (typeof nextOrObserver[rxSubscriber_1.$$rxSubscriber] === 'function') {
            return nextOrObserver[rxSubscriber_1.$$rxSubscriber]();
        }
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 512 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = __webpack_require__(325);
var Subscription_1 = __webpack_require__(513);
var rxSubscriber_1 = __webpack_require__(327);
var Observer_1 = __webpack_require__(517);
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.isUnsubscribed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype[rxSubscriber_1.$$rxSubscriber] = function () {
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parent, observerOrNext, error, complete) {
        _super.call(this);
        this._parent = _parent;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            context = observerOrNext;
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (isFunction_1.isFunction(context.unsubscribe)) {
                this.add(context.unsubscribe.bind(context));
            }
            context.unsubscribe = this.unsubscribe.bind(this);
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parent = this._parent;
            if (!_parent.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parent, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parent = this._parent;
            if (this._error) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parent, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parent.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parent.syncErrorValue = err;
                _parent.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _parent = this._parent;
            if (this._complete) {
                if (!_parent.syncErrorThrowable) {
                    this.__tryOrUnsub(this._complete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parent, this._complete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parent = this._parent;
        this._context = null;
        this._parent = null;
        _parent.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 513 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isArray_1 = __webpack_require__(514);
var isObject_1 = __webpack_require__(515);
var isFunction_1 = __webpack_require__(325);
var tryCatch_1 = __webpack_require__(516);
var errorObject_1 = __webpack_require__(326);
var Subscription = (function () {
    function Subscription(_unsubscribe) {
        this.isUnsubscribed = false;
        if (_unsubscribe) {
            this._unsubscribe = _unsubscribe;
        }
    }
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.isUnsubscribed) {
            return;
        }
        this.isUnsubscribed = true;
        var _a = this, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this._subscriptions = null;
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                (errors = errors || []).push(errorObject_1.errorObject.e);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError) {
                            errors = errors.concat(err.errors);
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this subscription.
     *
     * If the tear down being added is a subscription that is already unsubscribed,
     * is the same reference `add` is being called on, or is `Subscription.EMPTY`,
     * it will not be added.
     *
     * If this subscription is already in an `isUnsubscribed` state, the passed tear down logic
     * will be executed immediately
     *
     * @param {TeardownLogic} teardown the additional logic to execute on teardown.
     * @returns {Subscription} returns the subscription used or created to be added to the inner
     *  subscriptions list. This subscription can be used with `remove()` to remove the passed teardown
     *  logic from the inner subscriptions list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === this) || (teardown === Subscription.EMPTY)) {
            return;
        }
        var sub = teardown;
        switch (typeof teardown) {
            case 'function':
                sub = new Subscription(teardown);
            case 'object':
                if (sub.isUnsubscribed || typeof sub.unsubscribe !== 'function') {
                    break;
                }
                else if (this.isUnsubscribed) {
                    sub.unsubscribe();
                }
                else {
                    (this._subscriptions || (this._subscriptions = [])).push(sub);
                }
                break;
            default:
                throw new Error('Unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        return sub;
    };
    /**
     * removes a subscription from the internal list of subscriptions that will unsubscribe
     * during unsubscribe process of this subscription.
     * @param {Subscription} subscription the subscription to remove
     */
    Subscription.prototype.remove = function (subscription) {
        // HACK: This might be redundant because of the logic in `add()`
        if (subscription == null || (subscription === this) || (subscription === Subscription.EMPTY)) {
            return;
        }
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.isUnsubscribed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this, 'unsubscriptoin error(s)');
        this.errors = errors;
        this.name = 'UnsubscriptionError';
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 514 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 515 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 516 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var errorObject_1 = __webpack_require__(326);
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 517 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.empty = {
    isUnsubscribed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 518 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export LayoutSelectorCtrl */
/* unused harmony export layoutSelector */
/* unused harmony export layoutMode */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_store__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_store__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../../headers/common.d.ts" />


var template = "\n<div class=\"layout-selector\">\n  <button ng-click=\"ctrl.listView()\" ng-class=\"{active: ctrl.mode === 'list'}\">\n    <i class=\"fa fa-list\"></i>\n  </button>\n  <button ng-click=\"ctrl.gridView()\" ng-class=\"{active: ctrl.mode === 'grid'}\">\n    <i class=\"fa fa-th\"></i>\n  </button>\n</div>\n";
var LayoutSelectorCtrl = /** @class */ (function () {
    /** @ngInject **/
    function LayoutSelectorCtrl($rootScope) {
        this.$rootScope = $rootScope;
        this.mode = __WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.get('grafana.list.layout.mode') || 'grid';
    }
    LayoutSelectorCtrl.prototype.listView = function () {
        this.mode = 'list';
        __WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.set('grafana.list.layout.mode', 'list');
        this.$rootScope.appEvent('layout-mode-changed', 'list');
    };
    LayoutSelectorCtrl.prototype.gridView = function () {
        this.mode = 'grid';
        __WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.set('grafana.list.layout.mode', 'grid');
        this.$rootScope.appEvent('layout-mode-changed', 'grid');
    };
    return LayoutSelectorCtrl;
}());

/** @ngInject **/
function layoutSelector() {
    return {
        restrict: 'E',
        controller: LayoutSelectorCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        scope: {},
        template: template,
    };
}
/** @ngInject **/
function layoutMode($rootScope) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, elem) {
            var layout = __WEBPACK_IMPORTED_MODULE_0_app_core_store___default.a.get('grafana.list.layout.mode') || 'grid';
            var className = 'card-list-layout-' + layout;
            elem.addClass(className);
            $rootScope.onAppEvent('layout-mode-changed', function (evt, newLayout) {
                elem.removeClass(className);
                className = 'card-list-layout-' + newLayout;
                elem.addClass(className);
            }, scope);
        }
    };
}
__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].directive('layoutSelector', layoutSelector);
__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].directive('layoutMode', layoutMode);


/***/ }),
/* 519 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export SwitchCtrl */
/* unused harmony export switchDirective */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var template = "\n<label for=\"check-{{ctrl.id}}\" class=\"gf-form-label {{ctrl.labelClass}} pointer\">\n  {{ctrl.label}}\n  <info-popover mode=\"right-normal\" ng-if=\"ctrl.tooltip\">\n    {{ctrl.tooltip}}\n  </info-popover>\n</label>\n<div class=\"gf-form-switch {{ctrl.switchClass}}\" ng-if=\"ctrl.show\">\n  <input id=\"check-{{ctrl.id}}\" type=\"checkbox\" ng-model=\"ctrl.checked\" ng-change=\"ctrl.internalOnChange()\">\n  <label for=\"check-{{ctrl.id}}\" data-on=\"Yes\" data-off=\"No\"></label>\n</div>\n";
var SwitchCtrl = /** @class */ (function () {
    /** @ngInject */
    function SwitchCtrl($scope, $timeout) {
        this.$timeout = $timeout;
        this.show = true;
        this.id = $scope.$id;
    }
    SwitchCtrl.prototype.internalOnChange = function () {
        var _this = this;
        return this.$timeout(function () {
            return _this.onChange();
        });
    };
    return SwitchCtrl;
}());

function switchDirective() {
    return {
        restrict: 'E',
        controller: SwitchCtrl,
        controllerAs: 'ctrl',
        bindToController: true,
        scope: {
            checked: "=",
            label: "@",
            labelClass: "@",
            tooltip: "@",
            switchClass: "@",
            onChange: "&",
        },
        template: template,
    };
}
__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].directive('gfFormSwitch', switchDirective);


/***/ }),
/* 520 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export DashboardSelectorCtrl */
/* unused harmony export dashboardSelector */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var template = "\n<select class=\"gf-form-input\" ng-model=\"ctrl.model\" ng-options=\"f.value as f.text for f in ctrl.options\"></select>\n<info-popover mode=\"right-absolute\">\n  Not finding dashboard you want? Star it first, then it should appear in this select box.\n</info-popover>\n";
var DashboardSelectorCtrl = /** @class */ (function () {
    /** @ngInject */
    function DashboardSelectorCtrl(backendSrv) {
        this.backendSrv = backendSrv;
    }
    DashboardSelectorCtrl.prototype.$onInit = function () {
        var _this = this;
        this.options = [{ value: 0, text: 'Default' }];
        return this.backendSrv.search({ starred: true }).then(function (res) {
            res.forEach(function (dash) {
                _this.options.push({ value: dash.id, text: dash.title });
            });
        });
    };
    return DashboardSelectorCtrl;
}());

function dashboardSelector() {
    return {
        restrict: 'E',
        controller: DashboardSelectorCtrl,
        bindToController: true,
        controllerAs: 'ctrl',
        template: template,
        scope: {
            model: '='
        }
    };
}
__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].directive('dashboardSelector', dashboardSelector);


/***/ }),
/* 521 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(523),
  __webpack_require__(528),
  __webpack_require__(524),
  __webpack_require__(525),
  __webpack_require__(526),
  __webpack_require__(527),
  __webpack_require__(522),
  __webpack_require__(529),
  __webpack_require__(530),
  __webpack_require__(531),
  __webpack_require__(532)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 522 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule) {
  'use strict';

  coreModule.default.controller('ErrorCtrl', function($scope, contextSrv) {

    var showSideMenu = contextSrv.sidemenu;
    contextSrv.sidemenu = false;

    $scope.$on('$destroy', function() {
      $scope.contextSrv.sidemenu = showSideMenu;
    });

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 523 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(16),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, $, coreModule) {
  'use strict';

  coreModule.default.controller('InspectCtrl', function($scope) {
    var model = $scope.inspector;

    function getParametersFromQueryString(queryString) {
      var result = [];
      var parameters = queryString.split("&");
      for (var i = 0; i < parameters.length; i++) {
        var keyValue = parameters[i].split("=");
        if (keyValue[1].length > 0) {
          result.push({ key: keyValue[0], value: window.unescape(keyValue[1]) });
        }
      }
      return result;
    }

    $scope.init = function () {
      $scope.editor = { index: 0 };

      if (!model.error)  {
        return;
      }

      if (_.isString(model.error.data)) {
        $scope.response = $("<div>" + model.error.data + "</div>").text();
      } else if (model.error.data) {
        $scope.response = angular.toJson(model.error.data, true);
      } else if (model.error.message) {
        $scope.message = model.error.message;
      }

      if (model.error.config && model.error.config.params) {
        $scope.request_parameters = _.map(model.error.config.params, function(value, key) {
          return { key: key, value: value};
        });
      }

      if (model.error.stack) {
        $scope.editor.index = 2;
        $scope.stack_trace = model.error.stack;
        $scope.message = model.error.message;
      }

      if (model.error.config && model.error.config.data) {
        $scope.editor.index = 1;

        if (_.isString(model.error.config.data)) {
          $scope.request_parameters = getParametersFromQueryString(model.error.config.data);
        } else  {
          $scope.request_parameters = _.map(model.error.config.data, function(value, key) {
            return {key: key, value: angular.toJson(value, true)};
          });
        }
      }
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 524 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
  __webpack_require__(24),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule, config) {
  'use strict';

  coreModule.default.controller('LoginCtrl', function($scope, backendSrv, contextSrv, $location) {
    $scope.formModel = {
      user: '',
      email: '',
      password: '',
    };

    contextSrv.sidemenu = false;

    $scope.googleAuthEnabled = config.googleAuthEnabled;
    $scope.githubAuthEnabled = config.githubAuthEnabled;
    $scope.oauthEnabled = config.githubAuthEnabled || config.googleAuthEnabled;
    $scope.disableUserSignUp = config.disableUserSignUp;
    $scope.loginHint     = config.loginHint;

    $scope.loginMode = true;
    $scope.submitBtnText = '登 录';

    $scope.init = function() {
      $scope.$watch("loginMode", $scope.loginModeChanged);

      var params = $location.search();
      if (params.failedMsg) {
        $scope.appEvent('alert-warning', ['登录 失败', params.failedMsg]);
        delete params.failedMsg;
        $location.search(params);
      }
    };

    // build info view model
    $scope.buildInfo = {
      version: config.buildInfo.version,
      commit: config.buildInfo.commit,
      buildstamp: new Date(config.buildInfo.buildstamp * 1000),
      latestVersion: config.buildInfo.latestVersion,
      hasUpdate: config.buildInfo.hasUpdate,
    };

    $scope.submit = function() {
      $scope.login();
    };

    $scope.loginModeChanged = function(newValue) {
      $scope.submitBtnText = newValue ? '登 录' : '注 册';
    };

    $scope.signUp = function() {
      if (!$scope.loginForm.$valid) {
        return;
      }

      backendSrv.post('/api/user/signup', $scope.formModel).then(function(result) {
        if (result.status === 'SignUpCreated') {
          $location.path('/signup').search({email: $scope.formModel.email});
        } else {
          window.location.href = config.appSubUrl + '/';
        }
      });
    };

    $scope.login = function() {
      delete $scope.loginError;

      if (!$scope.loginForm.$valid) {
        return;
      }

      backendSrv.post('/login', $scope.formModel).then(function(result) {
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          window.location.href = config.appSubUrl + '/systems';
        }
      });
    };

    $scope.contactUs = function() {
      $scope.appEvent('confirm-modal', {
        title: '欢迎与我们联系',
        text: '请致电：17070866703 <br/>邮 件：service@cloudwiz.cn',
        icon: 'fa-bell',
        yesText: '确定',
        noText: '关闭',
        modalClass : 'contact-us',
      });
    };

    $scope.init();
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 525 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
  __webpack_require__(24),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule, config) {
  'use strict';

  coreModule.default.controller('InvitedCtrl', function($scope, $routeParams, contextSrv, backendSrv) {
    contextSrv.sidemenu = false;
    $scope.formModel = {};

    $scope.init = function() {
      backendSrv.get('/api/user/invite/' + $routeParams.code).then(function(invite) {
        $scope.formModel.name = invite.name;
        $scope.formModel.email = invite.email;
        $scope.formModel.username = invite.email;
        $scope.formModel.inviteCode =  $routeParams.code;

        $scope.greeting = invite.name || invite.email || invite.username;
        $scope.invitedBy = invite.invitedBy;
      });
    };

    $scope.submit = function() {
      if (!$scope.inviteForm.$valid) {
        return;
      }

      backendSrv.post('/api/user/invite/complete', $scope.formModel).then(function() {
        window.location.href = config.appSubUrl + '/';
      });
    };

    $scope.init();

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 526 */
/***/ (function(module, exports) {

throw new Error("Module build failed: Error: Final loader didn't return a Buffer or String\n    at runLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/webpack/lib/NormalModule.js:204:46)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:370:3\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:211:10)\n    at iterateNormalLoaders (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:218:10)\n    at /Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:233:3\n    at context.callback (/Users/yuyu/webapp/cloudwiz/src/github.com/wangy1931/grafana/node_modules/loader-runner/lib/LoaderRunner.js:111:13)\n    at process._tickCallback (internal/process/next_tick.js:103:7)");

/***/ }),
/* 527 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule) {
  'use strict';

  coreModule.default.controller('ResetPasswordCtrl', function($scope, contextSrv, backendSrv, $location) {
    contextSrv.sidemenu = false;
    $scope.formModel = {};
    $scope.mode = 'send';

    var params = $location.search();
    if (params.code) {
      $scope.mode = 'reset';
      $scope.formModel.code = params.code;
    }

    $scope.sendResetEmail = function() {
      if (!$scope.sendResetForm.$valid) {
        return;
      }
      backendSrv.post('/api/user/password/send-reset-email', $scope.formModel).then(function() {
        $scope.mode = 'email-sent';
      });
    };

    $scope.submitReset = function() {
      if (!$scope.resetForm.$valid) { return; }

      if ($scope.formModel.newPassword !== $scope.formModel.confirmPassword) {
        $scope.appEvent('alert-warning', ['两次密码不一致,请重新输入', '']);
        return;
      }

      backendSrv.post('/api/user/password/reset', $scope.formModel).then(function() {
        $location.path('login');
      });
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 528 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule) {
  'use strict';

  coreModule.default.controller('JsonEditorCtrl', function($scope) {

    $scope.json = angular.toJson($scope.object, true);
    $scope.canUpdate = $scope.updateHandler !== void 0 && $scope.contextSrv.isEditor;

    $scope.update = function () {
      var newObject = angular.fromJson($scope.json);
      $scope.updateHandler(newObject, $scope.object);
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 529 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(3),
    __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _,coreModule) {
    'use strict';

    coreModule.default.controller('InstallCtrl', function ($scope, backendSrv, datasourceSrv, contextSrv) {
      $scope.installSelect = {
        system: 0,
        service: ""
      };
      //would be hard code for a while
      $scope.services = ["Hadoop", "zookeeper", "JMX", "Mysql"];
      $scope.platform = ["Window", "Linux"];
      $scope.orgId = contextSrv.user.orgId;
      $scope.alertServer = backendSrv.alertDUrl;
      datasourceSrv.get("opentsdb").then(function (ds) {
        var url = document.createElement('a');
        url.href = ds.url;
        $scope.metricsServer = url.hostname;
      });
      $scope.changeToken = function () {
        _.each(backendSrv.tokens, function (token) {
          if (token.name === $scope.installSelect.system) {
            $scope.token = token.key;
          }
        });
      };
    });

  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 530 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupFreeCtrl", function() { return SignupFreeCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_module__ = __webpack_require__(2);



var SignupFreeCtrl = /** @class */ (function () {
    /** @ngInject */
    function SignupFreeCtrl($scope, $location, backendSrv, contextSrv) {
        $scope.formModel = {
            email: "",
            name: "",
            orgName: "",
            phone: "",
            scale: ""
        };
        contextSrv.sidemenu = false;
        $scope.submit = function () {
            if (!$scope.signUpFrom.$valid) {
                return;
            }
            if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.excludeEmail($scope.formModel.email)) {
                $scope.appEvent('alert-warning', ['请输入企业邮箱']);
                return;
            }
            contextSrv.signupUser.orgName = $scope.formModel.orgName;
            contextSrv.signupUser.name = $scope.formModel.name;
            backendSrv.post('/api/user/signup', $scope.formModel).then(function (result) {
                if (result.status === 'SignUpCreated') {
                    $location.path('/signup').search({ email: $scope.formModel.email });
                }
                else {
                    window.location.href = __WEBPACK_IMPORTED_MODULE_1_app_core_config___default.a.appSubUrl + '/';
                }
            });
            backendSrv.post('/api/user/signup/propose', $scope.formModel).then(function () { });
        };
    }
    return SignupFreeCtrl;
}());

__WEBPACK_IMPORTED_MODULE_2__core_module__["default"].controller('SignupFreeCtrl', SignupFreeCtrl);


/***/ }),
/* 531 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(2),
    __webpack_require__(3),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule, _) {
    'use strict';

    coreModule.default.controller('SystemCtrl', function ($scope, backendSrv, $location, contextSrv) {

      $scope.dashboardSetting = {title: "new dashboard", system: contextSrv.user.systemId};
      $scope.init = function () {
        $scope.getCurrentUserSystem();
      };

      $scope.getCurrentUserSystem = function () {
        backendSrv.get("/api/user/system").then(function (system) {
          $scope.system = _.find(system, {Id: contextSrv.user.systemId});
        });
      };

      $scope.addSystem = function () {
        if (!$scope.systemForm.$valid) {
          return;
        }
        $scope.dismiss();
        $location.url('dashboard/new?system=' + $scope.dashboardSetting.system + "&title=" + $scope.dashboardSetting.title);
      };

      $scope.init_system_choice = function () {
        backendSrv.get("/api/user/system").then(function (system) {
          $scope.systems = system;
        });
      };

      $scope.newSystem = function() {
        $location.url('/org');
      };
    });
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 532 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuideUseCtrl", function() { return GuideUseCtrl; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


var GuideUseCtrl = /** @class */ (function () {
    /** @ngInject */
    function GuideUseCtrl($scope, $rootScope, $location, $sce) {
        this.$sce = $sce;
        var path = $location.path();
        path = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.replace(path, /\//g, '_');
        path = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.guideMap()[path] || 'ui_summary';
        this.guidePath = $sce.trustAsResourceUrl("https://cloudwiz.cn/document/part4/" + path + ".html");
    }
    return GuideUseCtrl;
}());

__WEBPACK_IMPORTED_MODULE_1__core_module__["default"].controller('GuideUseCtrl', GuideUseCtrl);


/***/ }),
/* 533 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(535),
  __webpack_require__(546),
  __webpack_require__(536),
  __webpack_require__(538),
  __webpack_require__(539),
  __webpack_require__(540),
  __webpack_require__(541),
  __webpack_require__(542),
  __webpack_require__(543),
  __webpack_require__(544),
  __webpack_require__(545),
  __webpack_require__(534),
  __webpack_require__(547),
  __webpack_require__(548),
  __webpack_require__(549),
  __webpack_require__(550),
  __webpack_require__(551),
  __webpack_require__(552),
  __webpack_require__(553),
  __webpack_require__(554),
  __webpack_require__(555),
  __webpack_require__(556)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 534 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(3),
    __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
  'use strict';
  coreModule.default.service('alertMgrSrv', function(alertSrv, backendSrv) {
    this.alertDefMap = {};
    var self = this;
    var alertDefUrl = "/alert/definition";
    var alertStatusUrl = "/alert/status";
    var alertAssociationUrl = "/alert/correlation";
    var alertHistoryUrl = "/alert/history";
    var closeAlertUrl = "/alert/status/close";
    var checkNameUrl = "/alert/definition/check";
    var rcaFeedbackUrl = "/rca/feedback/json";
    var associationPeriodsUrl = "/alert/correlation/periods";

    this.currentCritialThreshold = 0;
    this.currentWarningThreshold = 0;

    this.load = function() {
      return backendSrv.alertD({
        method: "get",
        url: alertDefUrl,
      }).then(function onSuccess(response) {
        for (var i = 0; i < response.data.length; i++) {
          var theAlertDef = response.data[i];
          self.alertDefMap[theAlertDef.id] = theAlertDef;
        }
        return response;
      }, function onFailed(response) {
        alertSrv.set("error", response.status + " " + (response.data || "Request failed"), response.severity, 5000);
        return response;
      });
    };

    this.save = function(alertDef) {
      return backendSrv.alertD({
        method: "post",
        url: alertDefUrl,
        data: angular.toJson(alertDef),
        headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
      });
    };

    this.remove = function(alertId) {
      return backendSrv.alertD({
        method: "delete",
        url: alertDefUrl,
        params: {id: alertId},
        headers: {'Content-Type': 'text/plain'},
      });
    };

    this.get = function(id) {
      return self.alertDefMap[id];
    };

    this.loadTriggeredAlerts = function(options) {
      var params = {};
      _.extend(params, options);
      return backendSrv.alertD({
        method: "get",
        url: alertStatusUrl,
        params: params
      });
    };

    this.loadAssociatedMetrics = function(params) {
      return backendSrv.alertD({
        method: "get",
        url: alertAssociationUrl,
        params: params
      });
    };

    this.resetCorrelation = function(alertMetric, alertHost, backtrackSteps, advancedSteps) {
      return backendSrv.alertD({
        method: "post",
        url: alertAssociationUrl,
        params: {
          metric: alertMetric,
          host: alertHost,
          backtrackSteps: backtrackSteps,
          advancedSteps: advancedSteps,
          reset: true
        },
        headers: {'Content-Type': 'text/plain'},
      });
    };

    this.loadAssociatedPeriods = function(params) {
      return backendSrv.alertD({
        method: "get",
        url: associationPeriodsUrl,
        params: params
      });
    };

    this.resetCurrentThreshold = function (threshold) {
      self.currentWarningThreshold = threshold.warn;
      self.currentCritialThreshold = threshold.crit;
    };

    this.loadAlertHistory = function(fromTime, host) {
      var params = { from: fromTime };
      host && (params['host'] = host);

      return backendSrv.alertD({
        method: "get",
        url: alertHistoryUrl,
        params: params
      });
    };

    this.closeAlert = function(alertId, host, alertReason, userName) {
      return backendSrv.alertD({
        method: "post",
        url: closeAlertUrl,
        params: {
          id: alertId,
          host: host,
        },
        data:{
          reason: alertReason,
          closeBy: userName
        },
        headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
      });
    };

    this.rcaFeedback = function(rcaFeedback) {
      return backendSrv.alertD({
        method: "post",
        url: rcaFeedbackUrl,
        data:rcaFeedback,
        headers: {'Content-Type': 'text/plain;application/json;charset=UTF-8'},
      });
    };

    this.checkName = function(ruleName) {
      return backendSrv.alertD({
        method: 'get',
        url: checkNameUrl,
        params: {
          name: ruleName,
        }
      });
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 535 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AlertSrv", function() { return AlertSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_app_events__ = __webpack_require__(330);
///<reference path="../../headers/common.d.ts" />




var AlertSrv = /** @class */ (function () {
    /** @ngInject */
    function AlertSrv($timeout, $sce, $rootScope, $_modal) {
        this.$timeout = $timeout;
        this.$sce = $sce;
        this.$rootScope = $rootScope;
        this.$_modal = $_modal;
        this.list = [];
    }
    AlertSrv.prototype.init = function () {
        var _this = this;
        this.$rootScope.onAppEvent('alert-error', function (e, alert) {
            _this.set(alert[0], alert[1], 'error', 0);
        }, this.$rootScope);
        this.$rootScope.onAppEvent('alert-warning', function (e, alert) {
            _this.set(alert[0], alert[1], 'warning', 5000);
        }, this.$rootScope);
        this.$rootScope.onAppEvent('alert-success', function (e, alert) {
            _this.set(alert[0], alert[1], 'success', 3000);
        }, this.$rootScope);
        __WEBPACK_IMPORTED_MODULE_3_app_core_app_events__["a" /* default */].on('confirm-modal', this.showConfirmModal.bind(this));
        this.$rootScope.onAppEvent('confirm-modal', function (e, data) {
            _this.showConfirmModal(data);
        }, this.$rootScope);
    };
    AlertSrv.prototype.set = function (title, text, severity, timeout) {
        var _this = this;
        var newAlert = {
            title: title || '',
            text: text || '',
            severity: severity || 'info',
        };
        var newAlertJson = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.toJson(newAlert);
        // remove same alert if it already exists
        __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.remove(this.list, function (value) {
            return __WEBPACK_IMPORTED_MODULE_0_angular___default.a.toJson(value) === newAlertJson;
        });
        this.list.push(newAlert);
        if (timeout > 0) {
            this.$timeout(function () {
                _this.list = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.without(_this.list, newAlert);
            }, timeout);
        }
        if (!this.$rootScope.$$phase) {
            this.$rootScope.$digest();
        }
        return (newAlert);
    };
    AlertSrv.prototype.clear = function (alert) {
        this.list = __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.without(this.list, alert);
    };
    AlertSrv.prototype.clearAll = function () {
        this.list = [];
    };
    AlertSrv.prototype.showConfirmModal = function (payload) {
        var scope = this.$rootScope.$new();
        scope.title = payload.title;
        scope.text = payload.text;
        scope.text2 = payload.text2;
        scope.onConfirm = payload.onConfirm;
        scope.icon = payload.icon || "fa-check";
        scope.yesText = payload.yesText || "Yes";
        scope.noText = payload.noText || "Cancel";
        var confirmModal = this.$_modal({
            template: 'public/app/partials/confirm_modal.html',
            persist: false,
            modalClass: 'confirm-modal',
            show: false,
            scope: scope,
            keyboard: false
        });
        confirmModal.then(function (modalEl) {
            modalEl.modal('show');
        });
    };
    return AlertSrv;
}());

__WEBPACK_IMPORTED_MODULE_2_app_core_core_module__["default"].service('alertSrv', AlertSrv);


/***/ }),
/* 536 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(2),
  __webpack_require__(24),
  __webpack_require__(128),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule, config, dateMath) {
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

      __webpack_require__(537)(pluginDef.module).then(function(plugin) {
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
      return _.reduce(config.datasources, function(memo, value) {

        if (value.meta && value.meta.annotations) {
          memo.push(value);
        }

        return memo;
      }, []);
    };

    this.getMetricSources = function(options) {
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
        // look for data source variables
        for (var i = 0; i < templateSrv.variables.length; i++) {
          var variable = templateSrv.variables[i];
          if (variable.type !== 'datasource') {
            continue;
          }

          var first = variable.current.value;
          var ds = config.datasources[first];

          if (ds) {
            metricSources.push({
              name: '$' + variable.name,
              value: '$' + variable.name,
              meta: ds.meta,
            });
          }
        }
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

    this.init();
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 537 */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 537;

/***/ }),
/* 538 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "User", function() { return User; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupUser", function() { return SignupUser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContextSrv", function() { return ContextSrv; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contextSrv", function() { return contextSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_config___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_app_core_config__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_store__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_store___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_app_core_store__);
///<reference path="../../headers/common.d.ts" />




var User = /** @class */ (function () {
    function User() {
        if (__WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.bootData.user) {
            __WEBPACK_IMPORTED_MODULE_1_lodash___default.a.extend(this, __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.bootData.user);
        }
    }
    return User;
}());

var SignupUser = /** @class */ (function () {
    function SignupUser() {
    }
    return SignupUser;
}());

var ContextSrv = /** @class */ (function () {
    function ContextSrv() {
        this.pinned = __WEBPACK_IMPORTED_MODULE_3_app_core_store___default.a.getBool('grafana.sidemenu.pinned', false);
        this.sidemenu = this.pinned ? true : false;
        if (!__WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.buildInfo) {
            __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.buildInfo = {};
        }
        if (!__WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.bootData) {
            __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.bootData = { user: {}, settings: {} };
        }
        this.version = __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.buildInfo.version;
        this.user = new User();
        this.isSignedIn = this.user.isSignedIn;
        this.isGrafanaAdmin = this.user.isGrafanaAdmin;
        this.isEditor = this.hasRole('Editor') || this.hasRole('Admin');
        this.isOrgAdmin = this.hasRole('Admin');
        this.dashboardLink = "";
        this.systemsMap = __WEBPACK_IMPORTED_MODULE_0_app_core_config___default.a.bootData.systems;
        this.hostNum = 0;
        this.isViewer = this.hasRole('Viewer');
        this.signupUser = new SignupUser();
    }
    ContextSrv.prototype.hasRole = function (role) {
        return this.user.orgRole === role;
    };
    ContextSrv.prototype.setPinnedState = function (val) {
        this.pinned = val;
        __WEBPACK_IMPORTED_MODULE_3_app_core_store___default.a.set('grafana.sidemenu.pinned', val);
    };
    ContextSrv.prototype.toggleSideMenu = function ($event) {
        $event && $event.preventDefault();
        this.sidemenu = !this.sidemenu;
        this.setPinnedState(true);
    };
    return ContextSrv;
}());

var contextSrv = new ContextSrv();

__WEBPACK_IMPORTED_MODULE_2_app_core_core_module__["default"].factory('contextSrv', function () {
    return contextSrv;
});


/***/ }),
/* 539 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
  'use strict';

  coreModule.default.service('timer', function($timeout) {
    // This service really just tracks a list of $timeout promises to give us a
    // method for cancelling them all when we need to

    var timers = [];

    this.register = function(promise) {
      timers.push(promise);
      return promise;
    };

    this.cancel = function(promise) {
      timers = _.without(timers,promise);
      $timeout.cancel(promise);
    };

    this.cancel_all = function() {
      _.each(timers, function(t) {
        $timeout.cancel(t);
      });
      timers = [];
    };
  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 540 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
  'use strict';

  // This service was based on OpenJS library available in BSD License
  // http://www.openjs.com/scripts/events/keyboard_shortcuts/index.php
  coreModule.default.factory('keyboardManager', ['$window', '$timeout', function ($window, $timeout) {
    var keyboardManagerService = {};

    var defaultOpt = {
      'type':             'keydown',
      'propagate':        false,
      'inputDisabled':    false,
      'target':           $window.document,
      'keyCode':          false
    };
    // Store all keyboard combination shortcuts
    keyboardManagerService.keyboardEvent = {};
    // Add a new keyboard combination shortcut
    keyboardManagerService.bind = function (label, callback, opt) {
      var fct, elt, code, k;
      // Initialize opt object
      opt   = angular.extend({}, defaultOpt, opt);
      label = label.toLowerCase();
      elt   = opt.target;

      if (typeof opt.target === 'string') {
        elt = document.getElementById(opt.target);
      }

      fct = function (e) {
        e = e || $window.event;

        // Disable event handler when focus input and textarea
        if (opt['inputDisabled']) {
          var elt;
          if (e.target) {
            elt = e.target;
          }
          else if (e.srcElement) {
            elt = e.srcElement;
          }

          if (elt.nodeType === 3) {
            elt = elt.parentNode;
          }

          if (elt.tagName === 'INPUT' || elt.tagName === 'TEXTAREA') {
            return;
          }
        }

        // Find out which key is pressed
        if (e.keyCode) {
          code = e.keyCode;
        }
        else if (e.which) {
          code = e.which;
        }

        var character = String.fromCharCode(code).toLowerCase();

        if (code === 188) {
          character = ","; // If the user presses , when the type is onkeydown
        }
        if (code === 190) {
          character = "."; // If the user presses , when the type is onkeydown
        }

        var keys = label.split("+");
        // Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
        var kp = 0;
        // Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
        var shift_nums = {
          "`": "~",
          "1": "!",
          "2": "@",
          "3": "#",
          "4": "$",
          "5": "%",
          "6": "^",
          "7": "&",
          "8": "*",
          "9": "(",
          "0": ")",
          "-": "_",
          "=": "+",
          ";": ":",
          "'": "\"",
          ",": "<",
          ".": ">",
          "/": "?",
          "»": "?",
          "«": "?",
          "¿": "?",
          "\\": "|"
        };
        // Special Keys - and their codes
        var special_keys = {
          'esc': 27,
          'escape': 27,
          'tab': 9,
          'space': 32,
          'return': 13,
          'enter': 13,
          'backspace': 8,

          'scrolllock': 145,
          'scroll_lock': 145,
          'scroll': 145,
          'capslock': 20,
          'caps_lock': 20,
          'caps': 20,
          'numlock': 144,
          'num_lock': 144,
          'num': 144,

          'pause': 19,
          'break': 19,

          'insert': 45,
          'home': 36,
          'delete': 46,
          'end': 35,

          'pageup': 33,
          'page_up': 33,
          'pu': 33,

          'pagedown': 34,
          'page_down': 34,
          'pd': 34,

          'left': 37,
          'up': 38,
          'right': 39,
          'down': 40,

          'f1': 112,
          'f2': 113,
          'f3': 114,
          'f4': 115,
          'f5': 116,
          'f6': 117,
          'f7': 118,
          'f8': 119,
          'f9': 120,
          'f10': 121,
          'f11': 122,
          'f12': 123
        };
        // Some modifiers key
        var modifiers = {
          shift: {
            wanted:   false,
            pressed:  e.shiftKey ? true : false
          },
          ctrl : {
            wanted:   false,
            pressed:  e.ctrlKey ? true : false
          },
          alt  : {
            wanted:   false,
            pressed:  e.altKey ? true : false
          },
          meta : { //Meta is Mac specific
            wanted:   false,
            pressed:  e.metaKey ? true : false
          }
        };
        // Foreach keys in label (split on +)
        for (var i = 0, l = keys.length; k = keys[i], i < l; i++) {
          switch (k) {
          case 'ctrl':
          case 'control':
            kp++;
            modifiers.ctrl.wanted = true;
            break;
          case 'shift':
          case 'alt':
          case 'meta':
            kp++;
            modifiers[k].wanted = true;
            break;
          }

          if (k.length > 1) { // If it is a special key
            if (special_keys[k] === code) {
              kp++;
            }
          } else if (opt['keyCode']) { // If a specific key is set into the config
            if (opt['keyCode'] === code) {
              kp++;
            }
          } else { // The special keys did not match
            if (character === k) {
              kp++;
            }
            else {
              if (shift_nums[character] && e.shiftKey) { // Stupid Shift key bug created by using lowercase
                character = shift_nums[character];
                if (character === k) {
                  kp++;
                }
              }
            }
          }
        }

        if (kp === keys.length &&
          modifiers.ctrl.pressed === modifiers.ctrl.wanted &&
          modifiers.shift.pressed === modifiers.shift.wanted &&
          modifiers.alt.pressed === modifiers.alt.wanted &&
          modifiers.meta.pressed === modifiers.meta.wanted) {
          $timeout(function() {
            callback(e);
          }, 1);

          if (!opt['propagate']) { // Stop the event
            // e.cancelBubble is supported by IE - this will kill the bubbling process.
            e.cancelBubble = true;
            e.returnValue = false;

            // e.stopPropagation works in Firefox.
            if (e.stopPropagation) {
              e.stopPropagation();
              e.preventDefault();
            }
            return false;
          }
        }

      };
      // Store shortcut
      keyboardManagerService.keyboardEvent[label] = {
        'callback': fct,
        'target':   elt,
        'event':    opt['type']
      };
      //Attach the function with the event
      if (elt.addEventListener) {
        elt.addEventListener(opt['type'], fct, false);
      }
      else if (elt.attachEvent) {
        elt.attachEvent('on' + opt['type'], fct);
      }
      else {
        elt['on' + opt['type']] = fct;
      }
    };

    keyboardManagerService.unbindAll = function() {
      _.each(keyboardManagerService.keyboardEvent, function(value, key) {
        keyboardManagerService.unbind(key);
      });
    };

    // Remove the shortcut - just specify the shortcut and I will remove the binding
    keyboardManagerService.unbind = function (label) {
      label = label.toLowerCase();

      var binding = keyboardManagerService.keyboardEvent[label];
      delete(keyboardManagerService.keyboardEvent[label]);

      if (!binding) {
        return;
      }

      var type    = binding['event'],
      elt     = binding['target'],
      callback  = binding['callback'];

      if (elt.detachEvent) {
        elt.detachEvent('on' + type, callback);
      }
      else if (elt.removeEventListener) {
        elt.removeEventListener(type, callback, false);
      }
      else {
        elt['on' + type] = false;
      }
    };
    //
    return keyboardManagerService;
  }]);

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 541 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function(angular, coreModule) {
  'use strict';

  coreModule.default.service('googleAnalyticsSrv', function($rootScope, $location) {
    var first = true;

    this.init = function() {
      $rootScope.$on('$viewContentLoaded', function() {
        // skip first
        if (first) {
          first = false;
          return;
        }
        window.ga('send', 'pageview', { page: $location.url() });
      });
    };

  }).run(function(googleAnalyticsSrv) {
    if (window.ga) {
      googleAnalyticsSrv.init();
    }
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 542 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_tether_drop__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_tether_drop___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_tether_drop__);
///<reference path="../../headers/common.d.ts" />



/** @ngInject **/
function popoverSrv($compile, $rootScope) {
    this.show = function (options) {
        var popoverScope = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.extend($rootScope.$new(true), options.model);
        var drop;
        function destroyDrop() {
            setTimeout(function () {
                if (drop.tether) {
                    drop.destroy();
                }
            });
        }
        popoverScope.dismiss = function () {
            popoverScope.$destroy();
            destroyDrop();
        };
        var contentElement = document.createElement('div');
        contentElement.innerHTML = options.template;
        $compile(contentElement)(popoverScope);
        drop = new __WEBPACK_IMPORTED_MODULE_2_tether_drop___default.a({
            target: options.element,
            content: contentElement,
            position: options.position,
            classes: options.classes + ' drop-popover',
            openOn: options.openOn || 'hover',
            hoverCloseDelay: 200,
            tetherOptions: {
                constraints: [{ to: 'window', pin: true, attachment: "both" }]
            }
        });
        drop.on('close', function () {
            popoverScope.dismiss({ fromDropClose: true });
            destroyDrop();
            if (options.onClose) {
                options.onClose();
            }
        });
        setTimeout(function () { drop.open(); }, 10);
    };
}
__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].service('popoverSrv', popoverSrv);


/***/ }),
/* 543 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
  'use strict';

  coreModule.default.service('uiSegmentSrv', function($sce, templateSrv) {
    var self = this;

    function MetricSegment(options) {
      if (options === '*' || options.value === '*') {
        this.value = '*';
        this.html = $sce.trustAsHtml('<i class="fa fa-asterisk"><i>');
        this.expandable = true;
        return;
      }

      if (_.isString(options)) {
        this.value = options;
        this.html = $sce.trustAsHtml(templateSrv.highlightVariablesAsHtml(this.value));
        return;
      }

      this.cssClass = options.cssClass;
      this.custom = options.custom;
      this.type = options.type;
      this.fake = options.fake;
      this.value = options.value;
      this.type = options.type;
      this.expandable = options.expandable;
      this.html = options.html || $sce.trustAsHtml(templateSrv.highlightVariablesAsHtml(this.value));
    }

    this.getSegmentForValue = function(value, fallbackText) {
      if (value) {
        return this.newSegment(value);
      } else {
        return this.newSegment({value: fallbackText, fake: true});
      }
    };

    this.newSelectMeasurement = function() {
      return new MetricSegment({value: 'select measurement', fake: true});
    };

    this.newFake = function(text, type, cssClass) {
      return new MetricSegment({value: text, fake: true, type: type, cssClass: cssClass});
    };

    this.newSegment = function(options) {
      return new MetricSegment(options);
    };

    this.newKey = function(key) {
      return new MetricSegment({value: key, type: 'key', cssClass: 'query-segment-key' });
    };

    this.newKeyValue = function(value) {
      return new MetricSegment({value: value, type: 'value', cssClass: 'query-segment-value' });
    };

    this.newCondition = function(condition) {
      return new MetricSegment({value: condition, type: 'condition', cssClass: 'query-keyword' });
    };

    this.newOperator = function(op) {
      return new MetricSegment({value: op, type: 'operator', cssClass: 'query-segment-operator' });
    };

    this.newOperators = function(ops) {
      return _.map(ops, function(op) {
        return new MetricSegment({value: op, type: 'operator', cssClass: 'query-segment-operator' });
      });
    };

    this.transformToSegments = function(addTemplateVars, variableTypeFilter) {
      return function(results) {
        var segments = _.map(results, function(segment) {
          return self.newSegment({ value: segment.text, expandable: segment.expandable });
        });

        if (addTemplateVars) {
          _.each(templateSrv.variables, function(variable) {
            if (variableTypeFilter === void 0 || variableTypeFilter === variable.type) {
              segments.unshift(self.newSegment({ type: 'template', value: '$' + variable.name, expandable: true }));
            }
          });
        }

        return segments;
      };
    };

    this.newSelectMetric = function() {
      return new MetricSegment({value: 'select metric', fake: true});
    };

    this.newPlusButton = function() {
      return new MetricSegment({fake: true, html: '<i class="fa fa-plus "></i>', type: 'plus-button' });
    };

    this.newSelectTagValue = function() {
      return new MetricSegment({value: 'select tag value', fake: true});
    };

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 544 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(3),
  __webpack_require__(2),
  __webpack_require__(24),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule, config) {
  'use strict';

  coreModule.default.service('backendSrv', function($http, alertSrv, $timeout, contextSrv, $q) {
    var self = this;
    this.alertDUrl;
    this.downloadUrl;
    this.tokens = null;

    this.get = function(url, params) {
      return this.request({ method: 'GET', url: url, params: params });
    };

    this.delete = function(url) {
      return this.request({ method: 'DELETE', url: url });
    };

    this.post = function(url, data) {
      return this.request({ method: 'POST', url: url, data: data });
    };

    this.patch = function(url, data) {
      return this.request({ method: 'PATCH', url: url, data: data });
    };

    this.put = function(url, data) {
      return this.request({ method: 'PUT', url: url, data: data });
    };

    this._handleError = function(err) {
      return function() {
        if (err.isHandled) {
          return;
        }

        var data = err.data || { message: 'Unexpected error' };
        if (_.isString(data)) {
          data = { message: data };
        }

        if (err.status === 422) {
          alertSrv.set("Validation failed", data.message, "warning", 4000);
          throw data;
        }

        data.severity = 'error';

        if (err.status < 500) {
          data.severity = "warning";
        }

        if (data.message) {
          alertSrv.set("Problem!", data.message, data.severity, 10000);
        }

        throw data;
      };
    };

    this.request = function(options) {
      options.retry = options.retry || 0;
      var requestIsLocal = options.url.indexOf('/') === 0;
      var firstAttempt = options.retry === 0;

      if (requestIsLocal && !options.hasSubUrl) {
        options.url = config.appSubUrl + options.url;
        options.hasSubUrl = true;
      }

      if (self.isIE()) {
        var bust = Date.now();
        options.params ? options.params.bust = bust : options.params = {'bust': bust};
      }

      return $http(options).then(function(results) {
        if (options.method !== 'GET') {
          if (results && results.data.message) {
            alertSrv.set(results.data.message, '', 'success', 3000);
          }
        }
        return results.data;
      }, function(err) {
        // handle unauthorized
        if (err.status === 401 && firstAttempt) {
          return self.loginPing().then(function() {
            options.retry = 1;
            return self.request(options);
          });
        }

        $timeout(self._handleError(err), 50);
        throw err;
      });
    };

    this.datasourceRequest = function(options) {
      options.retry = options.retry || 0;
      var requestIsLocal = options.url.indexOf('/') === 0;
      var firstAttempt = options.retry === 0;

      if (self.isIE()) {
        var bust = Date.now();
        options.params ? options.params.bust = bust : options.params = {'bust': bust};
      }

      return $http(options).then(null, function(err) {
        // handle unauthorized for backend requests
        if (requestIsLocal && firstAttempt  && err.status === 401) {
          return self.loginPing().then(function() {
            options.retry = 1;
            return self.datasourceRequest(options);
          });
        }

        //populate error obj on Internal Error
        if (_.isString(err.data) && err.status === 500) {
          err.data = {
            error: err.statusText,
            response: err.data,
          };
        }

        // for Prometheus
        // if (!err.data.message && _.isString(err.data.error)) {
        //   err.data.message = err.data.error;
        // }

        throw err;
      });
    };

    this.loginPing = function() {
      return this.request({url: '/api/login/ping', method: 'GET', retry: 1 });
    };

    this.search = function(query) {
      return this.get('/api/search', query);
    };

    this.getDashboard = function(type, slug) {
      return this.get('/api/dashboards/' + type + '/' + slug);
    };

    this.saveDashboard = function(dash, options) {
      options = (options || {});
      return this.post('/api/dashboards/db/', {dashboard: dash, overwrite: options.overwrite === true});
    };

    this.getSystemById = function (id) {
      var sys = '';
      _.each(contextSrv.systemsMap, function (system) {
        if (system.Id === parseInt(id)) {
          sys = system.SystemsName;
        }
      });
      return sys;
    };

    //update system cache when systems change
    this.updateSystemsMap = function () {
      var getTokens = this.updateTokens();

      var getSystems = this.get("/api/user/system").then(function (systems) {
        contextSrv.systemsMap = systems;
      });
      return $q.all([getTokens, getSystems]);
    };

    this.updateTokens = function () {
      var updateToken = this.get('/api/auth/keys').then(function (tokens) {
        self.tokens = tokens;
      });
      return $q.all([updateToken, this.initCustomizedSources()]);
    };

    this.updateSystemId = function(id) {
      contextSrv.user.systemId = id;
    };

    this.initCustomizedSources = function () {
      return this.get('/api/customized_sources').then(function (result) {
        self.alertDUrl = result.alert;
        self.downloadUrl = result.download;
        contextSrv.elkUrl = result.elk;
      });
    };

    this.getToken = function () {
      return _.chain(self.tokens).filter({'name': contextSrv.user.systemId.toString()}).first().pick('key').values().first().value();
    };

    this.alertD = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      if (self.tokens) {
        options.url = self.alertDUrl + options.url;
        options.params.token = this.getToken();
        return this.datasourceRequest(options);
      }
      return self.updateTokens().then(function () {
        options.url = self.alertDUrl + options.url;
        options.params.token = self.getToken();
      }).then(function () {
        if (_.isEmpty(options.params.token)) {
          alertSrv.set("错误,无法获取TOKEN", "请联系service@cloudwiz.cn", "warning", 4000);
          var d = $q.defer();
          d.resolve({});
          return d.promise;
        }
        return self.datasourceRequest(options);
      });
    };

    this.logCluster = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      options.withCredentials = true;
      options.url = contextSrv.elkUrl + options.url;
      return this.datasourceRequest(options);
    };

    this.knowledge = function (options) {
      if (_.isEmpty(options.params)) {
        options.params = {};
      }
      options.withCredentials = true;
      options.url = contextSrv.elkUrl + "/knowledgebase/article" + options.url;
      return this.datasourceRequest(options);
    };

    this.suggestTagHost = function (query, callback) {
      self.alertD({
        method: "get",
        url: "/summary",
        params: {metrics: "collector.summary"},
        headers: {'Content-Type': 'text/plain'},
      }).then(function (response) {
        var hosts = [];
        _.each(response.data, function (summary) {
          hosts.push(summary.tag.host);
        });
        return hosts;
      }).then(callback);
    };

    this.getPrediction = function(params) {
      return self.alertD({
        method: "get",
        url: "/anomaly/prediction",
        params: params,
        headers: {'Content-Type': 'application/json;'},
      });
    };

    this.getPredictionPercentage = function (params) {
      return self.alertD({
        method: "get",
        url   : "/anomaly/prediction/usages",
        params: params,
        headers: {'Content-Type': 'application/json;'}
      });
    };

    this.getHostsNum = function () {
      return this.alertD({
        method: "get",
        url: "/cmdb/host"
      }).then(function (response) {
        return response.data.length;
      });
    };

    this.saveCustomSoftware = function(params, url) {
      return this.alertD({
        method: "post",
        url: url,
        data: angular.toJson(params),
        headers: {'Content-Type': 'application/json;'},
      });
    };

    this.editServiceHost = function(params) {
      return this.alertD({
        method: "post",
        url: "/cmdb/relationship/overwrite",
        data: angular.toJson(params),
        headers: {'Content-Type': 'application/json;'},
      });
    };

    this.readMetricHelpMessage = function (key) {
      !_.metricMessage[key] && this.get('/api/static/metric/' + key).then(function (result) {
        _.metricMessage[key] = result;
        _.extend(_.metricHelpMessage, result);
      })
      .catch(function (err) {
        // set isHandled true, then alertSrv won't show
        err.isHandled = true;
      });
    };

    this.getHosts = function (query) {
      return this.alertD({
        method: "POST",
        url   : "/host/metrics",
        data  : query
      });
    };

    this.getServices = function() {
      return this.alertD({
        method: 'get',
        url   : "/cmdb/service/metrics"
      });
    }

    this.getKpi = function(params) {
      return this.alertD({
        method: 'get',
        url   : '/service/kpi',
        params: params
      });
    }

    this.editKpi = function(params) {
      return this.alertD({
        method: 'post',
        url   : '/service/kpi',
        params: params
      });
    }

    this.importMetricsKpi = function() {
      return this.get('/api/static/metric/kpi');
    }

    this.isIE = function() {
      var userAgent = navigator.userAgent;
      return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;
    }

    this.getOpentsdbExpressionQuery = function (query, opentsdbUrl) {
      var tags = query.tags || [
        {
          "type": "wildcard",
          "tagk": "host",
          "filter": "*",
          "groupBy": true
        }
      ];
      var tmpl = {
        "time": {
          "start": query.timeRange.from,
          "end": query.timeRange.to,
          "aggregator": "sum",
          "downsampler": {
            "interval": "1m",
            "aggregator": "avg"
          }
        },
        "filters": [
          {
            "tags": tags,
            "id": "f1"
          }
        ],
        "metrics": query.metrics,
        "expressions": [
          {
            "id": "aa",
            "expr": query.metricExpression, // "a + b"
            "join": {
              "operator": "intersection",
              "useQueryTags": true,
              "includeAggTags": false
            }
          }
        ],
        "outputs": [
          { "id": "aa", "alias": "Mega expression" }
        ]
      };

      return this.datasourceRequest({
        method: 'POST',
        url: opentsdbUrl + '/api/query/exp',
        data: tmpl
      });
    }
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 545 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


var DynamicDirectiveSrv = /** @class */ (function () {
    /** @ngInject */
    function DynamicDirectiveSrv($compile, $parse, $rootScope) {
        this.$compile = $compile;
        this.$parse = $parse;
        this.$rootScope = $rootScope;
    }
    DynamicDirectiveSrv.prototype.addDirective = function (element, name, scope) {
        var child = __WEBPACK_IMPORTED_MODULE_0_angular___default.a.element(document.createElement(name));
        this.$compile(child)(scope);
        element.empty();
        element.append(child);
    };
    DynamicDirectiveSrv.prototype.link = function (scope, elem, attrs, options) {
        var _this = this;
        options.directive(scope).then(function (directiveInfo) {
            if (!directiveInfo || !directiveInfo.fn) {
                elem.empty();
                return;
            }
            if (!directiveInfo.fn.registered) {
                __WEBPACK_IMPORTED_MODULE_1__core_module__["default"].directive(attrs.$normalize(directiveInfo.name), directiveInfo.fn);
                directiveInfo.fn.registered = true;
            }
            _this.addDirective(elem, directiveInfo.name, scope);
        }).catch(function (err) {
            console.log('Plugin load:', err);
            _this.$rootScope.appEvent('alert-error', ['Plugin error', err.toString()]);
        });
    };
    DynamicDirectiveSrv.prototype.create = function (options) {
        var _this = this;
        var directiveDef = {
            restrict: 'E',
            scope: options.scope,
            link: function (scope, elem, attrs) {
                if (options.watchPath) {
                    var childScope_1 = null;
                    scope.$watch(options.watchPath, function () {
                        if (childScope_1) {
                            childScope_1.$destroy();
                        }
                        childScope_1 = scope.$new();
                        _this.link(childScope_1, elem, attrs, options);
                    });
                }
                else {
                    _this.link(scope, elem, attrs, options);
                }
            }
        };
        return directiveDef;
    };
    return DynamicDirectiveSrv;
}());
__WEBPACK_IMPORTED_MODULE_1__core_module__["default"].service('dynamicDirectiveSrv', DynamicDirectiveSrv);


/***/ }),
/* 546 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
  __webpack_require__(7),
  __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, coreModule) {
  'use strict';

  coreModule.default.service('utilSrv', function($rootScope, $_modal, $q) {

    this.init = function() {
      $rootScope.onAppEvent('show-modal', this.showModal, $rootScope);
    };

    this.showModal = function(e, options) {
      var modal = $_modal({
        modalClass: options.modalClass,
        template: options.src,
        persist: false,
        show: false,
        scope: options.scope,
        keyboard: false,
        placement: "center"
      });

      $q.when(modal).then(function(modalEl) {
        modalEl.modal('show');
      });
    };

    this.setPie = function (element, pieData, colors, innerRadius) {
      $.plot(element, pieData, {
        series: {
          pie: {
            innerRadius: innerRadius || 0.7,
            show: true,
            stroke: {
              width: 0
            }
          }
        },
        colors: colors
      });
    }

  });

}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 547 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(3),
    __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
    'use strict';
    coreModule.default.service('healthSrv', function ($http, backendSrv, $location, $q) {
      var anomalyListUrl = "/anomaly?by_groups=true";
      var excludeAnomaly = "/anomaly/exclude";
      var includeAnomaly = "/anomaly/include";
      var metricsType = "/metrictype";
      var anomalyHistory = "/anomaly";
      this.anomalyMetricsData = [];
      var _this = this;
      this.load = function () {
        return backendSrv.alertD({
          method: "get",
          url: anomalyListUrl
        }).then(function onSuccess(response) {
          return response.data;
        }, function onFailed(response) {
          return response;
        });
      };

      this.exclude = function (metricName, host) {
        return backendSrv.alertD({
          method: "post",
          url: excludeAnomaly,
          params: {
            metric: metricName,
            host: host
          }
        });
      };

      this.aggregateHealths = function (metricHostClusters) {
        _.each(metricHostClusters, function (cluster, index) {
          cluster.health = 0;
          for (var i = 0; i < cluster.elements.length; i++) {
            cluster.health += cluster.elements[i].health;
          }
          var divisor = cluster.numElements || 1;
          var health = cluster.numElements ? cluster.health : 100;
          cluster.health = Math.floor(health / divisor);
          cluster.index = index;
        });
        return metricHostClusters;
      };

      this.include = function (metricName, host) {
        return backendSrv.alertD({
          method: "post",
          url: includeAnomaly,
          params: {
            metric: metricName,
            host: host
          }
        });
      };

      this.getMetricType = function (metric) {
        return this.getMetricsType([metric]);
      };

      this.getMetricsType = function (metrics) {
        return backendSrv.alertD({
          method: 'GET', url: metricsType, timeout: 2000,
          params: {
            names: metrics.join()
          }
        });
      };

      this.floor = function (metrics) {
        _.each(metrics, function (metric) {
          metric.health = Math.floor(metric.health);
        });
        return metrics;
      };

      this.transformPanelMetricType = function (panel) {
        var targets = {};
        var metricsTypeQueries = [];

        _.forEach(panel.targets, function (target) {
          if (_.excludeMetricSuffix(target.metric)) {
            targets[target.metric] = target;
          }
        });

        if(!Object.keys(targets).length) return;

        var q = _this.getMetricsType(Object.keys(targets)).then(function onSuccess(response) {
          var types = response.data;
          _.each(Object.keys(targets), function (key) {
            if (types[key] === "counter") {
              targets[key].shouldComputeRate = true;
              targets[key].downsampleAggregator = "max";
            } else if (types[key] === "increment") {
              targets[key].shouldComputeRate = false;
              targets[key].downsampleAggregator = "sum";
            }
          });
        });
        metricsTypeQueries.push(q);

        return $q.all(metricsTypeQueries);
      };

      this.transformMetricType = function (dashboard) {
        var targets = {};
        var metricsTypeQueries = [];
        _.forEach(["/association", "/anomaly"], function (uri) {
          if ($location.path().indexOf(uri) > -1) {
            _.forEach(dashboard.rows, function (row) {
              _.forEach(row.panels, function (panel) {
                _.forEach(panel.targets, function (target) {
                  if (_.excludeMetricSuffix(target.metric)) {
                    if (!_.isUndefined(target.metric)) {
                      targets[target.metric] = target;
                    }
                  }
                });
              });
            });

            if(!Object.keys(targets).length) {
              return;
            }
            var q = _this.getMetricsType(Object.keys(targets)).then(function onSuccess(response) {
              var types = response.data;
              _.each(Object.keys(targets), function (key) {
                if (types[key] === "counter") {
                  targets[key].shouldComputeRate = true;
                  targets[key].downsampleAggregator = "max";
                } else if (types[key] === "increment") {
                  targets[key].shouldComputeRate = false;
                  targets[key].downsampleAggregator = "sum";
                }
              });
            });
            metricsTypeQueries.push(q);
          }
        });
        return $q.all(metricsTypeQueries);
      };

      this.loadHistory = function(options, host) {
        var params = {
          from: options.from,
          to: options.to
        };
        host && (params['host'] = host);
        return backendSrv.alertD({
          method: "get",
          params: params,
          url: anomalyHistory
        }).then(function onSuccess(response) {
          return response.data;
        }, function onFailed(response) {
          return response;
        });
      };
    });
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 548 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular,coreModule) {
  'use strict';
  coreModule.default.service('integrateSrv',function () {
    return {
        options : {}
    };
  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 549 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
    __webpack_require__(7),
    __webpack_require__(3),
    __webpack_require__(2),
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (angular, _, coreModule) {
  'use strict';
  coreModule.default.service('oncallerMgrSrv', function($http, alertSrv, backendSrv, contextSrv) {
    this.oncallerDefMap = {};
    this.currentEditUser = {};
    var self = this;
    var oncallerUrl = "/oncaller/definition";
    var oncallerScheduleUrl = "/oncaller/schedule";

    this.load = function() {
      return backendSrv.alertD({
        method: "get",
        url: oncallerUrl,
      }).then(function onSuccess(response) {
        for (var i = 0; i < response.data.length; i++) {
          var theoncallerDef = response.data[i];
          self.oncallerDefMap[theoncallerDef.id] = theoncallerDef;
        }
        return response;
      }, function onFailed(response) {
        alertSrv.set("error", response.status + " " + (response.data || "Request failed"), response.severity, 5000);
        return response;
      });
    };

    this.save = function(oncallerDef) {
      oncallerDef.org = contextSrv.user.orgId;
      return backendSrv.alertD({
        method: "post",
        url: oncallerUrl,
        data: angular.toJson(oncallerDef),
        headers: {'Content-Type': 'text/plain'},
      });
    };

    this.remove = function(oncallerOrg, oncallerService, oncallerId) {
      return backendSrv.alertD({
        method: "delete",
        url: oncallerUrl,
        params: {org: oncallerOrg, service: oncallerService, id: oncallerId},
        headers: {'Content-Type': 'text/plain'},
      });
    };

    //id is in the form of id
    this.get = function(id) {
      return self.oncallerDefMap[id];
    };

    this.loadSchedule = function (start, end) {
      return backendSrv.alertD({
        method: "get",
        url: oncallerScheduleUrl,
        params: {
          startSec: start,
          endSec: end
        }
      }).then(function onSuccess(response) {
        return response;
      }, function onFailed(response) {
        return response;
      });
    };

    this.updateSchedule = function (data) {
      return backendSrv.alertD({
        method: "post",
        url: oncallerScheduleUrl,
        data: angular.toJson(data),
        headers: {'Content-Type': 'text/plain'},
      });
    };

  });
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 550 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServiceDepSrv", function() { return ServiceDepSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


var ServiceDepSrv = /** @class */ (function () {
    /** @ngInject */
    function ServiceDepSrv($http, $timeout, $q, alertSrv, backendSrv) {
        this.$http = $http;
        this.$timeout = $timeout;
        this.$q = $q;
        this.alertSrv = alertSrv;
        this.backendSrv = backendSrv;
    }
    // All Services
    ServiceDepSrv.prototype.readInstalledService = function () {
        return this.backendSrv.alertD({
            url: "/cmdb/service"
        });
    };
    // Service Dependency
    ServiceDepSrv.prototype.createServiceDependency = function (graph) {
        return this.backendSrv.alertD({
            method: "post",
            url: "/cmdb/service/depend",
            data: graph,
            headers: { 'Content-Type': 'text/plain' }
        });
    };
    ServiceDepSrv.prototype.updateServiceDependency = function (graph, updateId, graphId) {
        return this.backendSrv.alertD({
            method: "PUT",
            url: "/cmdb/service/depend?id=" + updateId + "&aid=" + graphId,
            data: graph,
            headers: { 'Content-Type': 'text/plain' }
        });
    };
    ServiceDepSrv.prototype.readServiceDependency = function () {
        return this.backendSrv.alertD({
            url: "/cmdb/service/depend"
        });
    };
    // Kpi
    ServiceDepSrv.prototype.readServiceStatus = function (serviceId, serviceName) {
        return this.backendSrv.alertD({
            url: "/service/status?hostStatusIncluded=false&service=" + serviceName + "&serviceId=" + serviceId
        });
    };
    ServiceDepSrv.prototype.readHostStatus = function (serviceId, serviceName) {
        return this.backendSrv.alertD({
            url: "/service/status?healthItemType=ServiceState&service=" + serviceName + "&serviceId=" + serviceId
        });
    };
    ServiceDepSrv.prototype.readMetricStatus = function (serviceId, serviceName) {
        return this.backendSrv.alertD({
            url: "/service/status?service=" + serviceName + "&serviceId=" + serviceId
        });
    };
    // Service Topology
    ServiceDepSrv.prototype.getServiceTopologyData = function (params) {
        var _this = this;
        return this.readInstalledService().then(function (response) {
            var promiseList = [];
            _this.topology = [];
            response.data.forEach(function (item) {
                var q = _this.readServiceStatus(item.id, item.name).then(function (response) {
                    _this.topology.push({
                        parent: 'All',
                        name: item.name,
                        value: response.data.healthStatusType.toLowerCase(),
                        _private_: item
                    });
                }, function (err) {
                    _this.topology.push({
                        parent: 'All',
                        name: item.name,
                        value: 'grey',
                        _private_: item
                    });
                });
                promiseList.push(q);
            });
            return _this.$q.all(promiseList).then(function () {
                _this.topology = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.orderBy(_this.topology, ['name'], ['asc']);
                return _this.topology;
            });
        });
    };
    return ServiceDepSrv;
}());

__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].service('serviceDepSrv', ServiceDepSrv);


/***/ }),
/* 551 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HostSrv", function() { return HostSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />


var HostSrv = /** @class */ (function () {
    /** @ngInject */
    function HostSrv($http, backendSrv, $translate) {
        this.$http = $http;
        this.backendSrv = backendSrv;
        this.$translate = $translate;
    }
    // Host Tags
    /**
     * Get the specific host information in cmdb.
     * @param hostId.
     * @returns {Array} Host information.
     */
    HostSrv.prototype.getCmdbHostInfo = function (hostId) {
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/cmdb/host',
            params: { 'id': hostId }
        });
    };
    /**
     * Get all tags key in this system.
     * @returns {Array} Tags key in this system.
     */
    HostSrv.prototype.getAllTagsKey = function () {
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/host/tag/key'
        });
    };
    /**
     * Get the specific tag's value.
     * @returns {Array} Tag's value.
     */
    HostSrv.prototype.getTagValue = function (key) {
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/host/tag/value',
            params: { 'key': key }
        });
    };
    /**
     * Post a tag.
     * @returns {String|Null} If the tag was added, return the tag key. Otherwise, none.
     */
    HostSrv.prototype.postTag = function (_a) {
        var key = _a.key, value = _a.value, hostId = _a.hostId;
        return this.backendSrv.alertD({
            method: 'POST',
            url: '/host/tag',
            params: { 'hostId': hostId },
            data: { 'key': key, 'value': value }
        });
    };
    /**
     * Delete a tag.
     * @returns {Null}
     */
    HostSrv.prototype.deleteTag = function (_a) {
        var hostId = _a.hostId, key = _a.key, value = _a.value;
        return this.backendSrv.alertD({
            method: 'DELETE',
            url: '/host/tag',
            params: { 'hostId': hostId, 'key': key, 'value': value }
        });
    };
    // Host Topology
    /**
     * Get the host topology graph with given params.
     * @param groupBy group rule.
     * @param colorBy filter rule.
     * @returns {Array|Object}
     */
    HostSrv.prototype.getHostTopology = function (params) {
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/host/topology',
            params: params
        });
    };
    HostSrv.prototype.getHostTopologyData = function (params) {
        var _this = this;
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/host/topology',
            params: params
        }).then(function (response) {
            _this.topology = [];
            if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isArray(response.data)) {
                response.data.forEach(function (item) {
                    _this.topology.push({
                        parent: 'All',
                        name: item.hostname,
                        value: item.healthStatusType.toLowerCase(),
                        ip: item.defaultIp,
                        _private_: item
                    });
                });
            }
            else {
                for (var prop in response.data) {
                    response.data[prop].forEach(function (item) {
                        _this.topology.push({
                            parent: prop,
                            name: item.hostname,
                            value: item.healthStatusType.toLowerCase(),
                            ip: item.defaultIp,
                            _private_: item
                        });
                    });
                }
            }
            _this.topology = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.orderBy(_this.topology, ['name'], ['asc']);
            return _this.topology;
        });
    };
    // Host Process
    /**
     * Get the specific host's process.
     * @param Object include hostId(or hostname) & from & to
     * @returns {Array} host's process information.
     */
    HostSrv.prototype.getHostProcess = function (hostId) {
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/host/state',
            params: { 'hostId': hostId }
        });
    };
    HostSrv.prototype.getProcess = function (params) {
        return this.backendSrv.alertD({
            method: 'GET',
            url: '/host/state',
            params: params
        });
    };
    // Host Information
    /**
     * Get host's information.
     * @return {Array} host's information: cpu, mem, disk, state, version, startTime, commitId, id.
     */
    HostSrv.prototype.getHostInfo = function () {
        var _this = this;
        var query = {
            "queries": [
                {
                    "metric": "cpu.usr"
                },
                {
                    "metric": "collector.state"
                },
                {
                    "metric": "proc.meminfo.percentused"
                },
                {
                    "metric": "df.bytes.percentused",
                    "tags": [
                        {
                            "name": "mount",
                            "value": "/"
                        }
                    ]
                }
            ],
            "hostProperties": ["version", "startTime", "commit", "id", "defaultIp"]
        };
        this.hostInfo = [];
        return this.backendSrv.alertD({
            method: "POST",
            url: "/host/metrics",
            data: query
        }).then(function (response) {
            response.data && response.data.forEach(function (item) {
                _this.hostInfo.push({
                    "host": item.hostname,
                    "id": item.id,
                    "status": _this.$translate.i18n[__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.statusFormatter(item["collector.state"])],
                    "disk": __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.percentFormatter(item["df.bytes.percentused"]),
                    "cpu": __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.percentFormatter(item["cpu.usr"]),
                    "mem": __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.percentFormatter(item["proc.meminfo.percentused"]),
                    "commit": item.commit,
                    "startTime": item.startTime,
                    "version": item.version,
                    "defaultIp": item.defaultIp
                });
            });
            _this.hostInfo = __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.orderBy(_this.hostInfo, ['host'], ['asc']);
            return _this.hostInfo;
        });
    };
    // Host KPI
    /**
     * Get host's kpi.
     * @return {Array} host's kpi.
     */
    HostSrv.prototype.getHostKpi = function (_a) {
        var hostname = _a.hostname;
        return this.backendSrv.alertD({
            method: "GET",
            url: "/service/hostStatus",
            params: { host: hostname }
        });
    };
    return HostSrv;
}());

__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].service('hostSrv', HostSrv);


/***/ }),
/* 552 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssociationSrv", function() { return AssociationSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);

var AssociationSrv = /** @class */ (function () {
    /** @ngInject */
    function AssociationSrv(alertMgrSrv) {
        this.alertMgrSrv = alertMgrSrv;
    }
    AssociationSrv.prototype.setSourceAssociation = function (_a) {
        var metric = _a.metric, host = _a.host, min = _a.min, max = _a.max, start = _a.start;
        this.sourceAssociation = {
            metric: metric,
            host: host,
            start: start,
            min: min,
            max: max
        };
    };
    AssociationSrv.prototype.updateRang = function (range) {
        this.sourceAssociation.min = range[0];
        this.sourceAssociation.max = range[1];
    };
    return AssociationSrv;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].service('associationSrv', AssociationSrv);


/***/ }),
/* 553 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuideSrv", function() { return GuideSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);

var GuideSrv = /** @class */ (function () {
    /** @ngInject */
    function GuideSrv(alertMgrSrv, associationSrv) {
        this.alertMgrSrv = alertMgrSrv;
        this.associationSrv = associationSrv;
    }
    return GuideSrv;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].service('guideSrv', GuideSrv);


/***/ }),
/* 554 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LogParseSrv", function() { return LogParseSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var LogParseSrv = /** @class */ (function () {
    /** @ngInject */
    function LogParseSrv(backendSrv) {
        this.backendSrv = backendSrv;
    }
    LogParseSrv.prototype.getListRule = function (orgId, sysId) {
        return this.backendSrv.alertD({
            url: '/cmdb/pattern/list',
            params: {
                orgId: orgId,
                sysId: sysId
            }
        });
    };
    LogParseSrv.prototype.getTemplate = function (params) {
        return this.backendSrv.alertD({
            url: '/cmdb/pattern/template',
            params: params
        });
    };
    LogParseSrv.prototype.getRuleById = function (id) {
        return this.backendSrv.alertD({
            url: '/cmdb/pattern/getById',
            params: {
                ruleId: id
            }
        });
    };
    LogParseSrv.prototype.getServiceList = function () {
        return this.backendSrv.alertD({ url: '/cmdb/service' });
    };
    LogParseSrv.prototype.getHostList = function () {
        return this.backendSrv.alertD({ url: '/cmdb/host' });
    };
    LogParseSrv.prototype.validatePattern = function (pattern) {
        return this.backendSrv.alertD({
            url: '/cmdb/pattern/validate',
            method: 'post',
            data: {
                log: pattern.log,
                pattern: pattern.pattern,
                type: pattern.type,
                namedCaptureOnly: true,
                isMetric: pattern.isMetric
            }
        });
    };
    LogParseSrv.prototype.savePattern = function (userId, data) {
        return this.backendSrv.alertD({
            url: '/cmdb/pattern/save',
            method: 'post',
            params: {
                userId: userId
            },
            data: data
        });
    };
    LogParseSrv.prototype.deletePattern = function (ruleId, userId) {
        return this.backendSrv.alertD({
            url: '/cmdb/pattern/delete',
            method: 'delete',
            params: {
                ruleId: ruleId,
                userId: userId
            }
        });
    };
    LogParseSrv.prototype.checktask = function (data) {
        return this.backendSrv.alertD({
            url: '/cmdb/log/checktask',
            method: 'post',
            data: data
        });
    };
    LogParseSrv.prototype.getChecktask = function (params) {
        return this.backendSrv.alertD({
            url: '/cmdb/log/check',
            params: params
        });
    };
    return LogParseSrv;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].service('logParseSrv', LogParseSrv);


/***/ }),
/* 555 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MetricSrv", function() { return MetricSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var MetricSrv = /** @class */ (function () {
    /** @ngInject */
    function MetricSrv(backendSrv) {
        this.backendSrv = backendSrv;
    }
    MetricSrv.prototype.getSubtype = function () {
        return this.backendSrv.alertD({
            url: '/metric/subtype'
        });
    };
    MetricSrv.prototype.getSuggest = function (query) {
        return this.backendSrv.alertD({
            url: '/metric/suggest',
            params: {
                q: query
            }
        });
    };
    /**
     * getMetricInfo params
     *  @param {size} number The page size.
     *  @param {page} number The page number
     *  @param {id} number The metric id
     *  @param {name} string The metric name
     *  @param {type} string 服务/系统
     *  @param {subtype} string serviceName/CPU/IO/JVM/内存/存储/网络/运行状态
     */
    MetricSrv.prototype.getMetricInfo = function (params) {
        return this.backendSrv.alertD({
            url: '/metric/info',
            params: params
        });
    };
    /**
     * updateMetricInfo params
     *  @param {id} number metricId
     *  @param {userId} number userId
     */
    MetricSrv.prototype.updateMetricInfo = function (params, data) {
        return this.backendSrv.alertD({
            method: 'post',
            url: '/metric/info',
            params: params,
            data: data
        });
    };
    return MetricSrv;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].service('metricSrv', MetricSrv);


/***/ }),
/* 556 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportSrv", function() { return ReportSrv; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />

var ReportSrv = /** @class */ (function () {
    /** @ngInject */
    function ReportSrv(backendSrv, contextSrv) {
        this.backendSrv = backendSrv;
        this.contextSrv = contextSrv;
    }
    ReportSrv.prototype.getExpertReports = function () {
        var _this = this;
        return this.backendSrv.get('/api/static/template/' + this.contextSrv.user.orgId).then(function (res) {
            return { reports: res.reports, url: _this.backendSrv.downloadUrl + '/report' };
        });
    };
    ReportSrv.prototype.getReportConfig = function () {
        return this.backendSrv.alertD({
            url: '/reporting/config'
        });
    };
    /**
     * saveReportConfig data
     * @param {enabled} boolean 是否开启功能
     * @param {recipients} arrary 邮件通知列表
     * @param {delieverHour} number 发送邮件时间
     * @param {sections} array 配置的模块
     */
    ReportSrv.prototype.saveReportConfig = function (data) {
        return this.backendSrv.alertD({
            url: '/reporting/config',
            method: 'post',
            data: data
        });
    };
    /**
     * getMetricInfo params
     */
    ReportSrv.prototype.getReportList = function () {
        return this.backendSrv.alertD({
            url: '/reporting',
        });
    };
    /**
     * getReportById params
     */
    ReportSrv.prototype.getReportById = function (id) {
        return this.backendSrv.alertD({
            url: '/reporting',
            responseType: 'arraybuffer',
            params: {
                id: id
            }
        });
    };
    return ReportSrv;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].service('reportSrv', ReportSrv);


/***/ }),
/* 557 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dashboard_loaders__ = __webpack_require__(558);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_app_core_core_module__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bundle_loader__ = __webpack_require__(559);
///<reference path="../../headers/common.d.ts" />



/** @ngInject **/
function setupAngularRoutes($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    var loadPluginsBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/plugins/all');
    var loadAdminBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/admin/admin');
    var loadOrgBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/org/all');
    var loadOncallerBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/oncaller/all');
    var loadCMDBBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/cmdb/all');
    var loadSetupBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/setup/all');
    var loadSummaryBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/summary/all');
    var loadAnomalyBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/anomaly/all');
    var loadServiceBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/service/all');
    var loadAnalysisBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/analysis/all');
    var loadLogsBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/logs/all');
    var loadReportBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/report/reportCtrl');
    var loadRcaBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/rca/all');
    var loadHostBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/host/all');
    var loadKnowledgeBundle = new __WEBPACK_IMPORTED_MODULE_2__bundle_loader__["a" /* BundleLoader */]('app/features/knowledge/all');
    $routeProvider
        .when('/', {
        templateUrl: 'public/app/features/systemoverview/partials/system_overview.html',
        controller: 'SystemOverviewCtrl',
        reloadOnSearch: false,
    })
        .when('/dashboardlist', {
        templateUrl: 'public/app/partials/dashboard.html',
        controller: 'LoadDashboardCtrl',
        reloadOnSearch: false,
        pageClass: 'page-dashboard',
    })
        .when('/systems', {
        templateUrl: 'public/app/partials/systems.html',
        reloadOnSearch: false,
    })
        .when('/dashboard/:type/:slug', {
        templateUrl: 'public/app/partials/dashboard.html',
        controller: 'LoadDashboardCtrl',
        reloadOnSearch: false,
        pageClass: 'page-dashboard',
    })
        .when('/dashboard-solo/:type/:slug', {
        templateUrl: 'public/app/features/panel/partials/soloPanel.html',
        controller: 'SoloPanelCtrl',
        pageClass: 'page-dashboard',
    })
        .when('/dashboard-import/:file', {
        templateUrl: 'public/app/partials/dashboard.html',
        controller: 'DashFromImportCtrl',
        reloadOnSearch: false,
        pageClass: 'page-dashboard',
    })
        .when('/dashboard/new', {
        templateUrl: 'public/app/partials/dashboard.html',
        controller: 'NewDashboardCtrl',
        reloadOnSearch: false,
        pageClass: 'page-dashboard',
    })
        .when('/import/dashboard', {
        templateUrl: 'public/app/features/dashboard/partials/import.html',
        controller: 'DashboardImportCtrl',
    })
        .when('/datasources', {
        templateUrl: 'public/app/features/plugins/partials/ds_list.html',
        controller: 'DataSourcesCtrl',
        controllerAs: 'ctrl',
        resolve: loadPluginsBundle,
    })
        .when('/datasources/edit/:id', {
        templateUrl: 'public/app/features/plugins/partials/ds_edit.html',
        controller: 'DataSourceEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadPluginsBundle,
    })
        .when('/datasources/new', {
        templateUrl: 'public/app/features/plugins/partials/ds_edit.html',
        controller: 'DataSourceEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadPluginsBundle,
    })
        .when('/alerts', {
        templateUrl: 'public/app/features/org/partials/alerts.html',
        controller: 'AlertsCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/alerts/edit/:id', {
        templateUrl: 'public/app/features/org/partials/alertEdit.html',
        controller: 'AlertEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/alerts/new', {
        templateUrl: 'public/app/features/org/partials/alertEdit.html',
        controller: 'AlertEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/alerts/status', {
        templateUrl: 'public/app/features/org/partials/alertStatus.html',
        controller: 'AlertStatusCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/oncallerschedule', {
        templateUrl: 'public/app/features/oncaller/partials/oncallerSchedule.html',
        controller: 'OnCallerScheduleCtrl',
        resolve: loadOncallerBundle,
    })
        .when('/oncallers', {
        templateUrl: 'public/app/features/oncaller/partials/oncallers.html',
        controller: 'OnCallersCtrl',
        controllerAs: 'ctrl',
        resolve: loadOncallerBundle,
    })
        .when('/oncallers/edit/:id', {
        templateUrl: 'public/app/features/oncaller/partials/oncallerEdit.html',
        controller: 'OnCallerEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadOncallerBundle,
    })
        .when('/oncallers/new', {
        templateUrl: 'public/app/features/oncaller/partials/oncallerEdit.html',
        controller: 'OnCallerEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadOncallerBundle,
    })
        .when('/anomaly', {
        templateUrl: 'public/app/features/anomaly/partials/anomaly.html',
        controller: 'AnomalyCtrl',
        resolve: loadAnomalyBundle,
    })
        .when('/anomaly/history', {
        templateUrl: 'public/app/features/anomaly/partials/anomalyHistory.html',
        controller: 'AnomalyHistory',
        resolve: loadAnomalyBundle,
    })
        .when('/anomaly/:clusterId', {
        templateUrl: 'public/app/features/anomaly/partials/anomalyMetric.html',
        controller: 'AnomalyMetric',
        reloadOnSearch: true,
        resolve: loadAnomalyBundle,
    })
        .when('/decompose', {
        templateUrl: 'public/app/features/decompose/partials/compose.html',
        controller: 'DecomposeMetricCtrl'
    })
        .when('/org', {
        templateUrl: 'public/app/features/org/partials/orgDetails.html',
        controller: 'OrgDetailsCtrl',
        resolve: loadOrgBundle,
    })
        .when('/org/new', {
        templateUrl: 'public/app/features/org/partials/newOrg.html',
        controller: 'NewOrgCtrl',
        resolve: loadOrgBundle,
    })
        .when('/org/users', {
        templateUrl: 'public/app/features/org/partials/orgUsers.html',
        controller: 'OrgUsersCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/org/apikeys', {
        templateUrl: 'public/app/features/org/partials/orgApiKeys.html',
        controller: 'OrgApiKeysCtrl',
        resolve: loadOrgBundle,
    })
        .when('/profile', {
        templateUrl: 'public/app/features/org/partials/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/profile/password', {
        templateUrl: 'public/app/features/org/partials/change_password.html',
        controller: 'ChangePasswordCtrl',
        resolve: loadOrgBundle,
    })
        .when('/profile/select-org', {
        templateUrl: 'public/app/features/org/partials/select_org.html',
        controller: 'SelectOrgCtrl',
        resolve: loadOrgBundle,
    })
        .when('/admin', {
        templateUrl: 'public/app/features/admin/partials/admin_home.html',
        controller: 'AdminHomeCtrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/settings', {
        templateUrl: 'public/app/features/admin/partials/settings.html',
        controller: 'AdminSettingsCtrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/stats', {
        templateUrl: 'public/app/features/admin/partials/stats.html',
        controller: 'AdminStatsCtrl',
        controllerAs: 'ctrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/users', {
        templateUrl: 'public/app/features/admin/partials/users.html',
        controller: 'AdminListUsersCtrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/users/create', {
        templateUrl: 'public/app/features/admin/partials/new_user.html',
        controller: 'AdminEditUserCtrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/users/edit/:id', {
        templateUrl: 'public/app/features/admin/partials/edit_user.html',
        controller: 'AdminEditUserCtrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/orgs', {
        templateUrl: 'public/app/features/admin/partials/orgs.html',
        controller: 'AdminListOrgsCtrl',
        resolve: loadAdminBundle,
    })
        .when('/admin/orgs/edit/:id', {
        templateUrl: 'public/app/features/admin/partials/edit_org.html',
        controller: 'AdminEditOrgCtrl',
        resolve: loadAdminBundle,
    })
        .when('/login', {
        templateUrl: 'public/app/partials/login.html',
        controller: 'LoginCtrl',
    })
        .when('/signupfree', {
        templateUrl: 'public/app/partials/signup.html',
        controller: 'SignupFreeCtrl',
    })
        .when('/invite/:code', {
        templateUrl: 'public/app/partials/signup_invited.html',
        controller: 'InvitedCtrl',
    })
        .when('/signup', {
        templateUrl: 'public/app/partials/signup_step2.html',
        controller: 'SignUpCtrl',
    })
        .when('/user/password/send-reset-email', {
        templateUrl: 'public/app/partials/reset_password.html',
        controller: 'ResetPasswordCtrl',
    })
        .when('/user/password/reset', {
        templateUrl: 'public/app/partials/reset_password.html',
        controller: 'ResetPasswordCtrl',
    })
        .when('/dashboard/snapshots', {
        templateUrl: 'public/app/features/snapshot/partials/snapshots.html',
        controller: 'SnapshotsCtrl',
        controllerAs: 'ctrl',
    })
        .when('/plugins', {
        templateUrl: 'public/app/features/plugins/partials/plugin_list.html',
        controller: 'PluginListCtrl',
        controllerAs: 'ctrl',
        resolve: loadPluginsBundle,
    })
        .when('/plugins/:pluginId/edit', {
        templateUrl: 'public/app/features/plugins/partials/plugin_edit.html',
        controller: 'PluginEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadPluginsBundle,
    })
        .when('/plugins/:pluginId/page/:slug', {
        templateUrl: 'public/app/features/plugins/partials/plugin_page.html',
        controller: 'AppPageCtrl',
        controllerAs: 'ctrl',
        resolve: loadPluginsBundle,
    })
        .when('/global-alerts', {
        templateUrl: 'public/app/features/dashboard/partials/globalAlerts.html',
    })
        .when('/logs', {
        templateUrl: 'public/app/features/logs/partials/logs.html',
        controller: 'LogsCtrl',
        controllerAs: 'ctrl',
        resolve: loadLogsBundle,
    })
        .when('/logs/rules', {
        templateUrl: 'public/app/features/logs/partials/log_rules.html',
        controller: 'LogParseCtrl',
        controllerAs: 'ctrl',
        resolve: loadLogsBundle,
    })
        .when('/logs/rule-detail', {
        templateUrl: 'public/app/features/logs/partials/log_rule_detail.html',
        controller: 'LogParseCtrl',
        controllerAs: 'ctrl',
        resolve: loadLogsBundle,
    })
        .when('/logs/rules/new', {
        templateUrl: 'public/app/features/logs/partials/log_rules_new.html',
        controller: 'LogParseEditCtrl',
        controllerAs: 'ctrl',
        resolve: loadLogsBundle,
    })
        .when('/analysis', {
        templateUrl: 'public/app/features/analysis/partials/analysis.html',
        controller: 'AnalysisCtrl',
        resolve: loadAnalysisBundle,
    })
        .when('/association', {
        templateUrl: 'public/app/features/org/partials/alertAssociation.html',
        controller: 'AlertAssociationCtrl',
        controllerAs: 'ctrl',
        resolve: loadOrgBundle,
    })
        .when('/knowledgebase', {
        templateUrl: 'public/app/features/knowledge/partials/knowledge_base.html',
        controller: 'CreateKnowledgeCtrl',
        resolve: loadKnowledgeBundle,
    })
        .when('/customer', {
        templateUrl: 'public/app/features/summary/partials/customer.html',
        controller: 'CustomerCtrl',
        resolve: loadSummaryBundle,
    })
        .when('/report', {
        templateUrl: 'public/app/features/report/partials/report.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl',
        resolve: loadReportBundle
    })
        .when('/report/template', {
        templateUrl: 'public/app/features/report/partials/report_template.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl',
        resolve: loadReportBundle
    })
        .when('/report/edit', {
        templateUrl: 'public/app/features/report/partials/report_edit.html',
        controller: 'ReportCtrl',
        reloadOnSearch: false,
        controllerAs: 'ctrl',
        resolve: loadReportBundle
    })
        .when('/integrate', {
        templateUrl: 'public/app/features/analysis/partials/logIntegrate.html',
        controller: 'LogIntegrateCtrl',
        resolve: loadAnalysisBundle,
    })
        .when('/setting/agent', {
        templateUrl: 'public/app/features/setup/partials/host_agent.html',
        controller: 'HostAgentCtrl',
        resolve: loadSetupBundle,
    })
        .when('/setting/service', {
        templateUrl: 'public/app/features/setup/partials/service_agent.html',
        controller: 'ServiceAgentCtrl',
        resolve: loadSetupBundle,
    })
        .when('/setting/log', {
        templateUrl: 'public/app/features/setup/partials/log.html',
        reloadOnSearch: false,
    })
        .when('/setting/proxy', {
        templateUrl: 'public/app/features/setup/partials/proxy.html',
        reloadOnSearch: false,
    })
        .when('/setting/problems', {
        templateUrl: 'public/app/features/setup/partials/problems.html',
        reloadOnSearch: false,
        controllerAs: 'ctrl',
        controller: 'ProblemsCtrl',
        resolve: loadSetupBundle,
    })
        .when('/cmdb/hostlist', {
        templateUrl: 'public/app/features/cmdb/partials/host_list.html',
        controller: 'HostListCtrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/hostlist/hostdetail', {
        templateUrl: 'public/app/features/cmdb/partials/host_detail.html',
        controller: 'HostDetailCtrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/servicelist', {
        templateUrl: 'public/app/features/cmdb/partials/service_list.html',
        controller: 'ServiceListCtrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/servicelist/servicedetail', {
        templateUrl: 'public/app/features/cmdb/partials/service_detail.html',
        controller: 'CMDBServiceDetailCtrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/config', {
        templateUrl: 'public/app/features/cmdb/partials/uagent.html',
        controller: 'UagentCtrl',
        controllerAs: 'ctrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/config/edit', {
        templateUrl: 'public/app/features/cmdb/partials/uagent_edit.html',
        controller: 'UagentCtrl',
        controllerAs: 'ctrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/servicecustom', {
        templateUrl: 'public/app/features/cmdb/partials/service_custom.html',
        controller: 'ServiceCustomCtrl',
        controllerAs: 'ctrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/metrics', {
        templateUrl: 'public/app/features/cmdb/partials/metrics_def.html',
        controller: 'MetricsDefCtrl',
        controllerAs: 'ctrl',
        resolve: loadCMDBBundle
    })
        .when('/cmdb/kpi', {
        templateUrl: 'public/app/features/cmdb/partials/metric_kpi.html',
        controller: 'MetricKpiCtrl',
        controllerAs: 'ctrl',
        resolve: loadCMDBBundle
    })
        .when('/service_dependency', {
        templateUrl: 'public/app/features/service/partials/service_dep.html',
        controller: 'BuildDependCtrl',
        controllerAs: 'ctrl',
        resolve: loadServiceBundle,
    })
        .when('/rca', {
        templateUrl: 'public/app/features/rca/partials/rca.html',
        controller: 'RootCauseAnalysisCtrl',
        reloadOnSearch: false,
        resolve: loadRcaBundle,
    })
        .when('/host_topology', {
        templateUrl: 'public/app/features/host/partials/host.html',
        controller: 'HostTopologyCtrl',
        reloadOnSearch: false,
        resolve: loadHostBundle
    })
        .when('/service_topology', {
        templateUrl: 'public/app/features/service/partials/service.html',
        controller: 'ServiceTopologyCtrl',
        reloadOnSearch: false,
        resolve: loadServiceBundle
    })
        .when('/styleguide/:page?', {
        controller: 'StyleGuideCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'public/app/features/styleguide/styleguide.html',
    })
        .when('/topn', {
        controller: 'TopNCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'public/app/features/topn/partials/topn.html'
    })
        .otherwise({
        templateUrl: 'public/app/partials/error.html',
        controller: 'ErrorCtrl',
        reloadOnSearch: false,
    });
}
__WEBPACK_IMPORTED_MODULE_1_app_core_core_module__["default"].config(setupAngularRoutes);


/***/ }),
/* 558 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export LoadDashboardCtrl */
/* unused harmony export DashFromImportCtrl */
/* unused harmony export NewDashboardCtrl */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_app_core_core_module__ = __webpack_require__(2);

var LoadDashboardCtrl = /** @class */ (function () {
    /** @ngInject */
    function LoadDashboardCtrl($scope, $routeParams, $location, dashboardLoaderSrv, backendSrv) {
        this.$scope = $scope;
        this.$routeParams = $routeParams;
        this.$location = $location;
        this.dashboardLoaderSrv = dashboardLoaderSrv;
        this.backendSrv = backendSrv;
        if (!$routeParams.slug) {
            backendSrv.get('/api/dashboards/home').then(function (homeDash) {
                if (homeDash.redirectUri) {
                    $location.path('dashboard/' + homeDash.redirectUri);
                }
                else {
                    var meta = homeDash.meta;
                    meta.canSave = meta.canShare = meta.canStar = false;
                    $scope.initDashboard(homeDash, $scope);
                }
            });
            return;
        }
        dashboardLoaderSrv.loadDashboard($routeParams.type, $routeParams.slug).then(function (result) {
            $scope.initDashboard(result, $scope);
        });
    }
    return LoadDashboardCtrl;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].controller('LoadDashboardCtrl', LoadDashboardCtrl);
var DashFromImportCtrl = /** @class */ (function () {
    /** @ngInject */
    function DashFromImportCtrl($scope, $location, alertSrv, $translate) {
        this.$scope = $scope;
        this.$location = $location;
        this.alertSrv = alertSrv;
        this.$translate = $translate;
        if (!window.grafanaImportDashboard) {
            alertSrv.set($translate.i18n_sorry, $translate.page_dash_err_tip1, 'warning', 7000);
            $location.path('');
            return;
        }
        $scope.initDashboard({
            meta: { canShare: false, canStar: false },
            dashboard: window.grafanaImportDashboard
        }, $scope);
    }
    return DashFromImportCtrl;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].controller('DashFromImportCtrl', DashFromImportCtrl);
var NewDashboardCtrl = /** @class */ (function () {
    /** @ngInject */
    function NewDashboardCtrl($scope, $routeParams) {
        this.$scope = $scope;
        this.$routeParams = $routeParams;
        var newTitle = $routeParams.title || "new dashboard";
        var newSystem = $routeParams.system;
        $scope.initDashboard({
            meta: { canStar: false, canShare: false },
            dashboard: {
                title: newTitle,
                system: newSystem,
                rows: [{ height: '250px', panels: [] }],
                time: { from: "now-6h", to: "now" },
                refresh: "30s",
            },
        }, $scope);
    }
    return NewDashboardCtrl;
}());

__WEBPACK_IMPORTED_MODULE_0_app_core_core_module__["default"].controller('NewDashboardCtrl', NewDashboardCtrl);


/***/ }),
/* 559 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BundleLoader; });
///<reference path="../../headers/common.d.ts" />
var BundleLoader = /** @class */ (function () {
    function BundleLoader(bundleName) {
        var _this = this;
        this.lazy = ["$q", "$route", "$rootScope", function ($q, $route, $rootScope) {
                if (_this.loadingDefer) {
                    return _this.loadingDefer.promise;
                }
                _this.loadingDefer = $q.defer();
                __webpack_require__(560)(bundleName).then(function () {
                    _this.loadingDefer.resolve();
                });
                return _this.loadingDefer.promise;
            }];
    }
    return BundleLoader;
}());



/***/ }),
/* 560 */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 560;

/***/ }),
/* 561 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_app_core_utils_datemath__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_module__ = __webpack_require__(2);
///<reference path="../../headers/common.d.ts" />





__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('stringSort', function () {
    return function (input) {
        return input.sort();
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('slice', function () {
    return function (arr, start, end) {
        if (!__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isUndefined(arr)) {
            return arr.slice(start, end);
        }
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('stringify', function () {
    return function (arr) {
        if (__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isObject(arr) && !__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isArray(arr)) {
            return __WEBPACK_IMPORTED_MODULE_1_angular___default.a.toJson(arr);
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isNull(arr) ? null : arr.toString();
        }
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('moment', function () {
    return function (date, mode) {
        switch (mode) {
            case 'ago':
                return __WEBPACK_IMPORTED_MODULE_2_moment___default()(date).fromNow();
        }
        return __WEBPACK_IMPORTED_MODULE_2_moment___default()(date).fromNow();
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('noXml', function () {
    var noXml = function (text) {
        return __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isString(text)
            ? text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/'/g, '&#39;')
                .replace(/"/g, '&quot;')
            : text;
    };
    return function (text) {
        return __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isArray(text)
            ? __WEBPACK_IMPORTED_MODULE_0_lodash___default.a.map(text, noXml)
            : noXml(text);
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('interpolateTemplateVars', function (templateSrv) {
    var filterFunc = function (text, scope) {
        var scopedVars;
        if (scope.ctrl && scope.ctrl.panel) {
            scopedVars = scope.ctrl.panel.scopedVars;
        }
        else {
            scopedVars = scope.row.scopedVars;
        }
        return templateSrv.replaceWithText(text, scopedVars);
    };
    filterFunc.$stateful = true;
    return filterFunc;
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('formatItemType', function () {
    return function (text) {
        return text && text.replace('Host', '').replace('Service', '');
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('translateItemType', function ($translate) {
    return function (text) {
        var map = {
            "mem": $translate.i18n.i18n_mem,
            "io": $translate.i18n.i18n_io,
            "nw": $translate.i18n.i18n_net,
            "cpu": $translate.i18n.i18n_cpu,
            "kpi": $translate.i18n.page_overview_kpi_service,
            "state": $translate.i18n.page_overview_kpi_state
        };
        return text && map[text.toLowerCase()];
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('formatAnomalyHealth', function ($translate) {
    return function (value) {
        return value === 100 ? value : (value < 26 ? value + (" (" + $translate.i18n.page_anomaly_critical_metrics + ")") : value + (" (" + $translate.i18n.page_anomaly_warning_metrics + ")"));
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('formatTimeRange', function () {
    return function (text) {
        if (!text) {
            return;
        }
        var from = text.from, to = text.to;
        var args = Array.prototype.slice.call(arguments), time = args[0], relative = args[1], index = args[2];
        __WEBPACK_IMPORTED_MODULE_2_moment___default.a.isMoment(from) && (from = __WEBPACK_IMPORTED_MODULE_2_moment___default()(from));
        __WEBPACK_IMPORTED_MODULE_2_moment___default.a.isMoment(to) && (to = __WEBPACK_IMPORTED_MODULE_2_moment___default()(to));
        from = __WEBPACK_IMPORTED_MODULE_3_app_core_utils_datemath__["parse"](from, false);
        to = __WEBPACK_IMPORTED_MODULE_3_app_core_utils_datemath__["parse"](to, true);
        relative = parseInt(relative);
        !__WEBPACK_IMPORTED_MODULE_0_lodash___default.a.isNaN(relative) && (from = __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(from).subtract(relative, 'days'),
            to = __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(to).subtract(relative, 'days'));
        return __WEBPACK_IMPORTED_MODULE_2_moment___default.a.utc(index === 0 ? from : to).format("YYYY-MM-DD");
    };
});
__WEBPACK_IMPORTED_MODULE_4__core_module__["default"].filter('formatRCAType', function ($translate) {
    return function (value) {
        return (value === 1) ? $translate.i18n.i18n_metric : ((value === 2) ? $translate.i18n.i18n_menu_logs : $translate.i18n.i18n_other);
    };
});
/* unused harmony default export */ var _unused_webpack_default_export = ({});


/***/ }),
/* 562 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony default export */ var _unused_webpack_default_export = ([
    "#7EB26D", "#EAB839", "#6ED0E0", "#EF843C", "#E24D42", "#1F78C1", "#BA43A9", "#705DA0",
    "#508642", "#CCA300", "#447EBC", "#C15C17", "#890F02", "#0A437C", "#6D1F62", "#584477",
    "#B7DBAB", "#F4D598", "#70DBED", "#F9BA8F", "#F29191", "#82B5D8", "#E5A8E2", "#AEA2E0",
    "#629E51", "#E5AC0E", "#64B0C8", "#E0752D", "#BF1B00", "#0A50A1", "#962D82", "#614D93",
    "#9AC48A", "#F2C96D", "#65C5DB", "#F9934E", "#EA6460", "#5195CE", "#D683CE", "#806EB7",
    "#3F6833", "#967302", "#2F575E", "#99440A", "#58140C", "#052B51", "#511749", "#3F2B5B",
    "#E0F9D7", "#FCEACA", "#CFFAFF", "#F9E2D2", "#FCE2DE", "#BADFF4", "#F9D9F9", "#DEDAF7"
]);


/***/ }),
/* 563 */
/***/ (function(module, exports) {


(function (window, angular, undefined) {
  'use strict';

  var util = {
    trim: function (text) {
      return text.toString().replace(/^\s+|\s+$/g, '');
    },
    lowercase: function (str) {
      return (typeof str === 'string') ? str.toLowerCase() : str;
    },
    indexOf: function (array, searchElement) {
      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === searchElement) {
          return i;
        }
      }
      return -1;
    }
  };

  var runTranslate = ['$translate', function ($translate) {
    var key = $translate.storageKey(),
      storage = $translate.storage();

    var fallbackFromIncorrectStorageValue = function () {
      var prefreed = $translate.preferredLanguage();
      if (angular.isString(prefreed)) {
        $translate.use(prefreed);
      } else {
        storage.put(key, $translate.use());
      }
    };

    if (storage) {
      if (!storage.get(key)) {
        fallbackFromIncorrectStorageValue();
      } else {
        $translate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
      }
    } else if (angular.isString($translate.preferredLanguage())) {
      $translate.use($translate.preferredLanguage());
    }
  }];
  angular.module('cloudwiz.translate', ['ng']).run(runTranslate);

  /**
   * @name cloudwiz.translate.$translateProvider
   */
  var $translateProvider = ['$STORAGE_KEY', '$windowProvider', function ($STORAGE_KEY, $windowProvider) {

    var $translationTable = {},
      $preferredLanguage,
      $availableLanguageKeys = [],
      $languageKeyAliases,
      $fallbackLanguage,
      $fallbackWasString,
      $uses,
      $storageFactory,
      $storageKey = $STORAGE_KEY,
      $storagePrefix,
      $interpolationFactory,
      $interpolatorFactories = [],
      $loaderFactory,
      $loaderOptions,
      $nestedObjectDelimeter = '.',
      $isReady = false,
      $keepContent = false,
      $nextLang,
      $missingTranslationHandlerFactory,
      $postCompilingEnabled = false,
      loaderCache,
      postProcessFn,
      uniformLanguageTagResolver = 'default',
      statefulFilter = true,
      languageTagResolver = {
        'default' : function (tag) {
          return (tag || '').split('-').join('_');
        },
      };

    /**
     * @name flatObject
     */
    var flatObject = function (data, path, result, prevKey) {
      var key, keyWithPath, keyWithShortPath, val;

      !path && (path = []);
      !result && (result = {});
      for (key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
          continue;
        }
        val = data[key];
        if (angular.isObject(val)) {
          flatObject(val, path.concat(key), result, key);
        } else {
          keyWithPath = path.length ? (path.join($nestedObjectDelimeter) + $nestedObjectDelimeter + key) : key;
          if (path.length && key === prevKey) {
            // Create shortcut path (foo.bar == foo.bar.bar)
            keyWithShortPath = path.join($nestedObjectDelimeter);
            // Link it to original path
            result[keyWithShortPath] = '@:' + keyWithPath;
          }
          result[keyWithPath] = val;
        }
      }
      return result;
    };

    // tries to determine the browsers language
    var getFirstBrowserLanguage = function () {
      var navigator = $windowProvider.$get().navigator,
        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
        i, language;

      // support for HTML 5.1 "navigator.languages"
      if (angular.isArray(navigator.languages)) {
        for (i = 0; i < navigator.languages.length; i++) {
          language = navigator.languages[i];
          if (language && language.length) {
            return language;
          }
        }
      }

      // support for other well known properties in browsers
      for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        language = navigator[browserLanguagePropertyKeys[i]];
        if (language && language.length) {
          return language;
        }
      }

      return null;
    };

    // tries to determine the browsers locale
    var getLocale = function () {
      var locale = getFirstBrowserLanguage() || '';
      if (languageTagResolver[uniformLanguageTagResolver]) {
        locale = languageTagResolver[uniformLanguageTagResolver](locale);
      }
      return locale;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#determinePreferredLanguage
     */
    this.determinePreferredLanguage = function (fn) {
      var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();
      if (!$availableLanguageKeys.length) {
        $preferredLanguage = locale;
      }
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#registerAvailableLanguageKeys
     */
    this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
      if (languageKeys) {
        $availableLanguageKeys = languageKeys;
        if (aliases) {
          $languageKeyAliases = aliases;
        }
        return this;
      }
      return $availableLanguageKeys;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useLoader
     */
    this.useLoader = function (loaderFactory, options) {
      $loaderFactory = loaderFactory;
      $loaderOptions = options || {};
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useStaticFilesLoader
     */
    this.useStaticFilesLoader = function (options) {
      return this.useLoader('$translateStaticFilesLoader', options);
    };

    /**
     * @name cloudwiz.translate.$translateProvider#preferredLanguage
     */
    var setupPreferredLanguage = function (langKey) {
      if (langKey) { $preferredLanguage = langKey; }
      return $preferredLanguage;
    };
    this.preferredLanguage = function (langKey) {
      if (langKey) {
        setupPreferredLanguage(langKey);
        return this;
      }
      return $preferredLanguage;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#fallbackLanguage
     */
    var fallbackStack = function (langKey) {
      if (langKey) {
        if (angular.isString(langKey)) {
          $fallbackWasString = true;
          $fallbackLanguage = [langKey];
        } else if (angular.isArray(langKey)) {
          $fallbackWasString = false;
          $fallbackLanguage = langKey;
        }
        if (angular.isString($preferredLanguage) && util.indexOf($fallbackLanguage, $preferredLanguage) < 0) {
          $fallbackLanguage.push($preferredLanguage);
        }

        return this;
      } else {
        if ($fallbackWasString) {
          return $fallbackLanguage[0];
        } else {
          return $fallbackLanguage;
        }
      }
    };
    this.fallbackLanguage = function (langKey) {
      fallbackStack(langKey);
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#storageKey
     */
    var storageKey = function (key) {
      if (!key) {
        if ($storagePrefix) {
          return $storagePrefix + $storageKey;
        }
        return $storageKey;
      }
      $storageKey = key;
      return this;
    };
    this.storageKey = storageKey;

    /**
     * @name pascalprecht.translate.$translateProvider#statefulFilter
     */
    this.statefulFilter = function (state) {
      if (state === undefined) {
        // getter
        return statefulFilter;
      } else {
        // setter with chaining
        statefulFilter = state;
        return this;
      }
    };

    /**
     * @name cloudwiz.translate.$translateProvider#use
     */
    this.use = function (langKey) {
      if (langKey) {
        if (!$translationTable[langKey] && (!$loaderFactory)) {
          // only throw an error, when not loading translation data asynchronously
          throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
        }
        $uses = langKey;
        return this;
      }
      return $uses;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useStorage
     */
    this.useStorage = function (storageFactory) {
      $storageFactory = storageFactory;
      return this;
    };

    /**
     * @name cloudwiz.translate.$translateProvider#useLocalStorage
     */
    this.useLocalStorage = function () {
      return this.useStorage('$translateLocalStorage');
    };

    /**
     * @name cloudwiz.translate.$translateProvider#translations
     */
    var translations = function (langKey, translationTable) {
      if (!langKey && !translationTable) {
        return $translationTable;
      }

      if (langKey && !translationTable) {
        if (angular.isString(langKey)) {
          return $translationTable[langKey];
        }
      } else {
        if (!angular.isObject($translationTable[langKey])) {
          $translationTable[langKey] = {};
        }
        angular.extend($translationTable[langKey], flatObject(translationTable));
      }
      return this;
    };
    this.translations = translations;

    /**
     * @name cloudwiz.translate.$translate
     */
    this.$get = function ($injector, $rootScope, $q) {
      var Storage,
        defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
        pendingLoader = false,
        interpolatorHashMap = {},
        langPromises = {},
        fallbackIndex,
        startFallbackIteration;

      var applyPostProcessing = function (translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy) {
        var fn = postProcessFn;

        if (fn) {
          if (typeof(fn) === 'string') {
            // getting on-demand instance
            fn = $injector.get(fn);
          }
          if (fn) {
            return fn(translationId, translation, resolvedTranslation, interpolateParams, uses, sanitizeStrategy);
          }
        }

        return resolvedTranslation;
      };

      var getTranslationTable = function (langKey) {
        var deferred = $q.defer();
        if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
          deferred.resolve($translationTable[langKey]);
        } else if (langPromises[langKey]) {
          var onResolve = function (data) {
            translations(data.key, data.table);
            deferred.resolve(data.table);
          };
          langPromises[langKey].then(onResolve, deferred.reject);
        } else {
          deferred.reject();
        }
        return deferred.promise;
      };

      var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy) {
        var deferred = $q.defer();

        var onResolve = function (translationTable) {
          if (Object.prototype.hasOwnProperty.call(translationTable, translationId) && translationTable[translationId] !== null) {
            Interpolator.setLocale(langKey);
            var translation = translationTable[translationId];
            if (translation.substr(0, 2) === '@:') {
              getFallbackTranslation(langKey, translation.substr(2), interpolateParams, Interpolator, sanitizeStrategy)
                .then(deferred.resolve, deferred.reject);
            } else {
              var interpolatedValue = Interpolator.interpolate(translationTable[translationId], interpolateParams, 'service', sanitizeStrategy, translationId);
              interpolatedValue = applyPostProcessing(translationId, translationTable[translationId], interpolatedValue, interpolateParams, langKey);

              deferred.resolve(interpolatedValue);

            }
            Interpolator.setLocale($uses);
          } else {
            deferred.reject();
          }
        };

        getTranslationTable(langKey).then(onResolve, deferred.reject);

        return deferred.promise;
      };

      var translateByHandler = function (translationId, interpolateParams, defaultTranslationText, sanitizeStrategy) {
        // If we have a handler factory - we might also call it here to determine if it provides
        // a default text for a translationid that can't be found anywhere in our tables
        if ($missingTranslationHandlerFactory) {
          return $injector.get($missingTranslationHandlerFactory)(translationId, $uses, interpolateParams, defaultTranslationText, sanitizeStrategy);
        } else {
          return translationId;
        }
      };

      var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
        var deferred = $q.defer();

        if (fallbackLanguageIndex < $fallbackLanguage.length) {
          var langKey = $fallbackLanguage[fallbackLanguageIndex];
          getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator, sanitizeStrategy).then(
            function (data) {
              deferred.resolve(data);
            },
            function () {
              // Look in the next fallback language for a translation.
              // It delays the resolving by passing another promise to resolve.
              return resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy).then(deferred.resolve, deferred.reject);
            }
          );
        } else {
          // No translation found in any fallback language
          // if a default translation text is set in the directive, then return this as a result
          if (defaultTranslationText) {
            deferred.resolve(defaultTranslationText);
          } else {
            var missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);

            // if no default translation is set and an error handler is defined, send it to the handler
            // and then return the result if it isn't undefined
            if ($missingTranslationHandlerFactory && missingTranslationHandlerTranslation) {
              deferred.resolve(missingTranslationHandlerTranslation);
            } else {
              // deferred.reject(applyNotFoundIndicators(translationId));
            }
          }
        }
        return deferred.promise;
      };

      var fallbackTranslation = function (translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy) {
        // Start with the fallbackLanguage with index 0
        return resolveForFallbackLanguage((startFallbackIteration > 0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy);
      };

      var determineTranslation = function (translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy) {
        var deferred = $q.defer();

        var table = uses ? $translationTable[uses] : $translationTable,
          Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;

        // if the translation id exists, we can just interpolate it
        if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {

            $translate(translation.substr(2), interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy)
              .then(deferred.resolve, deferred.reject);
          } else {
            //
            var resolvedTranslation = Interpolator.interpolate(translation, interpolateParams, 'service', sanitizeStrategy, translationId);
            resolvedTranslation = applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses);
            deferred.resolve(resolvedTranslation);
          }
        } else {
          var missingTranslationHandlerTranslation;
          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            // missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if (uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText, sanitizeStrategy)
              .then(function (translation) {
                deferred.resolve(translation);
              }, function (_translationId) {
                // deferred.reject(applyNotFoundIndicators(_translationId));
              });
          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            if (defaultTranslationText) {
              deferred.resolve(defaultTranslationText);
            } else {
              deferred.resolve(missingTranslationHandlerTranslation);
            }
          } else {
            if (defaultTranslationText) {
              deferred.resolve(defaultTranslationText);
            } else {
              // deferred.reject(applyNotFoundIndicators(translationId));
            }
          }
        }
        return deferred.promise;
      };

      var determineTranslationInstant = function (translationId, interpolateParams, interpolationId, uses, sanitizeStrategy) {
        var result, table = uses ? $translationTable[uses] : $translationTable,
          Interpolator = defaultInterpolator;

        // if the interpolation id exists use custom interpolator
        if (interpolatorHashMap && Object.prototype.hasOwnProperty.call(interpolatorHashMap, interpolationId)) {
          Interpolator = interpolatorHashMap[interpolationId];
        }

        // if the translation id exists, we can just interpolate it
        if (table && Object.prototype.hasOwnProperty.call(table, translationId) && table[translationId] !== null) {
          var translation = table[translationId];

          // If using link, rerun $translate with linked translationId and return it
          if (translation.substr(0, 2) === '@:') {
            result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId, uses, sanitizeStrategy);
          } else {
            result = Interpolator.interpolate(translation, interpolateParams, 'filter', sanitizeStrategy, translationId);
            result = applyPostProcessing(translationId, translation, result, interpolateParams, uses, sanitizeStrategy);
          }
        } else {
          var missingTranslationHandlerTranslation;
          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
          if ($missingTranslationHandlerFactory && !pendingLoader) {
            // missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
          }

          // since we couldn't translate the inital requested translation id,
          // we try it now with one or more fallback languages, if fallback language(s) is
          // configured.
          if (uses && $fallbackLanguage && $fallbackLanguage.length) {
            fallbackIndex = 0;
            result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator, sanitizeStrategy);
          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            result = missingTranslationHandlerTranslation;
          } else {
            result = applyNotFoundIndicators(translationId);
          }
        }

        return result;
      };

      /**
       * @name the returened
       */
      var $translate = function (translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy) {
        if (!$uses && $preferredLanguage) {
          $uses = $preferredLanguage;
        }
        var uses = $uses;

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          // This transforms all promises regardless resolved or rejected
          var translateAll = function (translationIds) {
            var results = {}; // storing the actual results
            var promises = []; // promises to wait for
            // Wraps the promise a) being always resolved and b) storing the link id->value
            var translate = function (translationId) {
              var deferred = $q.defer();
              var regardless = function (value) {
                results[translationId] = value;
                deferred.resolve([translationId, value]);
              };
              // we don't care whether the promise was resolved or rejected; just store the values
              $translate(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage, sanitizeStrategy).then(regardless, regardless);
              return deferred.promise;
            };
            for (var i = 0, c = translationIds.length; i < c; i++) {
              promises.push(translate(translationIds[i]));
            }
            // wait for all (including storing to results)
            return $q.all(promises).then(function () {
              return results;
            });
          };
          return translateAll(translationId);
        }

        var deferred = $q.defer();

        // trim off any whitespace
        if (translationId) {
          translationId = util.trim(translationId);
        }

        var promiseToWaitFor = (function () {
          var promise = langPromises[uses] || langPromises[$preferredLanguage];

          fallbackIndex = 0;

          if ($storageFactory && !promise) {
            // looks like there's no pending promise for $preferredLanguage or
            // $uses. Maybe there's one pending for a language that comes from
            // storage.
            var langKey = Storage.get($storageKey);
            promise = langPromises[langKey];

            if ($fallbackLanguage && $fallbackLanguage.length) {
              var index = util.indexOf($fallbackLanguage, langKey);
              // maybe the language from storage is also defined as fallback language
              // we increase the fallback language index to not search in that language
              // as fallback, since it's probably the first used language
              // in that case the index starts after the first element
              fallbackIndex = (index === 0) ? 1 : 0;

              // but we can make sure to ALWAYS fallback to preferred language at least
              if (util.indexOf($fallbackLanguage, $preferredLanguage) < 0) {
                $fallbackLanguage.push($preferredLanguage);
              }
            }
          }
          return promise;
        }());

        if (!promiseToWaitFor) {
          // no promise to wait for? okay. Then there's no loader registered
          // nor is a one pending for language that comes from storage.
          // We can just translate.
          determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
        } else {
          var promiseResolved = function () {
            // $uses may have changed while waiting
            if (!forceLanguage) {
              uses = $uses;
            }
            determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses, sanitizeStrategy).then(deferred.resolve, deferred.reject);
          };

          promiseToWaitFor['finally'](promiseResolved)['catch'](angular.noop); // we don't care about errors here, already handled
        }
        return deferred.promise;
      };

      /**
       * @name loadAsync
       */
      var loadAsync = function (key) {
        if (!key) { throw 'No language key specified for loading.'; }

        var deferred = $q.defer();

        $rootScope.$emit('$translateLoadingStart', {language : key});
        pendingLoader = true;

        var cache = loaderCache;
        if (typeof(cache) === 'string') {
          // getting on-demand instance of loader
          cache = $injector.get(cache);
        }

        var loaderOptions = angular.extend({}, $loaderOptions, {
          key : key,
          $http : angular.extend({}, {
            cache : cache
          }, $loaderOptions.$http)
        });

        var onLoaderSuccess = function (data) {
          var translationTable = {};
          $rootScope.$emit('$translateLoadingSuccess', {language : key});

          if (angular.isArray(data)) {
            angular.forEach(data, function (table) {
              angular.extend(translationTable, flatObject(table));
            });
          } else {
            angular.extend(translationTable, flatObject(data));
          }
          pendingLoader = false;
          deferred.resolve({
            key : key,
            table : translationTable
          });

          $translate.i18n = translationTable;
          $rootScope.$emit('$translateLoadingEnd', {language : key});
        };

        var onLoaderError = function (key) {
          $rootScope.$emit('$translateLoadingError', {language : key});
          deferred.reject(key);
          $rootScope.$emit('$translateLoadingEnd', {language : key});
        };
        $injector.get($loaderFactory)(loaderOptions).then(onLoaderSuccess, onLoaderError);

        return deferred.promise;
      };

      /**
       * @name cloudwiz.translate.$translate#preferredLanguage
       */
      $translate.preferredLanguage = function (langKey) {
        if (langKey) {
          setupPreferredLanguage(langKey);
        }
        return $preferredLanguage;
      };

      /**
       * @name useLanguage
       */
      var useLanguage = function (key) {
        $uses = key;

        // make sure to store new language key before triggering success event
        if ($storageFactory) {
          Storage.put($translate.storageKey(), $uses);
        }

        $rootScope.$emit('$translateChangeSuccess', {language : key});

        // inform default interpolator
        defaultInterpolator.setLocale($uses);

        var eachInterpolator = function (interpolator, id) {
          interpolatorHashMap[id].setLocale($uses);
        };

        // inform all others too!
        angular.forEach(interpolatorHashMap, eachInterpolator);
        $rootScope.$emit('$translateChangeEnd', {language : key});
      };

      var clearNextLangAndPromise = function (key) {
        if ($nextLang === key) {
          $nextLang = undefined;
        }
        langPromises[key] = undefined;
      };

      // internal purpose only
      $translate.statefulFilter = function () {
        return statefulFilter;
      };

      /**
       * @name cloudwiz.translate.$translate#use
       */
      $translate.use = function (key) {
        if (!key) { return $uses; }

        var deferred = $q.defer();
        deferred.promise.then(null, angular.noop); // AJS "Possibly unhandled rejection"

        $rootScope.$emit('$translateChangeStart', {language : key});

        // if there isn't a translation table for the language we've requested,
        // we load it asynchronously
        $nextLang = key;
        if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
          langPromises[key] = loadAsync(key).then(function (translation) {
            translations(translation.key, translation.table);
            deferred.resolve(translation.key);
            if ($nextLang === key) {
              useLanguage(translation.key);
            }
            return translation;
          }, function (key) {
            $rootScope.$emit('$translateChangeError', {language : key});
            deferred.reject(key);
            $rootScope.$emit('$translateChangeEnd', {language : key});
            return $q.reject(key);
          });
          langPromises[key]['finally'](function () {
            clearNextLangAndPromise(key);
          })['catch'](angular.noop); // we don't care about errors (clearing)
        } else if (langPromises[key]) {
          // we are already loading this asynchronously
          // resolve our new deferred when the old langPromise is resolved
          langPromises[key].then(function (translation) {
            if ($nextLang === translation.key) {
              useLanguage(translation.key);
            }
            deferred.resolve(translation.key);
            return translation;
          }, function (key) {
            // find first available fallback language if that request has failed
            if (!$uses && $fallbackLanguage && $fallbackLanguage.length > 0 && $fallbackLanguage[0] !== key) {
              return $translate['use']($fallbackLanguage[0]).then(deferred.resolve, deferred.reject);
            } else {
              return deferred.reject(key);
            }
          });
        } else {
          deferred.resolve(key);
          useLanguage(key);
        }

        return deferred.promise;
      };

      /**
       * @name cloudwiz.translate.$translate#isPostCompilingEnabled
       */
      $translate.isPostCompilingEnabled = function () {
        return $postCompilingEnabled;
      };

      /**
       * @name cloudwiz.translate.$translate#storage
       */
      $translate.storage = function () {
        return Storage;
      };

      /**
       * @name cloudwiz.translate.$translate#storageKey
       */
      $translate.storageKey = function () {
        return storageKey();
      };

      /**
       * @name pascalprecht.translate.$translate#instant
       */
      $translate.instant = function (translationId, interpolateParams, interpolationId, forceLanguage, sanitizeStrategy) {
        // we don't want to re-negotiate $uses
        // var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
        //   (negotiateLocale(forceLanguage) || forceLanguage) : $uses;
        var uses = $uses;

        // Detect undefined and null values to shorten the execution and prevent exceptions
        if (translationId === null || angular.isUndefined(translationId)) {
          return translationId;
        }

        // Duck detection: If the first argument is an array, a bunch of translations was requested.
        // The result is an object.
        if (angular.isArray(translationId)) {
          var results = {};
          for (var i = 0, c = translationId.length; i < c; i++) {
            results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId, forceLanguage, sanitizeStrategy);
          }
          return results;
        }

        // We discarded unacceptable values. So we just need to verify if translationId is empty String
        if (angular.isString(translationId) && translationId.length < 1) {
          return translationId;
        }

        // trim off any whitespace
        if (translationId) {
          translationId = util.trim(translationId);
        }

        var result, possibleLangKeys = [];
        if ($preferredLanguage) {
          possibleLangKeys.push($preferredLanguage);
        }
        if (uses) {
          possibleLangKeys.push(uses);
        }
        if ($fallbackLanguage && $fallbackLanguage.length) {
          possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
        }
        for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
          var possibleLangKey = possibleLangKeys[j];
          if ($translationTable[possibleLangKey]) {
            if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
              result = determineTranslationInstant(translationId, interpolateParams, interpolationId, uses, sanitizeStrategy);
            }
          }
          if (typeof result !== 'undefined') {
            break;
          }
        }
  
        if (!result && result !== '') {
          if ($notFoundIndicatorLeft || $notFoundIndicatorRight) {
            throw Error('Not found indicator left or right');
            // result = applyNotFoundIndicators(translationId);
          } else {
            // Return translation of default interpolator if not found anything.
            result = defaultInterpolator.interpolate(translationId, interpolateParams, 'filter', sanitizeStrategy);
  
            // looks like the requested translation id doesn't exists.
            // Now, if there is a registered handler for missing translations and no
            // asyncLoader is pending, we execute the handler
            var missingTranslationHandlerTranslation;
            if ($missingTranslationHandlerFactory && !pendingLoader) {
              // missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, sanitizeStrategy);
            }
  
            if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
              result = missingTranslationHandlerTranslation;
            }
          }
        }
  
        return result;
      };

      if ($storageFactory) {
        Storage = $injector.get($storageFactory);

        if (!Storage.get || !Storage.put) {
          throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
        }
      }

      if ($loaderFactory) {
        // If at least one async loader is defined and there are no
        // (default) translations available we should try to load them.
        if (angular.equals($translationTable, {})) {
          if ($translate.use()) {
            $translate.use($translate.use());
          }
        }

        // Also, if there are any fallback language registered, we start
        // loading them asynchronously as soon as we can.
        if ($fallbackLanguage && $fallbackLanguage.length) {
          var processAsyncResult = function (translation) {
            translations(translation.key, translation.table);
            $rootScope.$emit('$translateChangeEnd', {language : translation.key});
            return translation;
          };
          for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
            var fallbackLanguageId = $fallbackLanguage[i];
            if (!$translationTable[fallbackLanguageId]) {
              langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
            }
          }
        }
      } else {
        $rootScope.$emit('$translateReady', {language : $translate.use()});
      }

      return $translate;
    };
  }];
  angular.module('cloudwiz.translate').provider('$translate', $translateProvider);

  /**
   * @name cloudwiz.translate.$translateStaticFilesLoader
   */
  angular.module('cloudwiz.translate').factory('$translateStaticFilesLoader', ['$q', '$http', function ($q, $http) {
    return function (options) {
      if (!options || (!angular.isArray(options.files) && (!angular.isString(options.prefix) || !angular.isString(options.suffix)))) {
        throw new Error('Couldn\'t load static files, no files and prefix or suffix specified!');
      }

      if (!options.files) {
        options.files = [{
          prefix: options.prefix,
          suffix: options.suffix
        }];
      }

      var load = function (file) {
        if (!file || (!angular.isString(file.prefix) || !angular.isString(file.suffix))) {
          throw new Error('Couldn\'t load static file, no prefix or suffix specified!');
        }

        var fileUrl = [
          file.prefix,
          options.key,
          file.suffix
        ].join('');

        if (angular.isObject(options.fileMap) && options.fileMap[fileUrl]) {
          fileUrl = options.fileMap[fileUrl];
        }

        return $http(angular.extend({
          url: fileUrl,
          method: 'GET'
        }, options.$http))
          .then(function (result) {
            return result.data;
          }, function () {
            return $q.reject(options.key);
          });
      };

      var promises = [], length = options.files.length;

      for (var i = 0; i < length; i++) {
        promises.push(load({
          prefix: options.files[i].prefix,
          key: options.key,
          suffix: options.files[i].suffix
        }));
      }

      return $q.all(promises).then(function (data) {
        var length = data.length, mergedData = {};
        for (var i = 0; i < length; i++) {
          for (var key in data[i]) {
            mergedData[key] = data[i][key];
          }
        }
        return mergedData;
      });
    };
  }]);

  angular.module('cloudwiz.translate').factory('$translateDefaultInterpolation', ['$interpolate', function ($interpolate) {
    var $translateInterpolator = {},
        $locale,
        $identifier = 'default';

    $translateInterpolator.setLocale = function (locale) {
      $locale = locale;
    };

    $translateInterpolator.getInterpolationIdentifier = function () {
      return $identifier;
    };

    $translateInterpolator.interpolate = function (value, interpolationParams, context, sanitizeStrategy, translationId) {
      interpolationParams = interpolationParams || {};
      // interpolationParams = $translateSanitization.sanitize(interpolationParams, 'params', sanitizeStrategy, context);

      var interpolatedText;
      if (angular.isNumber(value)) {
        // numbers are safe
        interpolatedText = String(value);
      } else if (angular.isString(value)) {
        // strings must be interpolated (that's the job here)
        interpolatedText = $interpolate(value)(interpolationParams);
        // interpolatedText = $translateSanitization.sanitize(interpolatedText, 'text', sanitizeStrategy, context);
      } else {
        // neither a number or a string, cant interpolate => empty string
        interpolatedText = '';
      }

      return interpolatedText;
    };

    return $translateInterpolator;
  }]);

  ////////
  // Directive
  ////////
  angular.module('cloudwiz.translate').directive('translate', function ($translate, $interpolate, $compile, $parse, $rootScope) {

    return {
      restrict: 'AE',
      scope: true,
      compile: function (tElement, tAttr) {

        var translateValuesExist = (tAttr.translateValues) ?
          tAttr.translateValues : undefined;

        var translateInterpolation = (tAttr.translateInterpolation) ?
          tAttr.translateInterpolation : undefined;

        var translateSanitizeStrategyExist = (tAttr.translateSanitizeStrategy) ?
          tAttr.translateSanitizeStrategy : undefined;

        var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);

        var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)',
            watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';

        return function linkFn(scope, iElement, iAttr) {
          scope.interpolateParams = {};
          scope.preText = '';
          scope.postText = '';
          var translationIds = {};

          var initInterpolationParams = function (interpolateParams, iAttr, tAttr) {
            // initial setup
            if (iAttr.translateValues) {
              angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
            }
            // initially fetch all attributes if existing and fill the params
            if (translateValueExist) {
              for (var attr in tAttr) {
                if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                  var attributeName = util.lowercase(attr.substr(14, 1)) + attr.substr(15);
                  interpolateParams[attributeName] = tAttr[attr];
                }
              }
            }
          };

          var applyTranslation = function (value, scope, successful, translateAttr) {
            if (!successful) {
              if (typeof scope.defaultText !== 'undefined') {
                value = scope.defaultText;
              }
            }
            if (translateAttr === 'translate') {
              // default translate into innerHTML
              if (successful || (!successful && !$translate.isKeepContent() && typeof iAttr.translateKeepContent === 'undefined')) {
                iElement.empty().append(scope.preText + value + scope.postText);
              }
              var globallyEnabled = $translate.isPostCompilingEnabled();
              var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
              var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
              if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
                $compile(iElement.contents())(scope);
              }
            } else {
              // translate attribute
              var attributeName = iAttr.$attr[translateAttr];
              if (attributeName.substr(0, 5) === 'data-') {
                // ensure html5 data prefix is stripped
                attributeName = attributeName.substr(5);
              }
              attributeName = attributeName.substr(15);
              iElement.attr(attributeName, value);
            }
          };

          // Put translation processing function outside loop
          var updateTranslation = function (translateAttr, translationId, scope, interpolateParams, defaultTranslationText) {
            if (translationId) {
              $translate(translationId, interpolateParams, translateInterpolation, defaultTranslationText, scope.translateLanguage, scope.sanitizeStrategy)
                .then(function (translation) {
                  applyTranslation(translation, scope, true, translateAttr);
                }, function (translationId) {
                  applyTranslation(translationId, scope, false, translateAttr);
                });
            } else {
              // as an empty string cannot be translated, we can solve this using successful=false
              applyTranslation(translationId, scope, false, translateAttr);
            }
          };

          // Master update function
          var updateTranslations = function () {
            for (var key in translationIds) {
              if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
                updateTranslation(key, translationIds[key], scope, scope.interpolateParams, scope.defaultText);
              }
            }
          };

          // Ensures any change of the attribute "translate" containing the id will
          // be re-stored to the scope's "translationId".
          // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
          var observeElementTranslation = function (translationId) {

            // Remove any old watcher
            if (angular.isFunction(observeElementTranslation._unwatchOld)) {
              observeElementTranslation._unwatchOld();
              observeElementTranslation._unwatchOld = undefined;
            }

            if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
              var iElementText = util.trim(iElement.text());

              // Resolve translation id by inner html if required
              var interpolateMatches = iElementText.match(interpolateRegExp);
              // Interpolate translation id if required
              if (angular.isArray(interpolateMatches)) {
                scope.preText = interpolateMatches[1];
                scope.postText = interpolateMatches[3];
                translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
                var watcherMatches = iElementText.match(watcherRegExp);
                if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
                  observeElementTranslation._unwatchOld = scope.$watch(watcherMatches[2], function (newValue) {
                    translationIds.translate = newValue;
                    updateTranslations();
                  });
                }
              } else {
                // do not assigne the translation id if it is empty.
                translationIds.translate = !iElementText ? undefined : iElementText;
              }
            } else {
              translationIds.translate = translationId;
            }
            updateTranslations();
          };

          var observeAttributeTranslation = function (translateAttr) {
            iAttr.$observe(translateAttr, function (translationId) {
              translationIds[translateAttr] = translationId;
              updateTranslations();
            });
          };

          // initial setup with values
          initInterpolationParams(scope.interpolateParams, iAttr, tAttr);

          var firstAttributeChangedEvent = true;
          iAttr.$observe('translate', function (translationId) {
            if (typeof translationId === 'undefined') {
              // case of element "<translate>xyz</translate>"
              observeElementTranslation('');
            } else {
              // case of regular attribute
              if (translationId !== '' || !firstAttributeChangedEvent) {
                translationIds.translate = translationId;
                updateTranslations();
              }
            }
            firstAttributeChangedEvent = false;
          });

          for (var translateAttr in iAttr) {
            if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr' && translateAttr.length > 13) {
              observeAttributeTranslation(translateAttr);
            }
          }

          iAttr.$observe('translateDefault', function (value) {
            scope.defaultText = value;
            updateTranslations();
          });

          if (translateSanitizeStrategyExist) {
            iAttr.$observe('translateSanitizeStrategy', function (value) {
              scope.sanitizeStrategy = $parse(value)(scope.$parent);
              updateTranslations();
            });
          }

          if (translateValuesExist) {
            iAttr.$observe('translateValues', function (interpolateParams) {
              if (interpolateParams) {
                scope.$parent.$watch(function () {
                  angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
                });
              }
            });
          }

          if (translateValueExist) {
            var observeValueAttribute = function (attrName) {
              iAttr.$observe(attrName, function (value) {
                var attributeName = util.lowercase(attrName.substr(14, 1)) + attrName.substr(15);
                scope.interpolateParams[attributeName] = value;
              });
            };
            for (var attr in iAttr) {
              if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
                observeValueAttribute(attr);
              }
            }
          }

          if (translateValuesExist || translateValueExist || iAttr.translateDefault) {
            scope.$watch('interpolateParams', updateTranslations, true);
          }

          // Replaced watcher on translateLanguage with event listener
          scope.$on('translateLanguageChanged', updateTranslations);

          // Ensures the text will be refreshed after the current language was changed
          // w/ $translate.use(...)
          var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);

          // ensure translation will be looked up at least one
          if (iElement.text().length) {
            if (iAttr.translate) {
              observeElementTranslation(iAttr.translate);
            } else {
              observeElementTranslation('');
            }
          } else if (iAttr.translate) {
            // ensure attribute will be not skipped
            observeElementTranslation(iAttr.translate);
          }
          updateTranslations();
          scope.$on('$destroy', unbind);
        };
      }
    };
  });

  ////////
  // filter
  ////////
  angular.module('cloudwiz.translate').filter('translate', function ($parse, $translate) {
    var translateFilter = function (translationId, interpolateParams, interpolation, forceLanguage) {
      if (!angular.isObject(interpolateParams)) {
        var ctx = this;
        interpolateParams = $parse(interpolateParams)(ctx);
      }
  
      return $translate.instant(translationId, interpolateParams, interpolation, forceLanguage);
    };
  
    if ($translate.statefulFilter()) {
      translateFilter.$stateful = true;
    }
  
    return translateFilter;
  });

  ////////
  // Storage
  ////////
  angular.module('cloudwiz.translate').constant('$STORAGE_KEY', 'CLOUDWIZ_LANG_KEY');
  angular.module('cloudwiz.translate').factory('$translateLocalStorage', ['$window', function ($window) {
    var localStorageAdapter = (function () {
      var langKey;
      return {
        get: function (name) {
          if (!langKey) {
            langKey = $window.localStorage.getItem(name);
          }
          return langKey;
        },
        set: function (name, value) {
          langKey = value;
          $window.localStorage.setItem(name, value);
        },
        put: function (name, value) {
          langKey = value;
          $window.localStorage.setItem(name, value);
        }
      };
    }());

    var $translateLocalStorage = localStorageAdapter;
    return $translateLocalStorage;
  }]);

})(window, window.angular);


/***/ })
],[454]);
//# sourceMappingURL=app.3248cf96f155c850e422.js.map