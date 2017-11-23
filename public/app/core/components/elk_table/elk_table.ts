import _ from 'lodash';
import { getSort } from 'app/core/components/elk_table/lib/get_sort';
import { getLimitedSearchResultsMessage } from './elk_table_strings';
import * as columnActions from 'app/core/components/elk_table/actions/columns';
import 'app/core/components/elk_table/components/table_header';
import 'app/core/components/elk_table/components/table_row';
import 'app/core/components/elk_table/components/table_pager';

import Pager from 'app/core/utils/pager';
import coreModule from 'app/core/core_module';

export function elkTable($filter, datasourceSrv) {
  'use strict';

  return {
    restrict: 'E',
    templateUrl: 'public/app/core/components/elk_table/elk_table.html',
    scope: {
      sorting: '=',
      columns: '=',
      hits: '=', // You really want either hits & indexPattern, OR searchSource
      indexPattern: '=?',
      searchSource: '=?',
      infiniteScroll: '=?',
      filter: '=?',
      filters: '=?',
      minimumVisibleRows: '=?',
      onAddColumn: '=?',
      onChangeSortOrder: '=?',
      onMoveColumn: '=?',
      onRemoveColumn: '=?',
    },
    link: ($scope, $el) => {
      const limitTo = $filter('limitTo');
      const calculateItemsOnPage = () => {
        $scope.pager.setTotalItems($scope.hits.length);
        $scope.pageOfItems = limitTo($scope.hits, $scope.pager.pageSize, $scope.pager.startIndex);
      };

      $scope.$watch('minimumVisibleRows', (minimumVisibleRows) => {
        $scope.limit = Math.max(minimumVisibleRows || 50, $scope.limit || 50);
      });

      $scope.$watchCollection('columns', (columns, oldColumns) => {
        if (oldColumns.length === 1 && oldColumns[0].value === '_source' && $scope.columns.length > 1) {
          $scope.columns = columns;
        }

        if ($scope.columns.length === 0) {
          $scope.columns.push({
            text : '_source',
            value: '_source'
          });
        }
      });

      $scope.$watchCollection('hits', (hits, oldHits) => {
        if (hits === oldHits) { return; }
        if (hits.length > 0) {
          $scope.totalHitCount = hits.length; // hits.total;
          $scope.pager = new Pager(hits.length, 50, 1);
          calculateItemsOnPage();
        }
      });

      $scope.persist = {
        sorting: $scope.sorting,
        columns: $scope.columns
      };

      $scope.limitedResultsWarning = getLimitedSearchResultsMessage(500);

      $scope.pageOfItems = [];
      $scope.onPageChange = (pageNumber) => {
        $scope.pager.changePage(pageNumber);
        calculateItemsOnPage();
      };
      $scope.onPageNext = () => {
        $scope.pager.nextPage();
        calculateItemsOnPage();
      };

      $scope.onPagePrevious = () => {
        $scope.pager.previousPage();
        calculateItemsOnPage();
      };

      $scope.shouldShowLimitedResultsWarning = () => (
        !$scope.pager.hasNextPage && $scope.pager.totalItems < $scope.totalHitCount
      );


      $scope.onMoveColumn = function moveColumn(columnName, newIndex) {
        columnActions.moveColumn($scope.columns, columnName, newIndex);
      };

      $scope.onRemoveColumn = function removeColumn(columnName) {
        columnActions.removeColumn($scope.columns, columnName);
      };

    }
  };
}

coreModule.directive('elkTable', elkTable);
