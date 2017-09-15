define([
  'jquery',
  'lodash'
],
function ($) {
  'use strict';

  function GraphTooltip(elem, dashboard, scope, getSeriesFn) {
    var self = this;
    var ctrl = scope.ctrl;
    var panel = ctrl.panel;

    var $tooltip = $('<div id="tooltip" class="graph-tooltip">');

    this.destroy = function() {
      $tooltip.remove();
    };

    this.findHoverIndexFromDataPoints = function(posX, series, last) {
      var ps = series.datapoints.pointsize;
      var initial = last*ps;
      var len = series.datapoints.points.length;
      for (var j = initial; j < len; j += ps) {
        // Special case of a non stepped line, highlight the very last point just before a null point
        if ((!series.lines.steps && series.datapoints.points[initial] != null && series.datapoints.points[j] == null)
            //normal case
            || series.datapoints.points[j] > posX) {
          return Math.max(j - ps,  0)/ps;
        }
      }
      return j/ps - 1;
    };

    this.findHoverIndexFromData = function(posX, series) {
      var len = series.data.length;
      for (var j = 0; j < len; j++) {
        if (series.data[j][0] > posX) {
          return Math.max(j - 1,  0);
        }
      }
      return j - 1;
    };

    this.showTooltip = function(absoluteTime, innerHtml, pos, xMode) {
      if (xMode === 'time') {
        innerHtml = '<div class="graph-tooltip-time">'+ absoluteTime + '</div>' + innerHtml;
      }
      $tooltip.html(innerHtml).place_tt(pos.pageX + 20, pos.pageY);
    };

    this.getMultiSeriesPlotHoverInfo = function(seriesList, pos) {
      var value, i, series, hoverIndex, hoverDistance, pointTime, yaxis;
      // 3 sub-arrays, 1st for hidden series, 2nd for left yaxis, 3rd for right yaxis.
      var results = [[],[],[]];

      //now we know the current X (j) position for X and Y values
      var last_value = 0; //needed for stacked values

      var minDistance, minTime;

      for (i = 0; i < seriesList.length; i++) {
        series = seriesList[i];

        if (!series.data.length || (panel.legend.hideEmpty && series.allIsNull)) {
          // Init value so that it does not brake series sorting
          results[0].push({ hidden: true, value: 0 });
          continue;
        }

        if (!series.data.length || (panel.legend.hideZero && series.allIsZero)) {
          // Init value so that it does not brake series sorting
          results[0].push({ hidden: true, value: 0 });
          continue;
        }

        hoverIndex = this.findHoverIndexFromData(pos.x, series);
        hoverDistance = pos.x - series.data[hoverIndex][0];
        pointTime = series.data[hoverIndex][0];

        // Take the closest point before the cursor, or if it does not exist, the closest after
        if (! minDistance
            || (hoverDistance >=0 && (hoverDistance < minDistance || minDistance < 0))
            || (hoverDistance < 0 && hoverDistance > minDistance)) {
          minDistance = hoverDistance;
          minTime = pointTime;
        }

        if (series.stack) {
          if (panel.tooltip.value_type === 'individual') {
            value = series.data[hoverIndex][1];
          } else if (!series.stack) {
            value = series.data[hoverIndex][1];
          } else {
            last_value += series.data[hoverIndex][1];
            value = last_value;
          }
        } else {
          value = series.data[hoverIndex][1];
        }

        // Highlighting multiple Points depending on the plot type
        if (series.lines.steps || series.stack) {
          // stacked and steppedLine plots can have series with different length.
          // Stacked series can increase its length on each new stacked serie if null points found,
          // to speed the index search we begin always on the last found hoverIndex.
          hoverIndex = this.findHoverIndexFromDataPoints(pos.x, series, hoverIndex);
        }

        // Be sure we have a yaxis so that it does not brake series sorting
        yaxis = 0;
        if (series.yaxis) {
          yaxis = series.yaxis.n;
        }

        // if the yaxis much than twice there must be a special code.
        // WARNING: do not move this code block.
        if (yaxis > 2) {
          yaxis = 2;
        }

        results[yaxis].push({
          value: value,
          hoverIndex: hoverIndex,
          color: series.color,
          label: series.label,
          time: pointTime,
          distance: hoverDistance,
          index: i
        });
      }

      // Contat the 3 sub-arrays
      results = results[0].concat(results[1],results[2]);

      // Time of the point closer to pointer
      results.time = minTime;

      return results;
    };

    elem.mouseleave(function () {
      if (panel.tooltip.shared) {
        var plot = elem.data().plot;
        if (plot) {
          $tooltip.detach();
          plot.unhighlight();
        }
      }

      if (dashboard.sharedCrosshair) {
        ctrl.publishAppEvent('clearCrosshair');
      }
    });

    elem.bind("plothover", function (event, pos, item) {
      var plot = elem.data().plot;
      var plotData = plot.getData();
      var xAxes = plot.getXAxes();
      var xMode = xAxes[0].options.mode;
      var seriesList = getSeriesFn();
      var group, value, absoluteTime, hoverInfo, i, series, seriesHtml, tooltipFormat;

      if (dashboard.sharedCrosshair) {
        ctrl.publishAppEvent('setCrosshair', {pos: pos, scope: scope});
      }

      if (seriesList.length === 0) {
        return;
      }

      if (seriesList[0].hasMsResolution) {
        tooltipFormat = 'YYYY-MM-DD HH:mm:ss.SSS';
      } else {
        tooltipFormat = 'YYYY-MM-DD HH:mm:ss';
      }

      if (panel.tooltip.shared) {
        plot.unhighlight();

        var seriesHoverInfo = self.getMultiSeriesPlotHoverInfo(plotData, pos);

        seriesHtml = '';

        absoluteTime = dashboard.formatDate(seriesHoverInfo.time, tooltipFormat);

        // Dynamically reorder the hovercard for the current time point if the
        // option is enabled.
        if (panel.tooltip.sort === 2) {
          seriesHoverInfo.sort(function(a, b) {
            return b.value - a.value;
          });
        } else if (panel.tooltip.sort === 1) {
          seriesHoverInfo.sort(function(a, b) {
            return a.value - b.value;
          });
        }

        for (i = 0; i < seriesHoverInfo.length; i++) {
          hoverInfo = seriesHoverInfo[i];

          if (hoverInfo.hidden) {
            continue;
          }

          var highlightClass = '';
          if (item && hoverInfo.index === item.seriesIndex) {
            highlightClass = 'graph-tooltip-list-item--highlight';
          }

          series = seriesList[hoverInfo.index];

          value = series.formatValue(hoverInfo.value);

          seriesHtml += '<div class="graph-tooltip-list-item ' + highlightClass + '"><div class="graph-tooltip-series-name">';
          seriesHtml += '<i class="fa fa-minus" style="color:' + hoverInfo.color +';"></i> ' + hoverInfo.label + ':</div>';
          seriesHtml += '<div class="graph-tooltip-value">' + value + '</div></div>';
          plot.highlight(hoverInfo.index, hoverInfo.hoverIndex);
        }

        self.showTooltip(absoluteTime, seriesHtml, pos, xMode);
      }
      // single series tooltip
      else if (item) {
        series = seriesList[item.seriesIndex];
        group = '<div class="graph-tooltip-list-item"><div class="graph-tooltip-series-name">';
        group += '<i class="fa fa-minus" style="color:' + item.series.color +';"></i> ' + series.label + ':</div>';

        if (panel.stack && panel.tooltip.value_type === 'individual') {
          value = item.datapoint[1] - item.datapoint[2];
        }
        else {
          value = item.datapoint[1];
        }

        value = series.formatValue(value);

        absoluteTime = dashboard.formatDate(item.datapoint[0], tooltipFormat);

        group += '<div class="graph-tooltip-value">' + value + '</div>';

        self.showTooltip(absoluteTime, group, pos, xMode);
      }
      // no hit
      else {
        $tooltip.detach();
      }
    });
  }

  return GraphTooltip;
});