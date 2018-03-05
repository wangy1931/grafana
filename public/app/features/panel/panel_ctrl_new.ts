
import config from 'app/core/config';
import _ from 'lodash';
import angular from 'angular';
import $ from 'jquery';
import Remarkable from 'remarkable';
import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN, LS_PANEL_COPY_KEY } from 'app/core/constants';

import {Emitter} from 'app/core/core';

const TITLE_HEIGHT = 27;
const PANEL_BORDER = 2;

export class PanelCtrl {
  error: any;
  panel: any;
  row: any;
  dashboard: any;
  editorTabIndex: number;
  pluginName: string;
  pluginId: string;
  editorTabs: any;
  $scope: any;
  $injector: any;
  $timeout: any;
  $_location: any;
  fullscreen: boolean;
  inspector: any;
  editModeInitiated: boolean;
  editorHelpIndex: number;
  editMode: any;
  height: any;
  containerHeight: any;
  events: Emitter;
  contextSrv: any;
  integrateSrv: any;
  associationSrv: any;
  $translate: any;

  constructor($scope, $injector) {
    this.$injector = $injector;
    this.$scope = $scope;
    this.$_location = $injector.get('$location');
    this.$timeout = $injector.get('$timeout');
    this.contextSrv = $injector.get('contextSrv');
    this.integrateSrv = $injector.get('integrateSrv');
    this.associationSrv = $injector.get('associationSrv');
    this.$translate = $injector.get('$translate');
    this.editorTabIndex = 0;
    this.events = new Emitter();

    var plugin = config.panels[this.panel && this.panel.type];
    if (plugin) {
      this.pluginId = plugin.id;
      this.pluginName = plugin.name;
    }

    $scope.$on('component-did-mount', () => this.panelDidMount());
    $scope.$on("refresh", (event, payload) => this.refresh(payload));
    $scope.$on("render", () => this.render());
    $scope.$on("$destroy", () => {
      this.events.emit('panel-teardown');
      this.events.removeAllListeners();
    });
  }

  init() {
    // this.calculatePanelHeight();
    this.publishAppEvent('panel-initialized', {scope: this.$scope});
    this.events.emit('panel-initialized');
  }

  panelDidMount() {
    this.events.emit('component-did-mount');
  }

  renderingCompleted() {
    this.$scope.$root.performance.panelsRendered++;
  }

  refresh(payload?) {
    // ignore if panel id is specified
    if (this.specifiedPanelId(payload)) {
      return;
    }

    this.events.emit('refresh', payload);
  }

  publishAppEvent(evtName, evt) {
    this.$scope.$root.appEvent(evtName, evt);
  }

  changeView(fullscreen, edit) {
    this.publishAppEvent('panel-change-view', {
      fullscreen: fullscreen, edit: edit, panelId: this.panel.id
    });
  }

  viewPanel() {
    this.changeView(true, false);
  }

  editPanel() {
    this.changeView(true, true);
  }

  exitFullscreen() {
    this.changeView(false, false);
  }

  initEditMode() {
    this.editorTabs = [];
    this.addEditorTab(this.$translate.i18n.i18n_general, 'public/app/partials/panelgeneral.html');
    this.editModeInitiated = true;
    this.events.emit('init-edit-mode', null);
  }

  addEditorTab(title, directiveFn, index?) {
    var editorTab = {title, directiveFn};

    if (_.isString(directiveFn)) {
      editorTab.directiveFn = function() {
        return {templateUrl: directiveFn};
      };
    }
    if (index) {
      this.editorTabs.splice(index, 0, editorTab);
    } else {
      this.editorTabs.push(editorTab);
    }
  }

