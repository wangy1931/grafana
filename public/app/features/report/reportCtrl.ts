///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import coreModule from 'app/core/core_module';
import _ from 'lodash';
import 'ng-quill';

export class ReportCtrl {
  reports: Array<any>;
  reportTemplate: any;
  customReport: any;
  toolbarOptions: any;

  /** @ngInject */
  constructor (private $scope, private backendSrv, private contextSrv) {}

  /**
   * get report list
   */
  init() {
    this.backendSrv.get('/api/static/template/' + this.contextSrv.user.orgId).then((result) => {
      this.reports = result.reports;
    });
  }

  /**
   * eidt report template
   */
  initTemplate() {
    this.reportTemplate = {
      isOpen: false,
      email: ['test.email'],
      time: '周一 8:00',
      templates: [
        {
          id: 1,
          name: '模板1'
        },
        {
          id: 2,
          name: '模板2'
        },
        {
          id: 3,
          name: '模板3'
        },
        {
          id: 4,
          name: '模板4'
        },
        {
          id: 5,
          name: '模板5'
        },
        {
          id: 6,
          name: '模板6'
        }
      ]
    };
  }

  chooseTemplate(template) {
    template.selected = !template.selected;
  }

  saveTemplate() {
    console.log(this.reportTemplate);
  }

  switch() {}

  /**
   * edit custom report
   */

  initEdit() {
    this.toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'align': [] }],
      ['image'],
      ['clean']                                         // remove formatting button
    ];
  }

  editorCreated() {}
  saveCustomReport() {
    console.log(this.customReport);
  }

}

coreModule.controller('ReportCtrl', ReportCtrl);
