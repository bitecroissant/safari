
DROP TABLE IF EXISTS KnowledgeRecords;
CREATE TABLE IF NOT EXISTS KnowledgeRecords (id INTEGER PRIMARY KEY, gmtCreate TEXT, gmtModified TEXT, isDeleted INTEGER, `desc` TEXT, `name` TEXT, `relatedUrl` TEXT, addition TEXT, source TEXT);
INSERT INTO KnowledgeRecords (isDeleted, `desc`, `name`, relatedUrl, addition, source) VALUES (0, '文档', '阮一峰', 'https://www.ruanyifeng.com/blog/', '金融 & 互联网 & 作家', '阮一峰')
,(0, 'mac 环境初始化', 'sorrycc', 'https://sorrycc.com/mac/', '前端环境配置', 'sorrycc blog');