  getMenu() {
    let menu = [];
    menu.push({text: this.$translate.i18n.i18n_enlarge, click: 'ctrl.updateColumnSpan(1); dismiss();', role: 'Editor', icon: 'fa-plus', hover: 'hover-show pull-left'});
    menu.push({text: this.$translate.i18n.i18n_narrow, click: 'ctrl.updateColumnSpan(-1); dismiss();', role: 'Editor',  icon: 'fa-minus', hover: 'hover-show pull-left'});
    menu.push({text: this.$translate.i18n.i18n_delete, click: 'ctrl.removePanel(); dismiss();', role: 'Editor', icon: 'fa-trash-o', hover: 'hover-show  pull-left'});
    menu.push({text: this.$translate.i18n.i18n_share, click: 'ctrl.sharePanel(); dismiss();', role: 'Editor', icon: 'fa-external-link'});
    menu.push({text: this.$translate.i18n.i18n_edit, click: 'ctrl.editPanel(); dismiss();', role: 'Editor', icon: 'fa-pencil'});
    if (this.checkMenu('association')) {
      menu.push({text: this.$translate.i18n.page_association_title, click: 'ctrl.associateLink();', icon: 'fa-line-chart'});
    }
    if (this.checkMenu('correlation')) {
      menu.push({text: this.$translate.i18n.page_association_info5, click: 'ctrl.correlation();', icon: 'fa-clock-o'})
    }
    return menu;
  }

  checkMenu(menu) {
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
  }

  getExtendedMenu() {
    var actions = [];
    if (!this.fullscreen) { //  duplication is not supported in fullscreen mode
      actions.push({ text: this.$translate.i18n.i18n_copy, click: 'ctrl.duplicate(); dismiss();', role: 'Editor'});
    }
    actions.push({text: this.$translate.i18n.i18n_query, click: 'ctrl.viewPanel(); dismiss();', icon: 'icon-eye-open'});
    actions.push({text: this.$translate.i18n.i18n_view_json, click: 'ctrl.editPanelJson(); dismiss();', role: 'Editor'});
    this.events.emit('init-panel-actions', actions);
    return actions;
  }

  otherPanelInFullscreenMode() {
    return this.dashboard.meta.fullscreen && !this.fullscreen;
  }

  specifiedPanelId(payload) {
    if (_.isNumber(payload) || _.isString(payload)) {
      return this.panel.id !== payload;
    }
    if (_.isArray(payload)) {
      return !~payload.indexOf(this.panel.id);
    }
    return false;
  }

  calculatePanelHeight() {
    if (this.fullscreen) {
      var docHeight = $(window).height();
      var editHeight = Math.floor(docHeight * 0.4);
      var fullscreenHeight = Math.floor(docHeight * 0.8);
      this.containerHeight = this.editMode ? editHeight : fullscreenHeight;
    } else {
      this.containerHeight = this.panel.gridPos.h * GRID_CELL_HEIGHT + (this.panel.gridPos.h - 1) * GRID_CELL_VMARGIN;
    }

    if (this.panel.soloMode) {
      this.containerHeight = $(window).height();
    }

    this.height = this.containerHeight - (PANEL_BORDER + TITLE_HEIGHT);
    // if (this.fullscreen) {
    //   var docHeight = $(window).height();
    //   var editHeight = Math.floor(docHeight * 0.3);
    //   var fullscreenHeight = Math.floor(docHeight * 0.7);
    //   this.containerHeight = this.editMode ? editHeight : fullscreenHeight;
    // } else {
    //   this.containerHeight = this.panel.height || this.row.height;
    //   if (_.isString(this.containerHeight)) {
    //     this.containerHeight = parseInt(this.containerHeight.replace('px', ''), 10);
    //   }
    // }

    // this.height = this.containerHeight - (PANEL_PADDING + (this.panel.title ? TITLE_HEIGHT : EMPTY_TITLE_HEIGHT));
  }

  render(payload?) {
    // ignore if other panel is in fullscreen mode
    if (this.otherPanelInFullscreenMode()) {
      return;
    }

    // this.calculatePanelHeight();
    this.events.emit('render', payload);
  }

  toggleEditorHelp(index) {
    if (this.editorHelpIndex === index) {
      this.editorHelpIndex = null;
      return;
    }
    this.editorHelpIndex = index;
  }

  duplicate() {
    this.dashboard.duplicatePanel(this.panel, this.row);
  }

