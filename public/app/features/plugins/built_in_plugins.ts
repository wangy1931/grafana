import * as graphitePlugin from 'app/plugins/datasource/graphite/module';
import * as cloudwatchPlugin from 'app/plugins/datasource/cloudwatch/module';
import * as elasticsearchPlugin from 'app/plugins/datasource/elasticsearch/module';
import * as opentsdbPlugin from 'app/plugins/datasource/opentsdb/module';
import * as grafanaPlugin from 'app/plugins/datasource/grafana/module';
import * as influxdbPlugin from 'app/plugins/datasource/influxdb/module';
import * as mixedPlugin from 'app/plugins/datasource/mixed/module';
import * as prometheusPlugin from 'app/plugins/datasource/prometheus/module';

import * as textPanel from 'app/plugins/panel/text/module';
import * as graphPanel from 'app/plugins/panel/graph/module';
import * as dashListPanel from 'app/plugins/panel/dashlist/module';
import * as pluginsListPanel from 'app/plugins/panel/pluginlist/module';
import * as tablePanel from 'app/plugins/panel/table/module';
import * as singlestatPanel from 'app/plugins/panel/singlestat/module';
import * as cwTablePanel from 'app/plugins/panel/cwtable/module';


const builtInPlugins = {
  'app/plugins/datasource/graphite/module': graphitePlugin,
  'app/plugins/datasource/cloudwatch/module': cloudwatchPlugin,
  'app/plugins/datasource/elasticsearch/module': elasticsearchPlugin,
  'app/plugins/datasource/opentsdb/module': opentsdbPlugin,
  'app/plugins/datasource/grafana/module': grafanaPlugin,
  'app/plugins/datasource/influxdb/module': influxdbPlugin,
  'app/plugins/datasource/mixed/module': mixedPlugin,
  'app/plugins/datasource/prometheus/module': prometheusPlugin,

  'app/plugins/panel/text/module': textPanel,
  'app/plugins/panel/graph/module': graphPanel,
  'app/plugins/panel/dashlist/module': dashListPanel,
  'app/plugins/panel/pluginlist/module': pluginsListPanel,
  'app/plugins/panel/table/module': tablePanel,
  'app/plugins/panel/singlestat/module': singlestatPanel,
  'app/plugins/panel/cwtable/module': cwTablePanel,
};

export default builtInPlugins;
