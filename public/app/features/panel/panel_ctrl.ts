///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import angular from 'angular';
import $ from 'jquery';
import {profiler} from 'app/core/profiler';
import Remarkable from 'remarkable';

const TITLE_HEIGHT = 25;
const EMPTY_TITLE_HEIGHT = 9;
const PANEL_PADDING = 5;
const PANEL_BORDER = 2;

import {Emitter} from 'app/core/core';

export class PanelCtrl {
  panel: any;
  error: any;
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
  editMode: any;
  height: any;
  containerHeight: any;
  events: Emitter;
  contextSrv: any;
  integrateSrv: any;
  associationSrv: any;
  timing: any;

  constructor($scope, $injector) {
    this.$injector = $injector;
    this.$scope = $scope;
    this.$_location = $injector.get('$location');
    this.$timeout = $injector.get('$timeout');
    this.contextSrv = $injector.get('contextSrv');
    this.integrateSrv = $injector.get('integrateSrv');
    this.associationSrv = $injector.get('associationSrv');
    this.editorTabIndex = 0;
    this.events = new Emitter();
    this.timing = {};

    var plugin = config.panels[this.panel.type];
    if (plugin) {
      this.pluginId = plugin.id;
      this.pluginName = plugin.name;
    }

    $scope.$on("refresh", (event, payload) => this.refresh(payload));
    $scope.$on("render", () => this.render());
    $scope.$on("$destroy", () => {
      this.events.emit('panel-teardown');
      this.events.removeAllListeners();
    });

    // we should do something interesting
    // with newly added panels
    if (this.panel.isNew) {
      delete this.panel.isNew;
    }
  }

  init() {
    this.calculatePanelHeight();
    this.publishAppEvent('panel-initialized', {scope: this.$scope});
    this.events.emit('panel-initialized');
  }

  renderingCompleted() {
    profiler.renderingCompleted(this.panel.id, this.timing);
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
    this.addEditorTab('概要', 'public/app/partials/panelgeneral.html');
    this.editModeInitiated = true;
    this.events.emit('init-edit-mode', null);

    var urlTab = (this.$injector.get('$routeParams').tab || '').toLowerCase();
    if (urlTab) {
      this.editorTabs.forEach((tab, i) => {
        if (tab.title.toLowerCase() === urlTab) {
          this.editorTabIndex = i;
        }
      });
    }
  }

  changeTab(newIndex) {
    this.editorTabIndex = newIndex;
    var route = this.$injector.get('$route');
    route.current.params.tab = this.editorTabs[newIndex].title.toLowerCase();
    route.updateParams();
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
    menu.push({text: '放大', click: 'ctrl.updateColumnSpan(1); dismiss();', role: 'Editor', icon: 'fa-plus', hover: 'hover-show pull-left'});
    menu.push({text: '缩小', click: 'ctrl.updateColumnSpan(-1); dismiss();', role: 'Editor',  icon: 'fa-minus', hover: 'hover-show pull-left'});
    menu.push({text: '删除', click: 'ctrl.removePanel(); dismiss();', role: 'Editor', icon: 'fa-trash-o', hover: 'hover-show  pull-left'});
    menu.push({text: '分享', click: 'ctrl.sharePanel(); dismiss();', role: 'Editor', icon: 'fa-external-link'});
    menu.push({text: '编辑', click: 'ctrl.editPanel(); dismiss();', role: 'Editor', icon: 'fa-pencil'});
    if (this.checkMenu('associate')) {
      menu.push({text: '关联性分析', click: 'ctrl.associateLink();', icon: 'fa-line-chart'});
    }
    return menu;
  }

  checkMenu(menu) {
    var pathname = window.location.pathname;
    var show = false;
    var isGraph = this.panel.type === 'graph';
    var isLine = this.panel.lines;
    switch (menu) {
      case 'associate':
        show = (/^\/anomaly/.test(pathname) || (/^\/integrate/.test(pathname)));
        break;
    }
    return show && isGraph && isLine;
  }

  getExtendedMenu() {
    var actions = [];
    if (!this.fullscreen) { //  duplication is not supported in fullscreen mode
      actions.push({ text: '复制', click: 'ctrl.duplicate(); dismiss();', role: 'Editor'});
    }
    actions.push({text: '查看', click: 'ctrl.viewPanel(); dismiss();', icon: 'icon-eye-open'});
    actions.push({text: '查看 JSON', click: 'ctrl.editPanelJson(); dismiss();', role: 'Editor'});
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
      this.containerHeight = this.panel.height || this.row.height;
      if (_.isString(this.containerHeight)) {
        this.containerHeight = parseInt(this.containerHeight.replace('px', ''), 10);
      }
    }

    this.height = this.containerHeight - (PANEL_BORDER + PANEL_PADDING + (this.panel.title ? TITLE_HEIGHT : EMPTY_TITLE_HEIGHT));
  }

  render(payload?) {
    // ignore if other panel is in fullscreen mode
    if (this.otherPanelInFullscreenMode()) {
      return;
    }

    this.calculatePanelHeight();
    this.timing.renderStart = new Date().getTime();
    this.events.emit('render', payload);
  }

  duplicate() {
    this.dashboard.duplicatePanel(this.panel, this.row);
    this.$timeout(() => {
      this.$scope.$root.$broadcast('render');
    });
  }

  updateColumnSpan(span) {
    this.panel.span = Math.min(Math.max(Math.floor(this.panel.span + span), 1), 12);
    this.row.panelSpanChanged();

    this.$timeout(() => {
      this.render();
    });
  }

  removePanel() {
    this.row.removePanel(this.panel);
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
      markdown = this.error.message || this.panel.description;
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
        html += '<li><a class="panel-menu-link" href="' + info.href + '" target="' + info.target + '">' + info.title + '</a></li>';
      }
      html += '</ul>';
    }

    return html + '</div>';
  }

  openInspector() {
    var modalScope = this.$scope.$new();
    modalScope.panel = this.panel;
    modalScope.dashboard = this.dashboard;
    modalScope.panelInfoHtml = this.getInfoContent({mode: 'inspector'});

    modalScope.inspector = $.extend(true, {}, this.inspector);
    this.publishAppEvent('show-modal', {
      src: 'public/app/features/dashboard/partials/inspector.html',
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
      var msg = "图表中缺少" + err.toString().match(reg)[0] + "配置";
      this.publishAppEvent('alert-warning', ['参数缺失', msg]);
    }
  }

  toIntegrate() {
    try{
      this.integrateSrv.options.targets = _.cloneDeep(this.panel.targets);
      this.integrateSrv.options.title = this.panel.title;
      if (!this.panel.targets[0].metric) {
        this.integrateSrv.options.targets[0].metric = "*";
      }
      if (!_.isNull(this.panel.targets[0].tags)) {
        this.integrateSrv.options.targets[0].tags = {host: "*"};
      }
      this.$_location.url('/integrate');
    }catch (e) {
      this.publishAppEvent('alert-warning', ['日志分析跳转失败', '可能缺少指标名']);
    }
  }
}
