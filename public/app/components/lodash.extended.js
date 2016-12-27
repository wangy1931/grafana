define([
  'lodash-src'
],
function () {
  'use strict';

  var _ = window._;

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
    var elem = metricName.split(".");
    if(elem.length < 3){
      return metricName;
    }
    return metricName.substring(metricName.indexOf(elem[2]));
  };
  return _;
});