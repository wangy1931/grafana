import $ from 'jquery';
import React from 'react';

export interface ToolbarProps {
  icon?: string
  id?: any
  tooltip?: string
  popoverSrv?: any
}

const template = `<div class="toolbar-content">
  <div class="popover-content">
    <a href="{{ item.href }}" ng-repeat="item in toolbarItems" class="toolbar-item {{ item.class }}" ng-click="item.clickHandler()">
      <i class="{{ item.icon }}"></i>
      <p class="item-name">{{ item.itemname | translate }}</p>
    </a>
  </div>
</div>`;

export default class Toolbar extends React.PureComponent<ToolbarProps, any> {
  toolbarItems: {}

  constructor(props) {
    super(props);
    this.toolbarItems = {};

    this.toolbarItems[1] = [];
    this.toolbarItems[1].push({
      class: '',
      icon : 'fa fa-fw fa-book',
      itemname: 'i18n_kb',
      href: '/knowledgebase',
      clickHandler: () => {},
    });

    this.toolbarItems[2] = [];
    this.toolbarItems[2].push({
      class: '',
      icon : 'fa fa-fw fa-cloud-download',
      itemname: 'i18n_install_guide',
      href: '/setting/agent',
      clickHandler: () => {},
    });

    this.toolbarItems[2].push({
      class: '',
      icon: 'fa fa-fw fa-info-circle',
      itemname: 'i18n_usage_guide',
      href: 'javascript:;',
      clickHandler: () => {
        // $rootScope.appEvent('show-modal', {
        //   src: 'public/app/core/components/toolbar/guide_use.html',
        //   modalClass: 'guide_use',
        //   scope: $scope.$new(),
        // });
      }
    });
  }

  showPopover() {
    const { popoverSrv, id } = this.props;
    popoverSrv.show({
      element : $(`.toolbar-${id}`)[0],
      position: 'bottom center',
      template: template,
      classes : 'toolbar-popover',
      model : {
        toolbarItems: this.toolbarItems[+id],
      },
    });
  }

  render() {
    const { icon, id, popoverSrv } = this.props;
    console.log(popoverSrv);

    return (
      <i className={`${icon} toolbar-icon toolbar toolbar-${id}`}
        onClick={this.showPopover.bind(this)}
        style={{ fontWeight: 'bolder' }}
      ></i>
    )
  }
}
