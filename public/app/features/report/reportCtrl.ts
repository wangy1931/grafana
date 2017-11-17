///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import coreModule from 'app/core/core_module';
import _ from 'lodash';

export class ReportCtrl {
  reports: Array<any>;
  reportTemplate: any;

  /** @ngInject */
  constructor (private $scope, private backendSrv, private contextSrv) {}

  init() {
    this.backendSrv.get('/api/static/template/' + this.contextSrv.user.orgId).then((result) => {
      this.reports = result.reports;
    });
  }

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


  initEdit() {}

  switch() {}
}

coreModule.controller('ReportCtrl', ReportCtrl);
