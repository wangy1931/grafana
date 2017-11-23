import coreModule from 'app/core/core_module';

const pagerTextTemplate = `
<div class="kuiToolBarText">
  {{ elkTablePagerText.startItem | number }} &ndash; {{ elkTablePagerText.endItem | number }} of {{ elkTablePagerText.totalItems | number }}
</div>
`;

const pagerButtonsTemplate = `
<div class="table-panel-footer">
  <ul>
    <li ng-repeat="pageNumber in elkTablePagerButtons.pagelist"
      ng-click="elkTablePagerButtons.changePage(pageNumber)"
    >
      <a class="table-panel-page-link pointer"
        ng-class="{ 'active': pageNumber == elkTablePagerButtons.currentPage }"
      >
        {{ pageNumber }}
      </a>
    </li>
  </ul>
</div>
`;

coreModule.directive('elkTablePagerText', function () {
  return {
    restrict: 'E',
    replace: true,
    template: pagerTextTemplate,
    scope: {
      startItem: '=',
      endItem: '=',
      totalItems: '=',
    },
    controllerAs: 'elkTablePagerText',
    bindToController: true,
    controller: class ElkTablePagerTextController {

      /** @ngInject */
      constructor(private $scope) {
        console.log(this);
      }

    }
  };
});

coreModule.directive('elkTablePagerButtons', function () {
  return {
    restrict: 'E',
    replace: true,
    template: pagerButtonsTemplate,
    scope: {
      onPageChange: '=',
      totalPages: '=',
      currentPage: '=',
    },
    controllerAs: 'elkTablePagerButtons',
    bindToController: true,
    controller: class ElkTablePagerButtonsController {
      pagelist: any = [];
      totalPages: any;

      /** @ngInject */
      constructor(private $scope) {
        console.log(this);
        for (var i = 0; i < this.totalPages; i++) {
          this.pagelist[i] = i + 1;
        }
      }

      changePage = (pageNumber) => {
        this.onPageChange(pageNumber);
      };

    }
  };
});

