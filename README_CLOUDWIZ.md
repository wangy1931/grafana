## Update tables Features

### 免费用户限制
- 免费用户拥有30天试用期，过时不能登录
- 创建org_permit表
- 初始化org_permit表
```sql
set @dt = now();
INSERT INTO org_permit (`org_id`, `data_center`, `level`, `deadline`) SELECT id, 'ucloud', 'free', date_add(@dt, interval 30 day) FROM org;
```

### DataSource update
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
