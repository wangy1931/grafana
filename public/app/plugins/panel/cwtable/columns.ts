 
import _ from 'lodash';

export function addColumn(columns, columnName) {
  // repeat in html
  var columnsName = _.map(columns, 'text');

  if (columnsName.includes(columnName)) {
    return;
  }

  columns.push({
    'text': columnName,
    'value': columnName
  });
}

export function removeColumn(columns, columnName) {
  var columnsName = _.map(columns, 'text');

  if (!columnsName.includes(columnName)) {
    return;
  }

  columns.splice(columnsName.indexOf(columnName), 1);
}

export function moveColumn(columns, columnName, newIndex) {
  // repeat in html
  var columnsName = _.map(columns, 'text');

  if (newIndex < 0) {
    return;
  }

  if (newIndex >= columns.length) {
    return;
  }

  if (!columnsName.includes(columnName)) {
    return;
  }

  let currentIndex = columnsName.indexOf(columnName);
  let currentColumn = columns.splice(currentIndex, 1);  // remove at old index
  columns.splice(newIndex, 0, currentColumn[0]);  // insert before new index
}
