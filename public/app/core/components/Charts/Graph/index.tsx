import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { toJS } from 'mobx';
import { ThresholdManager } from './threshold_manager';
import 'app/plugins/panel/graph/jquery.flot.events';

export interface GraphProps {
  options: any;
  data: any;
  range: any;
  annotations?: Array<any>;
  thresholds?: Array<any>;
}

// @autoHeight()
export default class Graph extends React.Component<GraphProps, any> {
  static defaultOptions = {
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
      // from: moment().valueOf(),
      // to: moment().add(-1, 'd').valueOf(),
      timezone: "browser"
    },
    yaxis: {
      // ticks: [],
      // min: 0,
      // autoscaleMargin: 0.1
    },
    // selection: {
    //   mode: "x"
    // },
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

  graph;
  options;
  $tooltip: any = $('<div id="tooltip">');

  showTooltip(params) {
    var body = `
      <div class="graph-tooltip small topn-tooltip">
        <div class="graph-tooltip-time">${moment(params.x).format("YYYY-MM-DD HH:mm:ss")}</div>
        <div class="graph-tooltip-value">使用率: ${_.percentFormatter(params.y)}</div>
      </div>
    `;
    this.$tooltip.html(body).place_tt(params.pageX + 20, params.pageY);
  }

  draw(data) {
    if (data && data.length) {
      data = toJS(data);
      this.graph = $.plot('#graph', [
        { label: data[0].target, data: data[0].datapoints },
      ], this.options);
    }
  }

  addAnnotation(annotations) {
    this.options.events.data = [];
    if (annotations && annotations.length) {
      annotations = toJS(annotations);
      this.options.events.data = annotations;
    }
  }

  componentDidMount() {
    let { data, range, annotations } = this.props;

    this.addAnnotation(annotations);
    this.draw(data);

    $('#graph').bind("plothover", (...args) => {
      if (!args[2]) {
        this.$tooltip.detach();
        return;
      }
      this.showTooltip(args[1]);
    });
  }

  componentDidUpdate() {
    let { data, range, annotations } = this.props;

    this.addAnnotation(annotations);
    this.draw(data);
  }

  render() {
    let { options, range } = this.props;
    this.options = _.extend(Graph.defaultOptions, options);
    this.options.xaxis.from = range.from.valueOf();
    this.options.xaxis.to = range.to.valueOf();

    var step = 4; // 4 hour
    this.graph && this.graph.setSelection({});

    return (
      <div className="graph-container">

        <div className="graph-header">
          <div className="graph-title-container">
            <span className="graph-title">
              <span className="graph-title-text">{this.options.title}</span>
            </span>
          </div>
        </div>

        <div className="graph-content" id="graph" style={{height: 400}}>
        </div>

        <div className="graph-legend-wrapper">
          <section className="graph-legend">
            {/* <div className="graph-legend-series" ng-repeat="legend in ctrl.timeWindowData" data-series-index="{{ $index }}">
              <div className="graph-legend-icon">
                <i className="fa fa-minus pointer"></i>
              </div>
              <span className="graph-legend-alias pointer">{legend.label}</span>
            </div> */}
          </section>
        </div>

        {/* <div className="graph-pan graph-pan-left" id="prev">
          <i className="fa fa-angle-left"></i>
        </div>

        <div className="graph-pan graph-pan-right" id="next">
            <i className="fa fa-angle-right"></i>
        </div> */}

      </div>
    )
  }
}
