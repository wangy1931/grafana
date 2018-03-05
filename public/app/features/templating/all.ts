import './editorCtrl';
import coreModule from 'app/core/core_module';

import templateSrv from './templateSrv';
import { VariableSrv } from './variableSrv_new';
import './variableSrv.js';
import { IntervalVariable } from './interval_variable';
import { QueryVariable } from './query_variable';
import { DatasourceVariable } from './datasource_variable';
import { CustomVariable } from './custom_variable';
import { ConstantVariable } from './constant_variable';
import { AdhocVariable } from './adhoc_variable';

coreModule.factory('templateSrv', function() {
  return templateSrv;
});

export {
  VariableSrv,
  IntervalVariable,
  QueryVariable,
  DatasourceVariable,
  CustomVariable,
  ConstantVariable,
  AdhocVariable,
};
