///<reference path="../../../headers/common.d.ts" />

import angular from 'angular';
import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import 'highlight';
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {transformDataToTable} from './transformers';
import {CWTableRenderer} from './renderer';


class CWTablePanelCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  pageIndex: number;
  dataRaw: any;
  table: any;
  renderer: any;

  indexPattern: any;
  rows: any;
  columns: any = [];
  sorting: any = ['@timestamp', 'desc'];

  panelDefaults = {
    targets: [{}],
    transform: 'timeseries_to_columns',
    pageSize: null,
    showHeader: true,
    styles: [
      {
        type: 'date',
        pattern: 'Time',
        dateFormat: 'YYYY-MM-DD HH:mm:ss',
        valueMaps: [
          { value: '', op: '=', text: '' }
        ]
      },
      {
        unit: 'short',
        type: 'number',
        decimals: 2,
        colors: ["rgba(245, 54, 54, 0.9)", "rgba(237, 129, 40, 0.89)", "rgba(50, 172, 45, 0.97)"],
        colorMode: null,
        pattern: '/.*/',
        thresholds: [],
        valueMaps: [
          { value: '', op: '=', text: '' }
        ]
      }
    ],
    columns: [],
    scroll: true,
    fontSize: '100%',
    rowHeight: false,
    sort: {col: 0, desc: true},
  };

  /** @ngInject */
  constructor($scope, $injector, private annotationsSrv, private $sanitize) {
    super($scope, $injector);
    this.pageIndex = 0;

    if (this.panel.styles === void 0) {
      this.panel.styles = this.panel.columns;
      this.panel.columns = this.panel.fields;
      delete this.panel.columns;
      delete this.panel.fields;
    }

    // TODO UPDATE 
    !this.panel.styles && (this.panel.styles = []);
    // 修正接口“数值转换”的数据
    for (var i = 0; i < this.panel.styles.length; i++) {
      this.panel.styles[i].valueMaps === void 0 && (this.panel.styles[i].valueMaps = [{ value: '', op: '=', text: '' }]);
    }

    _.defaults(this.panel, this.panelDefaults);

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));

    $scope.$watchCollection('sorting', function (sort) {
      if (!sort) { return; }
      // if the searchSource doesn't know, tell it so
      if (!angular.equals(sort, this.sorting)) {
        this.renderPanel();
      }
    });
  }

  setSortOrder(columnName, direction) {
    this.sorting = [columnName, direction];
  }

  onInitPanelActions(actions) {
    actions.push({text: '导出 CSV', click: 'ctrl.exportCsv()'});
  }

  issueQueries(datasource) {
    this.pageIndex = 0;

    if (this.panel.transform === 'annotations') {
      this.setTimeQueryStart();
      return this.annotationsSrv.getAnnotations(this.dashboard).then(annotations => {
        return {data: annotations};
      });
    }

    return super.issueQueries(datasource);
  }

  onDataError(err) {
    this.dataRaw = [];
    this.render();
  }

  onDataReceived(dataList) {
    this.dataRaw = dataList;
    this.pageIndex = 0;

    // automatically correct transform mode based on data
    if (this.dataRaw && this.dataRaw.length) {
      if (this.dataRaw[0].type === 'table') {
        this.panel.transform = 'table';
      } else {
        if (this.dataRaw[0].type === 'docs') {
          this.panel.transform = 'json';
        } else {
          if (this.panel.transform === 'table' || this.panel.transform === 'json') {
            this.panel.transform = 'timeseries_to_rows';
          }
        }
      }
    }

    this.render();
  }

  render() {
    this.table = transformDataToTable(this.dataRaw, this.panel);
    console.log(this.table);
    // this.table.sort(this.panel.sort);

    this.renderer = new CWTableRenderer(this.panel, this.table, this.dashboard.isTimezoneUtc(), this.$sanitize);
    return super.render(this.table);
  }

  toggleColumnSort(col, colIndex) {
    // if sortable set false in column, ignore
    if (col.sortable === false) { return; }

    // remove sort flag from current column
    if (this.table.columns[this.panel.sort.col]) {
      this.table.columns[this.panel.sort.col].sort = false;
    }

    if (this.panel.sort.col === colIndex) {
      if (this.panel.sort.desc) {
        this.panel.sort.desc = false;
      } else {
        this.panel.sort.col = null;
      }
    } else {
      this.panel.sort.col = colIndex;
      this.panel.sort.desc = true;
    }
    this.render();
  }

  link(scope, elem, attrs, ctrl) {
    var data;
    var panel = ctrl.panel;
    var pageCount = 0;
    var formaters = [];

    function appendTableRows() {
      ctrl.renderer.setTable(data);
      var renderedData = ctrl.renderer.render(ctrl.pageIndex);

      ctrl.rows = renderedData.rows;
      ctrl.columns = renderedData.columns;
      ctrl.indexPattern = ctrl.datasource;
      console.log(ctrl);
    }

    function renderPanel() {
      var $target = elem.find('.elk-table');
      appendTableRows();
    }

    ctrl.events.on('render', function(renderData) {
      data = renderData || data;
      if (data) {
        renderPanel();
      }
      ctrl.renderingCompleted();
    });
  }
}

export {
  CWTablePanelCtrl,
  CWTablePanelCtrl as PanelCtrl
};
