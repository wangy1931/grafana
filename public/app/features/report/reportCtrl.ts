///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import coreModule from 'app/core/core_module';
import _ from 'lodash';
import 'ng-quill';

const sections = [
  {id: 1, name: '模板1', img: 'public/img/service_hadoop.png'},
  {id: 2, name: '模板2', img: 'public/img/service_hadoop.png'},
  {id: 3, name: '模板3', img: 'public/img/service_hadoop.png'},
  {id: 4, name: '模板4', img: 'public/img/service_hadoop.png'},
  {id: 5, name: '模板5', img: 'public/img/service_hadoop.png'},
  {id: 6, name: '模板6', img: 'public/img/service_hadoop.png'},
  {id: 7, name: '模板7', img: 'public/img/service_hadoop.png'},
  {id: 8, name: '模板8', img: 'public/img/service_hadoop.png'},
  {id: 9, name: '模板9', img: 'public/img/service_hadoop.png'},
  {id: 10, name: '模板10', img: 'public/img/service_hadoop.png'},
  {id: 11, name: '模板11', img: 'public/img/service_hadoop.png'},
  {id: 12, name: '模板12', img: 'public/img/service_hadoop.png'}
]

export class ReportCtrl {
  reports: Array<any>;
  reportTemplate: any;
  customReport: any;
  toolbarOptions: any;

  /** @ngInject */
  constructor (private $scope, private $location, private reportSrv) {}

  /**
   * get report list
   */
  init() {
    this.reportSrv.getReportList().then((res) => {
      this.reports = res.data;
    });
  }

  getReport(report) {
    this.reportSrv.getReportById(report.rowKey).then((res) => {
      var blob = new Blob([res.data], {type: 'application/pdf'});
      var fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }

  /**
   * eidt report template
   */
  initTemplate() {
    this.reportSrv.getReportConfig().then((res) => {
      this.reportTemplate = res.data;
      var curSections = _.cloneDeep(sections);
      _.each(this.reportTemplate.sections, (section) => {
        _.find(curSections, {id: section.id}).selected = true;
      });

      this.reportTemplate.sections = curSections;
    });
  }

  chooseTemplate(template) {
    template.selected = !template.selected;
  }

  saveTemplate() {
    var data = _.cloneDeep(this.reportTemplate);
    _.remove(data.sections, (section) => {
      return !section.selected;
    });
    this.reportSrv.saveReportConfig(data).then((res) => {
      this.$scope.appEvent('alert-success', ['保存成功']);
      this.$location.url('/report');
    });
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
