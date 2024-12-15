const a = [
    {
        "id": 19,
        "gmtCreate": "2024-12-07 14:59:08 032",
        "gmtModified": "2024-12-07 14:59:08 032",
        "isDeleted": 0,
        "group": "田",
        "eventName": "拖地",
        "happenAt": "2024-12-07"
    },
    {
        "id": 18,
        "gmtCreate": "2024-12-02 22:37:12 777",
        "gmtModified": "2024-12-02 22:37:12 777",
        "isDeleted": 0,
        "group": "陆",
        "eventName": "陆陆理发",
        "happenAt": "2024-11-29"
    },
    {
        "id": 17,
        "gmtCreate": "2024-11-29 12:55:29 041",
        "gmtModified": "2024-12-07 14:59:07 413",
        "isDeleted": 1,
        "group": "田",
        "eventName": "拖地",
        "happenAt": "2024-11-28"
    },
    {
        "id": 16,
        "gmtCreate": "2024-11-29 12:55:08 329",
        "gmtModified": "2024-11-29 12:55:08 329",
        "isDeleted": 0,
        "group": "瓜",
        "eventName": "瓜瓜理发",
        "happenAt": "2024-11-29"
    },
    {
        "id": 15,
        "gmtCreate": "2024-11-22 20:12:19 937",
        "gmtModified": "2024-11-22 20:12:19 937",
        "isDeleted": 0,
        "group": "田",
        "eventName": "加猫砂",
        "happenAt": "2024-11-22"
    },
    {
        "id": 14,
        "gmtCreate": "2024-11-22 09:16:49 912",
        "gmtModified": "2024-11-22 09:16:49 912",
        "isDeleted": 0,
        "group": "瓜",
        "eventName": "瓜瓜换床单",
        "happenAt": "2024-11-21"
    },
    {
        "id": 13,
        "gmtCreate": null,
        "gmtModified": "2024-11-29 12:55:28 385",
        "isDeleted": 1,
        "group": "田",
        "eventName": "拖地",
        "happenAt": "2024-11-16"
    },
    {
        "id": 12,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 0,
        "group": "田",
        "eventName": "去迪士尼",
        "happenAt": "2024-11-30"
    },
    {
        "id": 11,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 0,
        "group": "陆",
        "eventName": "陆陆换床单",
        "happenAt": "2024-11-17"
    },
    {
        "id": 10,
        "gmtCreate": null,
        "gmtModified": "2024-12-02 22:37:12 108",
        "isDeleted": 1,
        "group": "陆",
        "eventName": "陆陆理发",
        "happenAt": "2024-11-04"
    },
    {
        "id": 9,
        "gmtCreate": null,
        "gmtModified": "2024-11-22 09:16:27 549",
        "isDeleted": 1,
        "group": "瓜",
        "eventName": "瓜瓜换床单",
        "happenAt": "2024-03-01"
    },
    {
        "id": 8,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 1,
        "group": "瓜",
        "eventName": "瓜瓜换床单",
        "happenAt": "2024-02-01"
    },
    {
        "id": 7,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 1,
        "group": "瓜",
        "eventName": "瓜瓜换床单",
        "happenAt": "2024-01-01"
    },
    {
        "id": 6,
        "gmtCreate": null,
        "gmtModified": "2024-11-29 12:55:07 665",
        "isDeleted": 1,
        "group": "瓜",
        "eventName": "瓜瓜理发",
        "happenAt": "2024-04-05"
    },
    {
        "id": 5,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 0,
        "group": "solar_term",
        "eventName": "大雪",
        "happenAt": "2024-12-06"
    },
    {
        "id": 4,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 0,
        "group": "solar_term",
        "eventName": "冬至",
        "happenAt": "2024-12-21"
    },
    {
        "id": 3,
        "gmtCreate": null,
        "gmtModified": null,
        "isDeleted": 0,
        "group": "solar_term",
        "eventName": "小雪",
        "happenAt": "2024-11-22"
    }
]
a.forEach(item => {
    const s = `,(0, '${item.gmtCreate}', '${item.gmtModified}', '${item.group}', '${item.eventName}', '${item.happenAt}', '${item.isDeleted === 0 ? 'active': 'invalid'}')`
    console.log(s)
})