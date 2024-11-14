DROP TABLE IF EXISTS PoetryLines;
CREATE TABLE IF NOT EXISTS PoetryLines (id INTEGER PRIMARY KEY, gmtCreate TEXT, gmtModified TEXT, isDeleted INTEGER, line TEXT, author TEXT, dynasty TEXT, title TEXT, show_date TEXT);
INSERT INTO PoetryLines (isDeleted, line, author, dynasty, title, show_date) VALUES (0, '人间何所以，观风与月舒', '', '', '网文', '')
,(0, '冬宜密雪，有碎玉聲', '王禹偁 字 元之', '北宋', '黄冈竹楼记', '')
,(0, '人生海海，山山而川，不过尔尔', '麦家', '', '人生海海', '');