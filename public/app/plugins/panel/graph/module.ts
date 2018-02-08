 

import './graph';
import './legend';
import './series_overrides_ctrl';
import './thresholds_form';

import template from './template';
import angular from 'angular';
import moment from 'moment';
import _ from 'lodash';
import TimeSeries from 'app/core/time_series2';
import config from 'app/core/config';
import * as fileExport from 'app/core/utils/file_export';
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {DataProcessor} from './data_processor';
import {axesEditorComponent} from './axes_editor';

class GraphCtrl extends MetricsPanelCtrl {
  static template = template;

  hiddenSeries: any = {};
  seriesList: any = [];
  dataList: any = [];
  annotations: any = [];
  alertState: any;

  annotationsPromise: any;
  datapointsCount: number;
  datapointsOutside: boolean;
  colors: any = [];
  subTabIndex: number;
  processor: DataProcessor;

  panelDefaults = {
    // datasource name, null = default datasource
    datasource: null,
    // sets client side (flot) or native graphite png renderer (png)
    renderer: 'flot',
    yaxes: [
      {
        label: null,
        show: true,
        logBase: 1,
        min: null,
        max: null,
        format: 'short'
      },
      {
        label: null,
        show: true,
        logBase: 1,
        min: null,
        max: null,
        format: 'short'
      }
    ],
    xaxis: {
      show: true,
      mode: 'time',
      name: null,
      values: [],
    },
    // show/hide lines
    lines         : true,
    // fill factor
    fill          : 1,
    // line width in pixels
    linewidth     : 2,
    // show hide points
    points        : false,
    // point radius in pixels
    pointradius   : 5,
    // show hide bars
    bars          : false,
    // enable/disable stacking
    stack         : false,
    // stack percentage mode
    percentage    : false,
    // legend options
    legend: {
      show: true, // disable/enable legend
      values: false, // disable/enable legend values
      min: false,
      max: false,
      current: false,
      total: false,
      avg: false
    },
    // how null points should be handled
    nullPointMode : 'connected',
    // staircase line mode
    steppedLine: false,
    // tooltip options
    tooltip       : {
      value_type: 'individual',
      shared: true,
      sort: 0,
      msResolution: false,
    },
    // time overrides
    timeFrom: null,
    timeShift: null,
    // metric queries
    targets: [{}],
    // series color overrides
    aliasColors: {},
    // other style overrides
    seriesOverrides: [],
    thresholds: [],
  };

  /** @ngInject */
  constructor($scope, $injector, private annotationsSrv) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);
    _.defaults(this.panel.tooltip, this.panelDefaults.tooltip);
    _.defaults(this.panel.legend, this.panelDefaults.legend);
    _.defaults(this.panel.xaxis, this.panelDefaults.xaxis);

    this.processor = new DataProcessor(this.panel);

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataSnapshotLoad.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('坐标', axesEditorComponent, 2);
    this.addEditorTab('图例', 'public/app/plugins/panel/graph/tab_legend.html', 3);
    this.addEditorTab('显示效果', 'public/app/plugins/panel/graph/tab_display.html', 4);

    this.subTabIndex = 0;
  }

  onInitPanelActions(actions) {
    actions.push({text: '导出 CSV (按行导出)', click: 'ctrl.exportCsv()'});
    actions.push({text: '导出 CSV (按列导出)', click: 'ctrl.exportCsvColumns()'});
    actions.push({text: '转换图例显示', click: 'ctrl.toggleLegend()'});
  }

  issueQueries(datasource) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range,
    });
    return super.issueQueries(datasource);
  }

  zoomOut(evt) {
    this.publishAppEvent('zoom-out', 2);
  }

  onDataSnapshotLoad(snapshotData) {
    this.annotationsPromise = this.annotationsSrv.getAnnotations({
      dashboard: this.dashboard,
      panel: this.panel,
      range: this.range,
    });
    this.onDataReceived(snapshotData);
  }

  onDataError(err) {
    this.seriesList = [];
    this.annotations = [];
    this.render([]);
  }

  onDataReceived(dataList) {
    this.dataList = dataList;
    this.seriesList = this.processor.getSeriesList({dataList: dataList, range: this.range});

    this.datapointsCount = this.seriesList.reduce((prev, series) => {
      return prev + series.datapoints.length;
    }, 0);

    this.datapointsOutside = false;
    for (let series of this.seriesList) {
      if (series.isOutsideRange) {
        this.datapointsOutside = true;
      }
    }

    this.annotationsPromise.then(result => {
      this.loading = false;
      // this.alertState = result.alertState;
      result && (this.annotations = result.annotations);
      result && (this.seriesList.annotations = result.annotations);
      this.render(this.seriesList);
    }, () => {
      this.loading = false;
      this.render(this.seriesList);
    });
  }

  onRender() {
    if (!this.seriesList) { return; }

    for (let series of this.seriesList) {
      series.applySeriesOverrides(this.panel.seriesOverrides);

      if (series.unit) {
        this.panel.yaxes[series.yaxis-1].format = series.unit;
      }
    }
  }

  changeSeriesColor(series, color) {
    series.color = color;
    this.panel.aliasColors[series.alias] = series.color;
    this.render();
  }

  toggleSeries(serie, event) {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      if (this.hiddenSeries[serie.alias]) {
        delete this.hiddenSeries[serie.alias];
      } else {
        this.hiddenSeries[serie.alias] = true;
      }
    } else {
      this.toggleSeriesExclusiveMode(serie);
    }
    this.render();
  }

  toggleSeriesExclusiveMode (serie) {
    var hidden = this.hiddenSeries;

    if (hidden[serie.alias]) {
      delete hidden[serie.alias];
    }

    // check if every other series is hidden
    var alreadyExclusive = _.every(this.seriesList, value => {
      if (value.alias === serie.alias) {
        return true;
      }

      return hidden[value.alias];
    });

    if (alreadyExclusive) {
      // remove all hidden series
      _.each(this.seriesList, value => {
        delete this.hiddenSeries[value.alias];
      });
    } else {
      // hide all but this serie
      _.each(this.seriesList, value => {
        if (value.alias === serie.alias) {
          return;
        }

        this.hiddenSeries[value.alias] = true;
      });
    }
  }

  toggleAxis(info) {
    var override = _.find(this.panel.seriesOverrides, {alias: info.alias});
    if (!override) {
      override = { alias: info.alias };
      this.panel.seriesOverrides.push(override);
    }
    info.yaxis = override.yaxis = info.yaxis === 2 ? 1 : 2;
    this.render();
  };

  addSeriesOverride(override) {
    this.panel.seriesOverrides.push(override || {});
  }

  removeSeriesOverride(override) {
    this.panel.seriesOverrides = _.without(this.panel.seriesOverrides, override);
    this.render();
  }

  toggleLegend() {
    this.panel.legend.show = !this.panel.legend.show;
    this.refresh();
  }

  legendValuesOptionChanged() {
    var legend = this.panel.legend;
    legend.values = legend.min || legend.max || legend.avg || legend.current || legend.total;
    this.render();
  }

  exportCsv() {
    fileExport.exportSeriesListToCsv(this.seriesList);
  }

  exportCsvColumns() {
    fileExport.exportSeriesListToCsvColumns(this.seriesList);
  }

}

export {GraphCtrl, GraphCtrl as PanelCtrl}
