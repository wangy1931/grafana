
import angular from 'angular';
import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from '../../core_module';
import 'vendor/flot/jquery.flot';
import 'vendor/flot/jquery.flot.selection';
import 'vendor/flot/jquery.flot.time';
import 'vendor/flot/jquery.flot.navigate';
import 'app/plugins/panel/graph/jquery.flot.events';

export class TimeWindowCtrl {
  data: any;
  options: any;
  timeWindow: any;
  timeWindowData: any;

  range: any;
  rangeRaw: any;
  datasource: any;
  selectRange: any;
  queryData: any;

  $tooltip: any = $('<div id="tooltip">');

  /** @ngInject */
  constructor(
    private $rootScope, private $scope, private popoverSrv,
    private backendSrv, private $q, private $location,
    private timeSrv, private datasourceSrv, private $translate
  ) {
    var start = $location.search().start;
    this.range = (start === "undefined" || !start)
      ? { from: moment().add(-1, 'day'), to: moment() }
      : { from: moment(+start).add(-1, 'day'), to: moment(+start) };

    this.options = {
      legend: {
        show: false
      },
      series: {
        lines: {
          show: true,
          lineWidth: 2
        },
        shadowSize: 0
      },
      xaxis: {
        // ticks: [],
        mode: "time",
        from: this.range.from.valueOf(),
        to: this.range.to.valueOf(),
        timezone: "browser"
      },
      yaxis: {
        // ticks: [],
        // min: 0,
        // autoscaleMargin: 0.1
      },
      selection: {
        mode: "x"
      },
      grid: {
        minBorderMargin: 0,
        markings: [],
        backgroundColor: null,
        borderWidth: 0,
        color: '#c8c8c8',
        margin: { left: 0, right: 0 },
        hoverable: true,
      },
      crosshair: {
        mode: "x"
      },
      xaxes: [
        { position: 'bottom' },
      ],
      yaxes: [
        { position: 'left' },
      ],
      events: {
        levels: 6,
        data: [],
        types: {
          "alert": {
            color: "rgba(255, 96, 96, 1)",
            markerSize: 5,
            position: "BOTTOM",
          }
        },
      }
    };

    this.render();
    this.bindEvent();
  }

  bindEvent() {
    angular.element("#timeWindow").bind("plotselected", (...args) => {
      this.selectRange = { from: moment(args[1].xaxis.to).add(-1, 'm'), to: moment(args[1].xaxis.to).add(1, 'm') };
      this.$scope.$emit('time-window-selected', this.selectRange);

      this.addAnnotation();
      this.drawTimeWindow();
    });
    angular.element("#timeWindow").bind("plothover", (...args) => {
      if (!args[2]) {
        this.$tooltip.detach();
        return;
      }
      this.showTooltip(args[1]);
    });
    angular.element('#next').bind('click', () => {
      this.timeWindow.pan({ left: 100 });
      this.render('right');
    });
    angular.element('#prev').bind('click', () => {
      this.timeWindow.pan({ left: -100 });
      this.render('left');
    });
  }

  render(direction?) {
    var step = 4; // 4 hour
    this.timeWindow && this.timeWindow.setSelection({});
    if (this.timeWindow) {
      if (direction === 'left') {
        this.range = {
          from: this.range.from.add(-step, 'hour'),
          to  : this.range.to.add(-step, 'hour')
        }
      } else if (direction === 'right') {
        // Note: 这里没有做精确的步长计算  如果又拉超过了就取现在的前一天
        var from = this.range.from.add(step, 'hour');
        var to = this.range.to.add(step, 'hour');
        if (to > moment()) {
          this.range = {
            from: moment().add(-1, 'day'),
            to  : moment()
          }
        } else {
          _.extend(this.range, { from: from, to: to });
        }
      }
    }
    this.selectRange = this.range;
    this.datasourceSrv.get('opentsdb').then(this.issueQueries.bind(this));
    this.$scope.$emit('time-window-resize', { from: moment(this.range.to).add(-1, 'm'), to: moment(this.range.to).add(1, 'm') });
  }

  showTooltip(params) {
    var body = `
      <div class="graph-tooltip small topn-tooltip">
        <div class="graph-tooltip-time">${moment(params.x).format("YYYY-MM-DD HH:mm:ss")}</div>
        <div class="graph-tooltip-value">${this.$translate.i18n.i18n_percent_usage}: ${_.percentFormatter(params.y)}</div>
      </div>
    `;
    this.$tooltip.html(body).place_tt(params.pageX + 20, params.pageY);
  };

  issueQueries(datasource) {
    var host = this.$location.search().host || '';
    var targets: any = [
      {
        "aggregator": "avg",
        "currentTagKey": "",
        "currentTagValue": "",
        "downsampleAggregator": "avg",
        "downsampleInterval": "5m",
        "errors": {},
        "hide": false,
        "isCounter": false,
        "metric": "cpu.usr",
        "refID": "A",
        "shouldComputeRate": false
      },
      {
        "aggregator": "avg",
        "currentTagKey": "",
        "currentTagValue": "",
        "downsampleAggregator": "avg",
        "downsampleInterval": "5m",
        "errors": {},
        "hide": false,
        "isCounter": false,
        "metric": "proc.meminfo.percentused",
        "refID": "A",
        "shouldComputeRate": false
      }
    ];
    if (host && host !== "*") {
      targets.forEach(target => {
        target.tags = { "host": host }
      });
    }

    var metricsQuery = {
      panelId: 11,
      range: this.range,
      rangeRaw: this.range,
      interval: null,
      targets: targets,
      format: 'json',
      maxDataPoints: Math.ceil($(window).width()),
      scopedVars: null,
      cacheTimeout: null
    };

    return datasource.query(metricsQuery).then(results => {
      _.each(results.data, data => {
        if (data.target === "cpu.usr") {
          _.each(data.datapoints, dps => {
            _.reverse(dps);
          });
        } else {
          _.each(data.datapoints, dps => {
            _.reverse(dps);
          });
        }
      });
      return results.data;
    }).then(response => {
      this.queryData = response;
      this.options.xaxis.from = this.range.from.valueOf();
      this.options.xaxis.to = this.range.to.valueOf();

      this.addAnnotation();
      this.drawTimeWindow();
    });
  }

  drawTimeWindow() {
    this.timeWindow = $.plot('#timeWindow', [
      { label: this.queryData[0].target, data: this.queryData[0].datapoints },
      { label: this.queryData[1].target, data: this.queryData[1].datapoints }
    ], this.options);
    this.timeWindowData = this.timeWindow.getData();
  }

  addAnnotation() {
    this.options.events.data = [];

    var start = this.$location.search().start;
    if (start && start !== "undefined") {
      this.options.events.data.push({
        id: 11,
        min: +start,
        max: +start,
        title: this.$translate.i18n.page_alert_time,
        tags: "alert",
        text: `[${this.$translate.i18n.i18n_host}] ${this.$location.search().host}`,
        eventType: "alert",
      })
    }

    var currentPoint = moment(this.selectRange.to).add(-5, 'm');  // this.selectRange.from + (this.selectRange.to - this.selectRange.from) / 2
    this.options.events.data.push({
      id: 12,
      min: currentPoint,
      max: currentPoint,
      title: this.$translate.i18n.page_topn_query_point,
      eventType: "search",
    })
  }

}

export function timeWindowDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/time_window/time_window.html',
    controller: TimeWindowCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    scope: {},
    link: function (scope, elem, attrs, ctrl) {
      scope.$on('$destroy', function() {
        elem.off();
        elem.remove();
      });
    }
  };
}

coreModule.directive('timeWindow', timeWindowDirective);
