import _ from 'lodash';
import coreModule from 'app/core/core_module';

coreModule.directive('kbnTableHeader', function () {
  return {
    restrict: 'A',
    scope: {
      columns: '=',
      sortOrder: '=',
      indexPattern: '=',
      onChangeSortOrder: '=?',
      onRemoveColumn: '=?',
      onMoveColumn: '=?',
    },
    templateUrl: 'public/app/core/components/elk_table/components/table_header.html',
    controller: function ($scope) {
      // TODO: allow to set {hide: true} in columns
      // ignore {hide: true} columns
      // $scope.neededColumns = _.filter($scope.columns, (column) => {
      //   return column.hide !== true;
      // });

      // repeat in html
      $scope.columnsName = _.map($scope.columns, 'text');

      $scope.isSortableColumn = function isSortableColumn(columnName) {
        if (!$scope.indexPattern || !_.isFunction($scope.onChangeSortOrder)) {
          return;
        }
        var sortable = _.find($scope.columns, { value: columnName }).sortable;
        return sortable;
      };

      $scope.canMoveColumnLeft = function canMoveColumn(column) {
        return (
          _.isFunction($scope.onMoveColumn)
          && _.findIndex($scope.columns, column) > 0
        );
      };

      $scope.canMoveColumnRight = function canMoveColumn(column) {
        return (
          _.isFunction($scope.onMoveColumn)
          && _.findIndex($scope.columns, column) < $scope.columns.length - 1
        );
      };

      $scope.canRemoveColumn = function canRemoveColumn(column) {
        return (
          _.isFunction($scope.onRemoveColumn)
          && (column.value !== '_source' || $scope.columns.length > 1)
        );
      };

      $scope.headerClass = function (columnName) {
        if (!$scope.isSortableColumn(columnName)) { return; }

        const sortOrder = $scope.sortOrder;
        const defaultClass = ['fa', 'fa-sort-up', 'table-header-sortchange'];

        if (!sortOrder || columnName !== sortOrder[0]) { return defaultClass; }
        return ['fa', sortOrder[1] === 'asc' ? 'fa-sort-up' : 'fa-sort-down'];
      };

      $scope.moveColumnLeft = function moveLeft(column) {
        const newIndex = _.findIndex($scope.columns, column) - 1;

        if (newIndex < 0) {
          return;
        }

        $scope.onMoveColumn(column.text, newIndex);
      };

      $scope.moveColumnRight = function moveRight(column) {
        const newIndex = _.findIndex($scope.columns, column) + 1;

        if (newIndex >= $scope.columns.length) {
          return;
        }

        $scope.onMoveColumn(column.text, newIndex);
      };

      $scope.removeColumn = function removeColumn(column) {
        $scope.onRemoveColumn(column.text);
      }

      $scope.cycleSortOrder = function cycleSortOrder(columnName) {
        if (!$scope.isSortableColumn(columnName)) {
          return;
        }

        const [currentColumnName, currentDirection = 'asc'] = $scope.sortOrder;
        const newDirection = (
          (columnName === currentColumnName && currentDirection === 'asc')
            ? 'desc'
            : 'asc'
        );

        $scope.onChangeSortOrder(columnName, newDirection);
      };

      $scope.getAriaLabelForColumn = function getAriaLabelForColumn(name) {
        if (!$scope.isSortableColumn(name)) { return null; }

        const [currentColumnName, currentDirection = 'asc'] = $scope.sortOrder;
        if (name === currentColumnName && currentDirection === 'asc') {
          return `Sort ${name} descending`;
        }

        return `Sort ${name} ascending`;
      };
    }
  };
});
