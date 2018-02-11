
import _ from 'lodash';

export default class TableModel {
  columns: any[];
  rows: any[];
  type: string;

  constructor() {
    this.columns = [];
    this.rows = [];
    this.type = 'cwtable';
  }

  sort(options) {
    if (options.col === null || this.columns.length <= options.col) {
      return;
    }

    const column = this.columns[options.col].value;
    const order = options.desc ? 'desc' : 'asc';

    this.rows = _.orderBy(this.rows, [column], [order]);

    this.columns[options.col].sort = true;

    if (options.desc) {
      // this.rows.reverse();
      this.columns[options.col].desc = true;
    } else {
      this.columns[options.col].desc = false;
    }
  }
}
