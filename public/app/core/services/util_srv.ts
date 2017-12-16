///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import _ from 'lodash';
import $ from 'jquery';

import coreModule from 'app/core/core_module';
import appEvents from 'app/core/app_events';

export class UtilSrv {
  modalScope: any;

  /** @ngInject */
  constructor(private $rootScope, private $_modal) {
  }

  init() {
    appEvents.on('show-modal', this.showModal.bind(this), this.$rootScope);
    appEvents.on('hide-modal', this.hideModal.bind(this), this.$rootScope);
  }

  hideModal() {
    if (this.modalScope && this.modalScope.dismiss) {
      this.modalScope.dismiss();
    }
  }

  showModal(options) {
    if (this.modalScope && this.modalScope.dismiss) {
      this.modalScope.dismiss();
    }

    this.modalScope = options.scope;

    if (options.model) {
      this.modalScope = this.$rootScope.$new();
      this.modalScope.model = options.model;
    } else if (!this.modalScope) {
      this.modalScope = this.$rootScope.$new();
    }

    // TODO: 想移除掉 $_modal，但是工作量有点大且繁琐，主要任务是需要将 src.html 中加上 modal modal-header modal-content
    // var modal = this.$modal({
    //   customClass: options.modalClass,
    //   scope: this.modalScope,
    //   templateUrl: options.src,
    //   template: options.templateHtml,
    //   show: false
    // });

    // modal.$promise.then(modal.show);

    var modal = this.$_modal({
      modalClass: options.modalClass,
      template: options.src,
      templateHtml: options.templateHtml,
      persist: false,
      show: false,
      scope: this.modalScope,
      keyboard: false,
      backdrop: options.backdrop
    });

    Promise.resolve(modal).then(function(modalEl) {
      modalEl.modal('show');
    });
  }

  setPie(element, pieData, colors, innerRadius) {
    $.plot(element, pieData, {
      series: {
        pie: {
          innerRadius: innerRadius || 0.7,
          show: true,
        }
      },
      colors: colors
    });
  }
}

coreModule.service('utilSrv', UtilSrv);
