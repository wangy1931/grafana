## Update tables Features

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
