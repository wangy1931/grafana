 

import _ from 'lodash';
import config from 'app/core/config';
import coreModule from '../core_module';

export class GuideUseCtrl {
  guidePath: string;

  /** @ngInject */
  constructor($scope, $rootScope, $location, private $sce) {
    var path = $location.path();
    path = _.replace(path, /\//g, '_');
    path = _.guideMap()[path] || 'ui_summary';
    this.guidePath = $sce.trustAsResourceUrl(`https://cloudwiz.cn/document/part4/${path}.html`);
  }
}

coreModule.controller('GuideUseCtrl', GuideUseCtrl);
