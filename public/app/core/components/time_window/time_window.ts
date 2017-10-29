///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import coreModule from '../../core_module';
import 'jquery.flot';
import 'jquery.flot.selection';
import 'jquery.flot.time';
import 'jquery.flot.navigate';

export class TimeWindowCtrl {
  data: any;
  options: any;
  timeWindow: any;

  range: any;
  rangeRaw: any;
  datasource: any;

  $tooltip: any = $('<div id="tooltip">');

  /** @ngInject */
  constructor(private $rootScope, private $scope, private popoverSrv, private backendSrv, private $q, private $location, private timeSrv, private datasourceSrv) {
    var start = $location.search().start;
    this.range = (start === "undefined" || !start)
      ? { from: moment().add(-1, 'day'), to: moment() }
      : { from: moment(+start).add(-1, 'day'), to: moment(+start) };

    this.options = {
      series: {
        lines: {
          show: true,
          lineWidth: 1
        },
        shadowSize: 0
      },
      xaxis: {
        // ticks: [],
        mode: "time",
        from: this.range.from.valueOf(),
        to: this.range.to.valueOf(),
        min: this.range.from.valueOf(),
        max: this.range.to.valueOf(),
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
      ]
    };

    this.render();
    this.bindEvent();
  }

  bindEvent() {
    $("#timeWindow").bind("plotselected", (...args) => {
      this.$scope.$emit('time-window-selected', args[1].xaxis);
    });
    $("#timeWindow").bind("plothover", (...args) => {
      if (!args[2]) {
        this.$tooltip.detach();
        return;
      }
      this.showTooltip(args[1]);
    });
    $('#next').bind('click', () => {
      this.timeWindow.pan({ left: 100 });
      this.render('right');
    });
    $('#prev').bind('click', () => {
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
        if (this.range.to.add(step, 'hour') > moment()) {
          this.range = {
            from: moment().add(-1, 'day'),
            to  : moment()
          }
        }
      }
    }
    this.datasourceSrv.get('opentsdb').then(this.issueQueries.bind(this));
    this.$scope.$emit('time-window-resize', this.range);
  }

  showTooltip(params) {
    var body = `
      <div class="graph-tooltip small topn-tooltip">
        <div class="graph-tooltip-time">${moment(params.x).format("YYYY-MM-DD HH:mm:ss")}</div>
        <div class="graph-tooltip-value">使用率: ${params.y}</div>
      </div>
    `;
    this.$tooltip.html(body).place_tt(params.pageX + 20, params.pageY);
  };

  issueQueries(datasource) {
    var targets = [
      {
        "aggregator": "avg",
        "currentTagKey": "",
        "currentTagValue": "",
        "downsampleAggregator": "avg",
        "downsampleInterval": "1h",
        "errors": {},
        "hide": false,
        "isCounter": false,
        "metric": "cpu.usr",  // internal.system.health
        "refID": "A",
        "shouldComputeRate": false
      },
      {
        "aggregator": "avg",
        "currentTagKey": "",
        "currentTagValue": "",
        "downsampleAggregator": "avg",
        "downsampleInterval": "1h",
        "errors": {},
        "hide": false,
        "isCounter": false,
        "metric": "proc.meminfo.percentused",
        "refID": "A",
        "shouldComputeRate": false
      }
    ];

    var metricsQuery = {
      panelId: 11,
      range: this.range,  //range,
      rangeRaw: this.range,  //rangeRaw,
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
      this.timeWindow = $.plot('#timeWindow', [
        { label: response[0].target, data: response[0].datapoints },
        { label: response[1].target, data: response[1].datapoints }
      ], this.options);
    });
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
  };
}

coreModule.directive('timeWindow', timeWindowDirective);