  updateColumnSpan(span) {
    this.panel.span = Math.min(Math.max(Math.floor(this.panel.span + span), 1), 12);
    this.$timeout(() => {
      this.render();
    });
  }

  removePanel() {
    this.publishAppEvent('confirm-modal', {
      title: this.$translate.i18n.i18n_sure_operator,
      text: this.$translate.i18n.i18n_sure_operator,
      icon: 'fa-trash',
      yesText: this.$translate.i18n.i18n_delete,
      noText: this.$translate.i18n.i18n_cancel,
      onConfirm: () => {
        this.row.panels = _.without(this.row.panels, this.panel);
      }
    });
  }

  editPanelJson() {
    this.publishAppEvent('show-json-editor', {
      object: this.panel,
      updateHandler: this.replacePanel.bind(this)
    });
  }

  replacePanel(newPanel, oldPanel) {
    var row = this.row;
    var index = _.indexOf(this.row.panels, oldPanel);
    this.row.panels.splice(index, 1);

    // adding it back needs to be done in next digest
    this.$timeout(() => {
      newPanel.id = oldPanel.id;
      newPanel.span = oldPanel.span;
      this.row.panels.splice(index, 0, newPanel);
    });
  }

  sharePanel() {
    var shareScope = this.$scope.$new();
    shareScope.panel = this.panel;
    shareScope.dashboard = this.dashboard;

    this.publishAppEvent('show-modal', {
      src: 'public/app/features/dashboard/partials/shareModal.html',
      scope: shareScope
    });
  }

  getInfoMode() {
    if (this.error) {
      return 'error';
    }
    if (!!this.panel.description) {
      return 'info';
    }
    if (this.panel.links && this.panel.links.length) {
      return 'links';
    }
    return '';
  }

  getInfoContent(options) {
    var markdown = this.panel.description;

    if (options.mode === 'tooltip') {
      markdown = this.error || this.panel.description;
    }

    var linkSrv = this.$injector.get('linkSrv');
    var templateSrv = this.$injector.get('templateSrv');
    var interpolatedMarkdown = templateSrv.replace(markdown, this.panel.scopedVars);
    var html = '<div class="markdown-html">';

    html += new Remarkable().render(interpolatedMarkdown);

    if (this.panel.links && this.panel.links.length > 0) {
      html += '<ul>';
      for (let link of this.panel.links) {
        var info = linkSrv.getPanelLinkAnchorInfo(link, this.panel.scopedVars);
        html +=
          '<li><a class="panel-menu-link" href="' +
          info.href +
          '" target="' +
          info.target +
          '">' +
          info.title +
          '</a></li>';
      }
      html += '</ul>';
    }

    return html + '</div>';
  }

  openInspector() {
    var modalScope = this.$scope.$new();
    modalScope.panel = this.panel;
    modalScope.dashboard = this.dashboard;
    modalScope.inspector = angular.copy(this.inspector);

    this.publishAppEvent('show-modal', {
      src: 'public/app/partials/inspector.html',
      scope: modalScope
    });
  }

  associateLink() {
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
    } catch (err) {
      var reg = /\'(.*?)\'/g;
      var msg = this.$translate.i18n.i18n_param_miss + ": " + err.toString().match(reg)[0];
      this.publishAppEvent('alert-warning', [this.$translate.i18n.i18n_param_miss, msg]);
    }
  }

  getDownsamplesMenu() {
    var downsamples = [];
    _.each(this.panel.downsamples, (downsample) => {
      downsamples.push({text: downsample, click: 'ctrl.setDownsample(\'' + downsample + '\');dismiss();'});
    })
    return downsamples;
  }

  setDownsample(interval) {
    this.panel.downsample = interval;
    _.each(this.panel.targets, (target) => {
      target.downsampleInterval = interval;
    })
    this.$timeout(() => {
      this.$scope.$broadcast('refresh', this.panel.id);
    });
  }

  correlation() {
    this.$scope.$emit('analysis', 'updateTime');
  }
}
