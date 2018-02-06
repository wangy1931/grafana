
import config from 'app/core/config';
import $ from 'jquery';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import { PanelCtrl } from './panel_ctrl';

import * as rangeUtil from 'app/core/utils/rangeutil';
import * as dateMath from 'app/core/utils/datemath';

class MetricsPanelCtrl extends PanelCtrl {
  error: boolean;
  loading: boolean;
  datasource: any;
  datasourceName: any;
  $q: any;
  $timeout: any;
  datasourceSrv: any;
  timeSrv: any;
  templateSrv: any;
  timing: any;
  range: any;
  rangeRaw: any;
  interval: any;
  resolution: any;
  timeInfo: any;
  skipDataOnInit: boolean;
  dataStream: any;
  dataSubscription: any;

  constructor($scope, $injector) {
    super($scope, $injector);

    // make metrics tab the default
    this.editorTabIndex = 1;
    this.$q = $injector.get('$q');
    this.datasourceSrv = $injector.get('datasourceSrv');
    this.timeSrv = $injector.get('timeSrv');
    this.templateSrv = $injector.get('templateSrv');

    if (!this.panel.targets) {
      this.panel.targets = [{}];
    }

    this.events.on('refresh', this.onMetricsPanelRefresh.bind(this));
    this.events.on('init-edit-mode', this.onInitMetricsPanelEditMode.bind(this));
  }

  private onInitMetricsPanelEditMode() {
    this.addEditorTab('指标', 'public/app/partials/metrics.html');
    this.addEditorTab('时间区间', 'public/app/features/panel/partials/panelTime.html');
  }

  private onMetricsPanelRefresh() {
    // ignore fetching data if another panel is in fullscreen
    if (this.otherPanelInFullscreenMode()) {
      return;
    }

    // if we have snapshot data use that
    if (this.panel.snapshotData) {
      this.updateTimeRange();
      var data = this.panel.snapshotData;
      // backward compatability
      if (!_.isArray(data)) {
        data = data.data;
      }

      this.events.emit('data-snapshot-load', data);
      return;
    }

    // // ignore if we have data stream
    if (this.dataStream) {
      return;
    }

    // clear loading/error state
    delete this.error;
    this.loading = true;

    // load datasource service
    this.setTimeQueryStart();
    this.datasourceSrv
      .get(this.panel.datasource)
      .then(this.issueQueries.bind(this))
      .then(this.handleQueryResult.bind(this))
      .then(this.saveQueryResult.bind(this))
      .catch(err => {
        this.loading = false;
        this.error = err.message || 'Timeseries data request error';
        this.inspector = { error: err };
        this.events.emit('data-error', err);
        console.log('Panel data error:', err);
      });
  }

  setTimeQueryStart() {
    this.timing = {};
    this.timing.queryStart = new Date().getTime();
  }

  setTimeQueryEnd() {
    this.timing.queryEnd = new Date().getTime();
  }

  updateTimeRange() {
    this.range = this.timeSrv.timeRange();
    this.rangeRaw = this.timeSrv.timeRange(false);

    this.applyPanelTimeOverrides();

    if (this.panel.maxDataPoints) {
      this.resolution = this.panel.maxDataPoints;
    } else {
      this.resolution = Math.ceil($(window).width() * (this.panel.span / 12));
    }

    var panelInterval = this.panel.interval;
    var datasourceInterval = (this.datasource || {}).interval;
    this.interval = kbn.calculateInterval(this.range, this.resolution, panelInterval || datasourceInterval);
  }

