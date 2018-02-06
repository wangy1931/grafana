
import _ from 'lodash';
import System from 'systemjs/dist/system.js';
import {PanelCtrl} from 'app/plugins/sdk';

export class TextPanelCtrl extends PanelCtrl {
  static templateUrl = `public/app/plugins/panel/text/module.html`;

  remarkable: any;
  content: string;
  // Set and populate defaults
  panelDefaults = {
    mode    : "markdown", // 'html', 'markdown', 'text'
    content : "# title",
  };
  /** @ngInject */
  constructor($scope, $injector, private templateSrv, private $sce) {
    super($scope, $injector);

    _.defaults(this.panel, this.panelDefaults);

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('refresh', this.onRender.bind(this));
    this.events.on('render', this.onRender.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('显示效果', 'public/app/plugins/panel/text/editor.html');
    this.editorTabIndex = 1;
  }

  onRender() {
    if (this.panel.mode === 'markdown') {
      this.renderMarkdown(this.panel.content);
    } else if (this.panel.mode === 'html') {
      this.updateContent(this.panel.content);
    } else if (this.panel.mode === 'text') {
      this.renderText(this.panel.content);
    }
    this.renderingCompleted();
  }

  renderText(content) {
    content = content
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/\n/g, '<br/>');
    this.updateContent(content);
  }

  renderMarkdown(content) {
    if (!this.remarkable) {
      return System.import('remarkable').then(Remarkable => {
        this.remarkable = new Remarkable();
        this.$scope.$apply(() => {
          this.updateContent(this.remarkable.render(content));
        });
      });
    }

    this.updateContent(this.remarkable.render(content));
  }

  updateContent(html) {
    try {
      this.content = this.$sce.trustAsHtml(this.templateSrv.replace(html, this.panel.scopedVars));
    } catch (e) {
      console.log('Text panel error: ', e);
      this.content = this.$sce.trustAsHtml(html);
    }
  }
  //TODO update
//$scope.updateContent = function(html) {
//   try {
//     var scopedVars = _.clone($scope.panel.scopedVars || {});
//     var time = $scope.dashboard.time;
//     var from = "";
//     var to = "";
//     if (moment.isMoment(time.from)) {
//       from = time.from.utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
//       to = time.to.utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
//     } else {
//       from = dateMath.parse(time.from, false).utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
//       to = dateMath.parse(time.to, true).utc().format("YYYY-MM-DDTHH:mm:ss.SSS\\Z");
//     }
//     scopedVars['time_from'] = {value: from};
//     scopedVars['time_to'] = {value: to};
//     $scope.content = $sce.trustAsHtml(templateSrv.replace(html, scopedVars));
//   } catch(e) {
//     console.log('Text panel error: ', e);
//     $scope.content = $sce.trustAsHtml(html);
//   }
//
//   if(!$scope.$$phase) {
//     $scope.$digest();
//   }
// };
}

export {TextPanelCtrl as PanelCtrl}
