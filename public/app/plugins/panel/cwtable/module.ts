import _ from 'lodash';
import $ from 'jquery';
import 'vendor/angular-other/highlight';
import {MetricsPanelCtrl} from 'app/plugins/sdk';
import {transformers, transformDataToTable} from './transformers';
import {CWTableRenderer} from './renderer';
import * as columnActions from './columns';


class CWTablePanelCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  pageIndex: number;
  pageCounts: any;
  dataRaw: any;
  table: any;
  renderer: any;

  indexPattern: any;
  rows: any;
  columns: any = [];

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
    operator: {
      hide: true,
      type: "checkbox"
    },
  };

  pager: any;
  pageOfItems: any = [];

  hideOperator: boolean;
  operatorType: string;

  MAX_CONTENT_LEN = 514;

  /** @ngInject */
  constructor($scope, $injector, private annotationsSrv, private $sanitize, private $filter) {
    super($scope, $injector);
    this.pageIndex = 0;
    this.pageCounts = [];

    !this.panel && (this.panel = {});

    if (this.panel.styles === void 0) {
      this.panel.styles = this.panel.columns;
      this.panel.columns = this.panel.fields;
      delete this.panel.columns;
      delete this.panel.fields;
    }

    _.defaults(this.panel, this.panelDefaults);

    this.hideOperator = this.panel.operator && this.panel.operator.hide;
    this.operatorType = !this.hideOperator && this.panel.operator.type;

    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-panel-actions', this.onInitPanelActions.bind(this));
  }

  // Query
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

  // Events callback
  onInitPanelActions(actions) {
    actions.push({text: '导出 CSV', click: 'ctrl.exportCsv()'});
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
      var columns = transformers[this.panel.transform].getColumns(this.dataRaw);
      this.panel.fields = columns;
    }

    this.render();
  }

  // Columns
  isSortableColumn(columnIndex) {
    if (!this.indexPattern || !_.isFunction(this.toggleColumnSort)) {
      return null;
    }
    var sortable = this.columns[columnIndex].sortable !== false;
    return sortable;
  }

  headerClass(columnIndex) {
    if (!this.isSortableColumn(columnIndex)) { return null; }

    const sortOrder = this.panel.sort;
    const defaultClass = ['fa', 'fa-sort-down', 'table-header-sortchange'];

    if (!sortOrder || columnIndex !== sortOrder.col) { return defaultClass; }
    return ['fa', sortOrder.desc === true ? 'fa-sort-down' : 'fa-sort-up'];
  }

  toggleColumnSort(colIndex) {
    // if sortable set false in column, ignore
    if (!this.isSortableColumn(colIndex)) { return; }

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

  render() {
    this.table = transformDataToTable(this.dataRaw, this.panel);
    this.table.sort(this.panel.sort);

    this.renderer = new CWTableRenderer(this.panel, this.table, this.dashboard.isTimezoneUtc(), this.$sanitize);
    return super.render(this.table);
  }

  expandOrCollapse(e) {
    var target = e.target || e.toElement;
    var el = $(target);
    el.css({ 'display': 'none' });
    el.hasClass('expand-showmore') && el.next().css({ 'display': 'inline-block' }) && el.parent().prev().css({ 'max-height': 'none' });
    el.hasClass('collapse-showmore') && el.prev().css({ 'display': 'inline-block' }) && el.parent().prev().css({ 'max-height': '122px' });
  }

  // 点击文本展开/收起
  expandOrCollapseText(e) {
    var target = e.target || e.toElement;
    var el = $(target);
    var span = el.next();
    if (el.css('max-height') === '122px') {
      el.css({ 'max-height': 'none' })
      span.find('.collapse-showmore').css({ 'display': 'inline-block' })
      span.find('.expand-showmore').css({ 'display': 'none' })
    } else {
      el.css({ 'max-height': '122px' })
      span.find('.expand-showmore').css({ 'display': 'inline-block' })
      span.find('.collapse-showmore').css({ 'display': 'none' })
    }
  }

  /**
   * 为特定业务加的功能
   */
  selectLog(row) {
    this.$scope.$emit('select-log', _.cloneDeep(row));
  }

  expandLog(row) {
    this.$scope.$emit('expand-log', _.cloneDeep(row));
  }

  onCellClick(index, cellValue, row) {
    this.$scope.$emit('cwtable-cell-click', [index, cellValue, row, this.dataRaw]);
  }

  link(scope, elem, attrs, ctrl) {
    var data;
    var panel = ctrl.panel;
    var pageCount = 0;
    var formaters = [];

    function renderTableRows(renderedData) {
      ctrl.rows = renderedData.rows;
      ctrl.columns = renderedData.columns;
      ctrl.indexPattern = ctrl.datasource;
    }

    function renderPaginationControls(renderedData) {
      const limitTo = ctrl.$filter('limitTo');
      const pageSize = panel.pageSize || 100;
      const pageCount = Math.ceil(data.rows.length / pageSize);
      var arr = [];

      for (var i = 0; i < pageCount; i++) {
        arr[i] = i + 1;
      }

      ctrl.pageCounts = arr;
      ctrl.pageOfItems = limitTo(renderedData.rows, pageSize, ctrl.pageIndex*pageSize);
    }

    function renderPanel() {
      ctrl.renderer.setTable(data);
      const renderedData = ctrl.renderer.render(ctrl.pageIndex);

      const panelElem = elem.parents('.panel');
      const tbodyElem = elem.find('tbody');
      elem.css({'font-size': panel.fontSize});

      renderTableRows(renderedData);
      renderPaginationControls(renderedData);

      panelElem._removeHighlight();
      ctrl.$timeout(() => {
        if (panel.targets.length) {
          var highlight_txt = panel.targets[0].query;
          highlight_txt = _.replace(highlight_txt, /( OR | AND | NOT |(message|type|host)[ ]*:)|(\(|\))/gi, ' ');
          highlight_txt = _.replace(highlight_txt, /  /gi, ' ');
          highlight_txt = _.replace(highlight_txt, /\"/gi, '');
          highlight_txt = _.trim(highlight_txt);
          var highlight_arr = _.split(highlight_txt, ' ');
          _.each(highlight_arr, (txt) => {
            panelElem._highlight(txt);
          });
        }
      });
    }

    ctrl.changePage = (pageNumber) => {
      ctrl.pageIndex = parseInt(pageNumber) - 1;
      renderPanel();
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
