import {AlertdDatasource} from './datasource';
import {AlertDQueryCtrl} from './query_ctrl';

class CustomConfigCtrl {
  static templateUrl = 'partials/config.html';
}

export {
  AlertdDatasource as Datasource,
  AlertDQueryCtrl as QueryCtrl,
  CustomConfigCtrl as ConfigCtrl,
};
