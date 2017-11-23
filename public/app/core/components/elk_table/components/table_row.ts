import _ from 'lodash';
import $ from 'jquery';
import tableRowTpls from './table_row_tpl';
import coreModule from 'app/core/core_module';

// guesstimate at the minimum number of chars wide cells in the table should be
const MIN_LINE_LENGTH = 20;

/**
 * kbnTableRow directive
 *
 * Display a row in the table
 * ```
 * <tr ng-repeat="row in rows" kbn-table-row="row"></tr>
 * ```
 */
coreModule.directive('kbnTableRow', ($compile, $httpParamSerializer) => {
  const cellTemplate = _.template(tableRowTpls.cellTpl);
  const truncateByHeightTemplate = _.template(tableRowTpls.truncateTpl);

  return {
    restrict: 'A',
    scope: {
      columns: '=',
      filter: '=',
      filters: '=?',
      indexPattern: '=',
      row: '=kbnTableRow',
      onAddColumn: '=?',
      onRemoveColumn: '=?',
    },
    link: ($scope, $el) => {
      $el.empty();

      $scope.$watchCollection('row', (row, oldRow) => {
        if (_.isEqual(row, oldRow)) { return; }
        createSummaryRow($scope.row, $scope.row._id);
      });

      // when we compile the toggle button in the summary, we use this $scope
      let $toggleScope;

      $scope.$watchCollection('columns', () => {
        createSummaryRow($scope.row, $scope.row._id);
      });

      $scope.$watchGroup([
        'indexPattern.timeField',
        'row.highlight',
      ], () => {
        createSummaryRow($scope.row, $scope.row._id);
      });

      /**
       * create a tr element that lists the value for each *column*
       */
      function createSummaryRow(row, rowId) {
        const indexPattern = $scope.indexPattern;

        // We just create a string here because its faster.
        const newHtmls = [
          tableRowTpls.checkboxTpl
        ];

        $scope.columns.forEach((column) => {
          // TODO: allow to set {hide: true} in columns
          // ignore {hide: true} columns
          // if (column.hide !== true) {}
          newHtmls.push(cellTemplate({
            timefield: (column.value === '@timestamp'),
            sourcefield: (column.value === '_source'),
            formatted: _displayField(row, column.value, true),
            column
          }));
        });

        let $cells = $el.children();
        newHtmls.forEach((html, i) => {
          const $cell = $cells.eq(i);
          if ($cell.data('discover:html') === html) { return; }

          const reuse = _.find($cells.slice(i + 1), (cell) => {
            return $.data(cell, 'discover:html') === html;
          });

          const $target = reuse ? $(reuse).detach() : $(html);
          $target.data('discover:html', html);
          const $before = $cells.eq(i - 1);
          if ($before.size()) {
            $before.after($target);
          } else {
            $el.append($target);
          }

          // rebuild cells since we modified the children
          $cells = $el.children();

          if (!reuse) {
            $toggleScope = $scope.$new();
            $compile($target)($toggleScope);
          }
        });

        // trim off cells that were not used rest of the cells
        $cells.filter(':gt(' + (newHtmls.length - 1) + ')').remove();
        $el.trigger('renderComplete');
      }

      /**
       * Fill an element with the value of a field
       */
      function _displayField(row, fieldName, truncate) {
        const indexPattern = $scope.indexPattern;
        const text = row[fieldName];
        // const text = indexPattern.formatField(row, fieldName);

        if (truncate && text.length > MIN_LINE_LENGTH) {
          return truncateByHeightTemplate({
            body: text
          });
        }

        return text;
      }

      /**
       * 为特定业务加的功能
       */
      // checkbox 选择日志
      $scope.selectLog = () => {
        $scope.$emit('select-log', $scope.row);
      };

    }
  };
});
