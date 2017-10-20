use `grafana`;

ALTER TABLE `grafana`.`api_key` ADD COLUMN `deleted` int(1) DEFAULT 0 AFTER `updated`;
ALTER TABLE `grafana`.`systems` ADD COLUMN `deleted` int(1) DEFAULT 0 AFTER `org_id`;