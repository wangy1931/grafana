///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import coreModule from 'app/core/core_module';
import _ from 'lodash';
import 'ng-quill';

const SECTIONS = [
  {id: 1, name: '系统总览', img: 'report-summary.png'},
  {id: 2, name: '告警情况', img: 'report-alert.png'},
  {id: 3, name: '机器状态', img: 'report-host.png'},
  {id: 4, name: '服务状态', img: 'report-service.png'}
]
const TEMPLATE = {
  "orgId": 0,
  "sysId": 0,
  "enabled": false,
  "notificationEnabled": false,
  "recipients": [],
  "deliverHour": 8,
  "sections": []
}

export class ReportCtrl {
  reports: Array<any>;
  expertReports: Array<any>;
  reportTemplate: any;
  customReport: any;
  toolbarOptions: any;
  reportDownloadUrl: any;
  enabled: boolean;

  /** @ngInject */
  constructor (private $scope, private $location, private reportSrv, private contextSrv) {}

  /**
   * get report list
   */
  init() {
    this.expertReports = [];
    this.reportSrv.getReportList().then((res) => {
      this.reports = res.data || [];
    });
    this.reportSrv.getExpertReports().then((res) => {
      this.reportDownloadUrl = res.url;
      this.expertReports = res.reports;
    })
  }

  getReport(report) {
    this.reportSrv.getReportById(report.rowKey).then((res) => {
      var blob = new Blob([res.data], {type: 'application/pdf'});
      var fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl);
    });
  }

  /**
   * edit report template
   */
  initTemplate() {
    this.reportSrv.getReportConfig().then((res) => {
      this.reportTemplate = res.data || _.cloneDeep(TEMPLATE);
      var curSections = _.cloneDeep(SECTIONS);
      _.find(curSections, {id: 1}).selected = true;
      _.each(this.reportTemplate.sections, (section) => {
        var tmp = _.find(curSections, {id: section.id});
        if (tmp) {
          tmp.selected = true;
        } else {
          section.selected = true;
          section.img = 'report-other.png';
          curSections.push(section);
        }
      });

      this.reportTemplate.sections = curSections;
      this.enabled = this.reportTemplate.enabled;
    });
  }

  chooseTemplate(template) {
    if (template.id === 1) {
      this.$scope.appEvent('alert-warning', ['总览信息不可删除']);
      return;
    }
    template.selected = !template.selected;
  }

  saveTemplate() {
    var data = _.cloneDeep(this.reportTemplate);
    this.reportTemplate.sysId = this.contextSrv.user.systemId;
    this.reportTemplate.orgId = this.contextSrv.user.orgId;

    _.remove(data.sections, (section) => {
      return !section.selected;
    });
    this.reportSrv.saveReportConfig(data).then((res) => {
      this.$scope.appEvent('alert-success', ['保存成功']);
      this.$location.url('/report');
    });
  }

  switch() {}

  addEmail() {
    this.reportTemplate.recipients.push(null);
  }

  updateEmail(email, index) {
    this.reportTemplate.recipients[index] = email;
  }

  removeEmail(index) {
    _.remove(this.reportTemplate.recipients, (email, i) => {
      return i === index;
    })
  }

  disableReport() {
    this.$scope.appEvent('confirm-modal', {
      title: '取消订阅',
      text: '取消订阅将不再收到巡检报告<br>您确定要取消订阅吗',
      yesText: '确定',
      noText: '取消',
      onConfirm: () => {
        this.reportTemplate.enabled = false;
        this.saveTemplate();
      }
    });
  }

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
  saveCustomReport() {}

}

coreModule.controller('ReportCtrl', ReportCtrl);