  applyPanelTimeOverrides() {
    this.timeInfo = '';

    // check panel time overrrides
    if (this.panel.timeFrom) {
      var timeFromInterpolated = this.templateSrv.replace(this.panel.timeFrom, this.panel.scopedVars);
      var timeFromInfo = rangeUtil.describeTextRange(timeFromInterpolated);
      if (timeFromInfo.invalid) {
        this.timeInfo = 'invalid time override';
        return;
      }

      if (_.isString(this.rangeRaw.from)) {
        var timeFromDate = dateMath.parse(timeFromInfo.from);
        this.timeInfo = timeFromInfo.display;
        this.rangeRaw.from = timeFromInfo.from;
        this.rangeRaw.to = timeFromInfo.to;
        this.range.from = timeFromDate;
        this.range.to = dateMath.parse(timeFromInfo.to);
      }
    }

    if (this.panel.timeShift) {
      var timeShiftInterpolated = this.templateSrv.replace(this.panel.timeShift, this.panel.scopedVars);
      var timeShiftInfo = rangeUtil.describeTextRange(timeShiftInterpolated);
      if (timeShiftInfo.invalid) {
        this.timeInfo = 'invalid timeshift';
        return;
      }

      var timeShift = '-' + timeShiftInterpolated;
      this.timeInfo += ' timeshift ' + timeShift;
      this.range.from = dateMath.parseDateMath(timeShift, this.range.from, false);
      this.range.to = dateMath.parseDateMath(timeShift, this.range.to, true);

      this.rangeRaw = this.range;
    }

    if (this.panel.timeForward) {
      var timeShiftInterpolated = this.templateSrv.replace(this.panel.timeForward, this.panel.scopedVars);
      var timeShiftInfo = rangeUtil.describeTextRange(timeShiftInterpolated);
      if (timeShiftInfo.invalid) {
        this.timeInfo = 'invalid timeForward';
        return;
      }

      var timeForward = '+' + timeShiftInterpolated;
      this.timeInfo += ' timeForward ' + timeForward;
      this.range.from = dateMath.parseDateMath(timeForward, this.range.from, false);
      this.range.to = dateMath.parseDateMath(timeForward, this.range.to, true);

      this.rangeRaw = this.range;
    }
    if (this.panel.hideTimeOverride) {
      this.timeInfo = '';
    }
  }

  issueQueries(datasource) {
    this.updateTimeRange();

    /**
     * 如果提供了外部数据源，直接返回，不再query
     * 注意：1）当要恢复为正常query请求时，把 externalDatasource 设置为 null
     *      2）提供的外部数据源应该满足 graph | singlestats | table 或其他panel插件的格式要求
     * 例，graph 的数据格式
     * [
     *    {
     *        target: `cpu.usr{host:"xxx"}`,
     *        datapoints: [
     *            [0.050115607375268295, 1512593700]
     *        ]
     *    }
     * ]
     */
    if (this.panel.externalDatasource) {
      return this.$q.when(this.panel.externalDatasource);
    }

    this.datasource = datasource;

    if (!this.panel.targets || this.panel.targets.length === 0) {
      return this.$q.when([]);
    }

    var metricsQuery = {
      panelId: this.panel.id,
      range: this.range,
      rangeRaw: this.rangeRaw,
      interval: this.interval,
      targets: this.panel.targets,
      format: this.panel.renderer === 'png' ? 'png' : 'json',
      maxDataPoints: this.resolution,
      scopedVars: this.panel.scopedVars,
      cacheTimeout: this.panel.cacheTimeout,
    };

    this.setTimeQueryStart();
    return datasource.query(metricsQuery).then(results => {
      this.setTimeQueryEnd();

      if (this.dashboard.snapshot) {
        this.panel.snapshotData = results;
      }

      if (results.id === 'logSearch') {
        this.panel.regularResult = results;
      }

      return results;
    });
  }

  handleQueryResult(result) {
    this.setTimeQueryEnd();
    this.loading = false;

    // check for if data source returns subject
    if (result && result.subscribe) {
      this.handleDataStream(result);
      return;
    }

    if (this.dashboard.snapshot) {
      this.panel.snapshotData = result.data;
    }

    this.events.emit('data-received', result.data);

    return result;
  }

  handleDataStream(stream) {
    // if we already have a connection
    if (this.dataStream) {
      console.log('two stream observables!');
      return;
    }

    this.dataStream = stream;
    this.dataSubscription = stream.subscribe({
      next: data => {
        console.log('dataSubject next!');
        if (data.range) {
          this.range = data.range;
        }
        this.events.emit('data-received', data.data);
      },
      error: error => {
        this.events.emit('data-error', error);
        console.log('panel: observer got error');
      },
      complete: () => {
        console.log('panel: observer got complete');
      },
    });
  }

  setDatasource(datasource) {
    // switching to mixed
    if (datasource.meta.mixed) {
      _.each(this.panel.targets, target => {
        target.datasource = this.panel.datasource;
        if (target.datasource === null) {
          target.datasource = config.defaultDatasource;
        }
      });
    } else if (this.datasource && this.datasource.meta.mixed) {
      _.each(this.panel.targets, target => {
        delete target.datasource;
      });
    }

    this.panel.datasource = datasource.value;
    this.datasourceName = datasource.name;
    this.datasource = null;
    this.refresh();
  }

  saveQueryResult(result) {
    result.data &&
      result.data[0] &&
      this.$scope.$emit('data-saved', { id: result.id, data: result.data[0].datapoints });
    result.id === 'logSearch' && this.$scope.$emit('data-saved', { id: 'queryHeader', data: result.config.data });
  }
}

export { MetricsPanelCtrl };
