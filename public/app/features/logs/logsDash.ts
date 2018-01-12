var panelMetas = [
  {
    "collapse": false,
    "editable": false,
    "height": "300px",
    "panels": [
      {
        "columns": [
          {
            "text": "_id",
            "value": "_id",
            "hide": true
          },
          {
            "text": "@timestamp",
            "value": "@timestamp"
          },
          {
            "text": "host",
            "value": "host"
          },
          {
            "text": "_type",
            "value": "_type"
          },
          {
            "text": "message",
            "value": "message"
          }
        ],
        "operator": {
          "hide": true,
          "type": "checkbox"
        },
        "datasource": "elk",
        "editable": true,
        "error": false,
        "fontSize": "100%",
        "height": "500",
        "helpInfo": {
          "context": "",
          "info": false,
          "title": ""
        },
        "hideTimeOverride": false,
        "id": 1,
        "isNew": true,
        "links": [],
        "pageSize": null,
        "scroll": false,
        "showHeader": true,
        "sort": {
          "col": 0,
          "desc": true
        },
        "span": 12,
        "styles": [
          {
            "dateFormat": "YYYY-MM-DD HH:mm:ss,sss",
            "pattern": "@timestamp",
            "type": "date"
          },
          {
            "colorMode": null,
            "colors": [
              "rgba(245, 54, 54, 0.9)",
              "rgba(237, 129, 40, 0.89)",
              "rgba(50, 172, 45, 0.97)"
            ],
            "decimals": 2,
            "pattern": "/.*/",
            "thresholds": [],
            "type": "number",
            "unit": "short"
          }
        ],
        "targets": [
          {
            "aggregator": "sum",
            "bucketAggs": [],
            "downsampleAggregator": "avg",
            "dsType": "elasticsearch",
            "errors": {},
            "metrics": [
              {
                "field": "select field",
                "id": 11,
                "meta": {},
                "settings": {},
                "type": "raw_document"
              }
            ],
            "query": "$QUERY",
            "refId": "A",
            "timeField": "@timestamp",
            "size": "$SIZE"
          }
        ],
        "tab": 1,
        "title": "日志查询",
        "transform": "json",
        "transparent": false,
        "type": "cwtable"
      },
      {
        "columns": [
          {
            "text": "count",
            "value": "count"
          },
          {
            "text": "message",
            "value": "message"
          },
        ],
        "operator": {
          "hide": false,
          "type": "expand"
        },
        "datasource": "elk",
        "editable": true,
        "error": false,
        "fontSize": "100%",
        "height": "500",
        "helpInfo": {
          "context": "",
          "info": false,
          "title": ""
        },
        "hideTimeOverride": false,
        "id": 2,
        "isNew": true,
        "links": [],
        "pageSize": null,
        "scroll": false,
        "showHeader": true,
        "sort": {
          "col": 0,
          "desc": true
        },
        "span": 12,
        "styles": [
          {
            "colorMode": null,
            "colors": [
              "rgba(245, 54, 54, 0.9)",
              "rgba(237, 129, 40, 0.89)",
              "rgba(50, 172, 45, 0.97)"
            ],
            "decimals": 0,
            "pattern": "/.*/",
            "thresholds": [],
            "type": "number",
            "unit": "short"
          },
          {
            "type": "html",
            "pattern": "/.*/"
          },
        ],
        "targets": [
          {
            "aggregator": "sum",
            "bucketAggs": [],
            "downsampleAggregator": "avg",
            "dsType": "elasticsearch",
            "errors": {},
            "metrics": [
              {
                "field": "select field",
                "id": 21,
                "meta": {},
                "settings": {},
                "type": "raw_document"
              }
            ],
            "query": "$QUERY",
            "refId": "A",
            "timeField": "@timestamp",
            "size": "$SIZE"
          }
        ],
        "title": "聚合数据",
        "transform": "json",
        "transparent": false,
        "type": "cwtable",
        "tab": 2,
        "operate": "logReduce",
        "scopedVars": {
          "logCluster": true
        }
      },
      {
        "columns": [
          {
            "text": "count",
            "value": "count"
          },
          {
            "text": "change",
            "value": "change"
          },
          {
            "text": "message",
            "value": "message"
          }
        ],
        "operator": {
          "hide": true,
          "type": ""
        },
        "datasource": "elk",
        "editable": true,
        "error": false,
        "fontSize": "100%",
        "helpInfo": {
          "context": "",
          "info": false,
          "title": ""
        },
        "id": 3,
        "isNew": true,
        "links": [],
        "pageSize": null,
        "scroll": false,
        "showHeader": true,
        "sort": {
          "col": 0,
          "desc": true
        },
        "span": 12,
        "styles": [
          {
            "dateFormat": "YYYY-MM-DD HH:mm:ss,sss",
            "pattern": "Time",
            "type": "date"
          }
        ],
        "targets": [
          {
            "aggregator": "sum",
            "bucketAggs": [],
            "downsampleAggregator": "avg",
            "dsType": "elasticsearch",
            "errors": {},
            "metrics": [
              {
                "field": "select field",
                "id": 31,
                "meta": {},
                "settings": {},
                "type": "raw_document"
              }
            ],
            "query": "$QUERY",
            "refId": "A",
            "timeField": "@timestamp",
            "size": "$SIZE"
          },
          {
            "bucketAggs": [],
            "dsType": "elasticsearch",
            "metrics": [
              {
                "field": "select field",
                "id": 32,
                "meta": {},
                "settings": {},
                "type": "raw_document"
              }
            ],
            "query": "$QUERY",
            "refId": "B",
            "timeField": "@timestamp",
            "timeShift": "$TIMESHIFT",
            "size": "$SIZE"
          }
        ],
        "tab": 3,
        "operate": "logCompare",
        "title": "日志对比",
        "transform": "json",
        "type": "cwtable",
        "scopedVars": {
          "logCompare": true,
          "logFilter" : "$LOGFILTER"
        }
      },
      {
        "aliasColors": {},
        "bars": true,
        "datasource": "elk",
        "editable": true,
        "error": false,
        "fill": 1,
        "grid": {
          "leftLogBase": 1,
          "leftMax": null,
          "leftMin": null,
          "rightLogBase": 1,
          "rightMax": null,
          "rightMin": null,
          "threshold1": null,
          "threshold1Color": "rgba(216, 200, 27, 0.27)",
          "threshold2": null,
          "threshold2Color": "rgba(234, 112, 112, 0.22)"
        },
        "id": 4,
        "legend": {
          "avg": false,
          "current": false,
          "max": false,
          "min": false,
          "show": false,
          "total": false,
          "values": false
        },
        "lines": false,
        "linewidth": 2,
        "nullPointMode": "connected",
        "percentage": false,
        "pointradius": 5,
        "points": false,
        "renderer": "flot",
        "seriesOverrides": [],
        "span": 12,
        "stack": false,
        "steppedLine": false,
        "targets": [
          {
            "aggregator": "sum",
            "bucketAggs": [
              {
                "field": "@timestamp",
                "id": "2",
                "settings": {
                  "interval": "auto",
                  "min_doc_count": 0
                },
                "type": "date_histogram"
              }
            ],
            "downsampleAggregator": "avg",
            "dsType": "elasticsearch",
            "errors": {},
            "metric": "internal.alert.state",
            "metrics": [
              {
                "field": "select field",
                "id": "1",
                "type": "count"
              }
            ],
            "query": "$QUERY",
            "refId": "A",
            "timeField": "@timestamp"
          }
        ],
        "timeFrom": null,
        "timeShift": null,
        "title": "日志总数",
        "tooltip": {
          "shared": true,
          "value_type": "cumulative"
        },
        "transparent": true,
        "type": "graph",
        "x-axis": true,
        "y-axis": true,
        "y_formats": [
          "short",
          "short"
        ],
        "links": [],
        "helpInfo": {
          "info": false,
          "title": "",
          "context": ""
        }
      }
    ],
    "showTitle": false,
    "title": "",
    "id": 1,
    "active": true,
    "openfiled": true
  }
];

export default {
  rows: panelMetas,
  logResultPanel : panelMetas[0].panels[0],
  logClusterPanel: panelMetas[0].panels[1],
  logComparePanel: panelMetas[0].panels[2],
}

