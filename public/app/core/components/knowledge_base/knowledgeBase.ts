///<reference path="../../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import 'ng-quill';
import coreModule from '../../core_module';

export class KnowledgeBaseCtrl {
  q: string;
  service: string;
  services: Array<any>;
  fullText: any;
  readOnly: boolean;
  showList: boolean;
  showCreatForm: boolean;
  knowledge: any;
  newKnowledge: any;
  detailKnowledge: any;
  knowledgeCopy: any;

  /** @ngInject */
  constructor(
    private $scope, private $rootScope, private backendSrv,
    private contextSrv, private $translate
  ) {
    this.q = "*";
    this.service = "*";
    this.services = ["*", "system", "hadoop", "hbase", "kafka", "mysql", "spark", "storm", "yarn", "zookeeper", "tomcat", "opentsdb", "mongo3", "nginx", "windows", "exchange"];
    this.fullText = [];
    this.readOnly = true;

    $scope.$on("$destroy", () => {
      window.removeEventListener('popstate', this.pushState);
    });
  }

  query() {
    this.showList = true;
    this.showCreatForm = false;
    var params =  {
      q: this.q
    };

    if (this.service !== "*") {
      params['service'] = this.service;
    }

    this.backendSrv.knowledge({
      method: "GET",
      url: "/search",
      params: params,
    }).then((result) => {
      this.knowledge = result.data;
      this.knowledgeCopy = _.cloneDeep(result.data);
    });
  }

  initNewKnows() {
    this.showCreatForm = true;
    this.newKnowledge = {
      solution: "",
      service: ""
    };
  }

  newKnowsByLog() {
    this.newKnowledge.symptom = this.q;
    this.newKnowledge.org_id = this.contextSrv.user.orgId;
    this.newKnowledge.system_id = this.contextSrv.user.systemId;

    this.backendSrv.knowledge({
      method: "PUT",
      url: "",
      data: this.newKnowledge
    }).then((res) => {
      res.data.isSuccessful && this.$scope.appEvent('alert-success', [this.$translate.i18n.i18n_success]);
    });
    this.showCreatForm = false;
  }

  cancelCreate() {
    this.showCreatForm = false;
  }

  textOverflow(index) {
    this.fullText[index] = !this.fullText[index];
  }

  editorCreated(editor, knowledge, isDetail) {
    if (isDetail) {
      editor.root.innerHTML = knowledge;
    } else {
      var tmp = knowledge.trim();
      tmp = tmp.replace(/[\r]?\n/g, '');
      tmp = tmp.replace(/<\/?[ol|li|blockquote|pre]+>/g, '');
      tmp = tmp.replace(/<.*\b">/g, '');
      tmp = tmp.replace(/<\/?.*\b>/g, '');

      var length = tmp.length > 100 ? 100 : tmp.length;
      var end = tmp.length > 100 ? '...' : '';
      editor.root.innerHTML = tmp.substring(0, length) + end;
    }
  }

  getDetail(knowledge) {
    this.showList = false;
    this.detailKnowledge = _.find(this.knowledgeCopy, {id: knowledge.id});
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', this.pushState);
  }

  getList() {
    this.showList = true;
  }

  // 禁用浏览器后退按钮
  pushState() {
    history.pushState(null, null, document.URL);
  }

}

export function knowledgeBaseDirective() {
  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/knowledge_base/knowledge_body.html',
    controller: KnowledgeBaseCtrl,
    bindToController: true,
    transclude: true,
    controllerAs: 'ctrl',
    scope: {
    },
    link: function(scope, elem, attrs, ctrl) {
    }
  };
}

coreModule.directive('knowledgeBase', knowledgeBaseDirective);
