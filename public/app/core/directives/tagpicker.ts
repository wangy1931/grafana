
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
             placeholder="添加标签" required autofocus
             ng-blur="ctrl.getTagValue();" />
    </div>
  </div>

  <div class="tag-add-form-wrap">
    <div class="tag-add-form">
      <input type="text" class="add-input form-control"
             ng-model='ctrl.curTagValue'
             spellcheck='false'
             bs-typeahead-old="ctrl.allvalueOptions"
             placeholder="添加标签值" required
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
  constructor(private $scope, private $timeout, private hostSrv, private alertSrv) {
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
      this.alertSrv.set("创建 Tag 失败", "输入内容中存在非法字符", "error", 2000);
      return;
    }

    this.hostSrv.postTag(params).then(repsonse => {
      // 如果是选择了 就返回id . 如果没有Id 默认是新增
      this.$scope.tags.push(params);
      this.curTagKey = '';
      this.curTagValue = '';
    }, err => {
      this.alertSrv.set("创建 Tag 失败", err.data, "error", 2000);
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
