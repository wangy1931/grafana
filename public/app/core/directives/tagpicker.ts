
import angular from 'angular';
import _ from 'lodash';
import coreModule from 'app/core/core_module';

var template = `
<div class="tag-picker">

  <div class="tag-add-form-wrap">
    <div class="tag-add-form">
      <input type="text" class="add-input form-control"
             ng-model='ctrl.curTagKey'
             spellcheck='false'
             bs-typeahead-old="ctrl.allkeyOptions"
             placeholder="{{ ctrl.$translate.i18n.i18n_add_tag }}" required autofocus
             ng-blur="ctrl.getTagValue();" />
    </div>
  </div>

  <div class="tag-add-form-wrap">
    <div class="tag-add-form">
      <input type="text" class="add-input form-control"
             ng-model='ctrl.curTagValue'
             spellcheck='false'
             bs-typeahead-old="ctrl.allvalueOptions"
             placeholder="{{ ctrl.$translate.i18n.i18n_add_tag_value }}" required
             ng-enter="ctrl.postTag();" />
    </div>
  </div>

</div>
`;

export class TagPickerCtrl {
  allkey: Array<string>;
  allkeyOptions: Array<string>;
  allvalueOptions: any;
  curTagKey: string;
  curTagValue: string;

  /** @ngInject */
  constructor(private $scope, private hostSrv, private alertSrv, private $translate) {
    this.getAllTags();
  }

  getAllTags() {
    if (_.isEmpty(this.allkey)) {
      this.hostSrv.getAllTagsKey().then(response => {
        this.allkey = response.data;
        this.allkeyOptions = angular.copy(response.data);
      });
    }
  };

  getTagValue() {
    this.allvalueOptions = [];
    this.hostSrv.getTagValue(this.curTagKey).then(response => {
      this.allvalueOptions = _.map(angular.copy(response.data), 'value');
    });
  };

  postTag() {
    var params = {
      key: this.curTagKey,
      value: this.curTagValue,
      hostId: this.$scope.id
    };

    if (this.isInvalid(this.curTagKey) || this.isInvalid(this.curTagValue)) {
      this.alertSrv.set(this.$translate.i18n.page_add_tag_err, this.$translate.i18n.page_add_tag_invalid, "error", 2000);
      return;
    }

    this.hostSrv.postTag(params).then(repsonse => {
      // 如果是选择了 就返回id . 如果没有Id 默认是新增
      this.$scope.tags.push(params);
      this.curTagKey = '';
      this.curTagValue = '';
    }, err => {
      this.alertSrv.set(this.$translate.i18n.page_add_tag_err, err.data, "error", 2000);
    });
  };

  isInvalid(value) {
    var pattern = /[`~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]/im;
    return pattern.test(value);
  };

}

export function tagPicker() {
  return {
    restrict: 'E',
    controller: TagPickerCtrl,
    bindToController: true,
    controllerAs: 'ctrl',
    template: template,
  };
}

coreModule.directive('cwTagPicker', tagPicker);
