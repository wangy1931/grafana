import {PanelCtrl} from 'app/features/panel/panel_ctrl';
import {MetricsPanelCtrl} from 'app/features/panel/metrics_panel_ctrl';
import {QueryCtrl} from 'app/features/panel/query_ctrl';

import config from 'app/core/config';

export function loadPluginCss(options) {
  if (config.bootData.user.userTheme) {
    System.import(options[config.bootData.user.userTheme] + '!css');
  } else {
    System.import(options.light + '!css');
  }
}

export {
  PanelCtrl,
  MetricsPanelCtrl,
  QueryCtrl,
}
