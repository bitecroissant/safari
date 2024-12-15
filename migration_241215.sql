DROP TABLE IF EXISTS EventDates;
CREATE TABLE IF NOT EXISTS EventDates (id INTEGER PRIMARY KEY, gmtCreate TEXT, gmtModified TEXT, isDeleted INTEGER, `group` TEXT, eventName TEXT, happenAt TEXT, iconName TEXT, iconColor TEXT, emojiIcon Text, datesStatus TEXT);
INSERT INTO EventDates (isDeleted, gmtCreate, gmtModified, `group`, eventName, happenAt, datesStatus) VALUES (0, '2024-12-07 14:59:08 032', '2024-12-07 14:59:08 032', '田', '拖地', '2024-12-07', 'active')
,(0, '2024-12-02 22:37:12 777', '2024-12-02 22:37:12 777', '陆', '陆陆理发', '2024-11-29', 'active')
,(0, '2024-11-29 12:55:29 041', '2024-12-07 14:59:07 413', '田', '拖地', '2024-11-28', 'invalid')
,(0, '2024-11-29 12:55:08 329', '2024-11-29 12:55:08 329', '瓜', '瓜瓜理发', '2024-11-29', 'active')
,(0, '2024-11-22 20:12:19 937', '2024-11-22 20:12:19 937', '田', '加猫砂', '2024-11-22', 'active')
,(0, '2024-11-22 09:16:49 912', '2024-11-22 09:16:49 912', '瓜', '瓜瓜换床单', '2024-11-21', 'active')
,(0, 'null', '2024-11-29 12:55:28 385', '田', '拖地', '2024-11-16', 'invalid')
,(0, 'null', 'null', '田', '去迪士尼', '2024-11-30', 'active')
,(0, 'null', 'null', '陆', '陆陆换床单', '2024-11-17', 'active')
,(0, 'null', '2024-12-02 22:37:12 108', '陆', '陆陆理发', '2024-11-04', 'invalid')
,(0, 'null', '2024-11-22 09:16:27 549', '瓜', '瓜瓜换床单', '2024-03-01', 'invalid')
,(0, 'null', 'null', '瓜', '瓜瓜换床单', '2024-02-01', 'invalid')
,(0, 'null', 'null', '瓜', '瓜瓜换床单', '2024-01-01', 'invalid')
,(0, 'null', '2024-11-29 12:55:07 665', '瓜', '瓜瓜理发', '2024-04-05', 'invalid')
,(0, 'null', 'null', 'solar_term', '大雪', '2024-12-06', 'active')
,(0, 'null', 'null', 'solar_term', '冬至', '2024-12-21', 'active')
,(0, 'null', 'null', 'solar_term', '小雪', '2024-11-22', 'active');
