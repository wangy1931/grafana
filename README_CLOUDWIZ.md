## Update tables Features

## Cwiz Statics
data: 2018-02-26

- Deploy
1、请保证 /data/sql/cwiz_static.sql 为最新版本(公有云)
2、请保证 /data/sql/cwiz_static.sql 为相应版本(私有云)
3、更新mysql方法-添加下列语句至/data/sql/cwiz_static.sql:
```sql
INSERT INTO `cwiz_static` VALUES ('<id>', '<org_id/0>', '<type>', '<name>', '<json_data>', '<create_time>', '<update_time>'); 
```
4、请注意第16条语句不能加转义字符'/', 否则导入失败
5、请避免 json_data 中使用分隔符';', 若不可避免,请使用'@'代替, 并在前端逻辑中replace
6、直接从mysql中 dump+data 一般会失败, 请逐条INSERT

- Get Template

` GET /api/static/:type/:name`

**Example Request**:

  GET /api/static/report/report HTTP/1.1
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer eyJrIjoiT0tTcG1pUlY2RnVKZTFVaDFsNFZXdE9ZWmNrMkZYbk

**Example Response**:

  HTTP/1.1 200
  Content-Type: application/json
  
  {
    "Id": 70,
    "OrgId": 2,
    "Type": "report",
    "Name": "report",
    "JsonData": {
      "reports": [
        {
          "reportName": "报告20170314.pdf",
          "reportUrl": "Report20170314.pdf"
        }
      ]
    },
    "Created": "2018-02-11T12:03:30+08:00",
    "Updated": "2018-02-11T12:03:30+08:00"
  }

- Get Template List

` GET /api/admin/statics/`

**Example Request**:

  GET /api/admin/statics/ HTTP/1.1
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer eyJrIjoiT0tTcG1pUlY2RnVKZTFVaDFsNFZXdE9ZWmNrMkZYbk

**Example Response**:

  HTTP/1.1 200
  Content-Type: application/json

  [{
    "Id": 1,
    "OrgId": 0,
    "Type": "alertd",
    "Name": "hadoop.datanode"
  }]

- Get Template By Id

` GET /api/admin/static/:id`

**Example Request**:

  GET /api/admin/statics/1 HTTP/1.1
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer eyJrIjoiT0tTcG1pUlY2RnVKZTFVaDFsNFZXdE9ZWmNrMkZYbk

**Example Response**:

  HTTP/1.1 200
  Content-Type: application/json

  {
    "Id": 1,
    "OrgId": 0,
    "Type": "alertd",
    "Name": "hadoop.datanode",
    "JsonData": {
      "alertd": [
        {
          "alertDetails": {
            "cluster": "cluster1",
            "clusterwideAggregator": null,
            "crit": {
              "durarionMinutes": 10,
              "threshold": 20000000000
            },
            "hostQuery": {
              "expression": null,
              "metricQueries": [
                {
                  "aggregator": "AVG",
                  "metric": "hadoop.datanode.fsdatasetstate-null.DfsUsed",
                  "transform": null
                }
              ]
            },
            "hosts": null,
            "membership": "*",
            "monitoringScope": "HOST",
            "overrideHostQuery": null,
            "warn": {
              "durarionMinutes": 5,
              "threshold": 10000000000
            }
          },
          "creationTime": 1483658472835,
          "description": "Hadoop文件使用空间不要超过总空间的80% (具体临界值要设, 目前是20G)",
          "hash": 1264853798,
          "id": "2.1.aa5182e8-09dc-48e2-8cc9-30745cff9c11",
          "modificationTime": 1483658928273,
          "name": "Hadoop文件使用空间太大",
          "org": "2",
          "service": "1"
        }
      ]
    },
    "Created": "2018-02-09T15:57:22+08:00",
    "Updated": "2018-02-09T15:57:25+08:00"
  }

- Update Template

` POST /api/admin/static`

**Example Request**:

  GET /api/admin/static HTTP/1.1
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer eyJrIjoiT0tTcG1pUlY2RnVKZTFVaDFsNFZXdE9ZWmNrMkZYbk

**Example Response**:

  HTTP/1.1 200

  <*api.NormalResponse Value>

- Delete Template

`DELETE /api/admin/static/:id`

**Example Request**:

  DELETE /api/admin/statics/1 HTTP/1.1
  Accept: application/json
  Content-Type: application/json
  Authorization: Bearer eyJrIjoiT0tTcG1pUlY2RnVKZTFVaDFsNFZXdE9ZWmNrMkZYbk

**Example Response**:

  HTTP/1.1 200

  <*api.NormalResponse Value>

## Datasource add column 'intranet_url'
date: 2018-02-05

- 添加内网设置, 默认与url一致
```sql
UPDATE data_source SET intranet_url=url
```
- update datasource type
```sql
UPDATE data_source SET type='customdb' WHERE name='alert' OR name='download'
```
---
### 免费用户限制
date: 2018-01-21

- 免费用户拥有30天试用期，过时不能登录
- 创建org_permit表
- 初始化org_permit表
```sql
set @dt = now();
INSERT INTO org_permit (`org_id`, `data_center`, `level`, `deadline`) SELECT id, 'ucloud', 'free', date_add(@dt, interval 30 day) FROM org;
```
- 若测试创表失败,请检查migration_log,删除相应log,再重启grafana
```sql
DELETE FROM migration_log WHERE migration_log.migration_id = 'copy data account to org_permit';
DELETE FROM migration_log WHERE migration_log.migration_id = 'create index UQE_org_permit_org_id - v1';
DELETE FROM migration_log WHERE migration_log.migration_id = 'create org_permit table';
```

### DataSource update
date: 2018-01-21

- 新建用户数据源从default.ini获取，旧用户数据源从数据库获取
- 初始化data_source表,主要修改相应的url
```sql
INSERT INTO data_source ( `org_id`, `basic_auth`, `data_source`.`name`, `version`, `basic_auth_password`, `access`, `updated`, `with_credentials`, `url`, `type`, `created`, `is_default`)
SELECT id, '0', 'download', '0', '', 'direct', NOW(), '0', 'https://aws-download.cloudwiz.cn', 'download', NOW(), '0' FROM org;

INSERT INTO data_source ( `org_id`, `basic_auth`, `data_source`.`name`, `version`, `basic_auth_password`, `access`, `updated`, `with_credentials`, `url`, `type`, `created`, `is_default`)
SELECT id, '0', 'alert', '0', '', 'direct', NOW(), '0', 'https://aws-alert.cloudwiz.cn', 'alert', NOW(), '0' FROM org;


INSERT INTO data_source ( `org_id`, `json_data`, `basic_auth`, `data_source`.`name`, `version`, `basic_auth_password`, `access`, `updated`, `with_credentials`, `url`, `type`, `created`, `is_default`)
SELECT id, '{"tsdbResolution":1,"tsdbVersion":2}', '0', 'opentsdb', '0', '', 'proxy', NOW(), '0', 'https://tsdb.cloudwiz.cn', 'opentsdb', NOW(), '1' FROM org;

INSERT INTO data_source ( `org_id`, `json_data`, `database`, `basic_auth`, `data_source`.`name`, `version`, `basic_auth_password`, `access`, `updated`, `with_credentials`, `url`, `type`, `created`, `is_default`)
SELECT id, '{"interval":"Daily","timeField":"@timestamp"}', '[$_token-logstash-]YYYY.MM.DD', '0', 'elk', '0', '', 'proxy', NOW(), '0', 'https://aws-log.cloudwiz.cn', 'elasticsearch', NOW(), '0' FROM org;
```
