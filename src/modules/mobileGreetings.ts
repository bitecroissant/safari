import { handleError } from "../lib/handleErrors";
import { time } from "../lib/time";
import { PoetryLinesType } from "./poetryLines";
import { EventDatesTypes } from "./eventDates";
import { EventDatesType, SolarTermType } from "./solarTerms";
import { notEmptyArray, notEmptyObject } from "../lib/validators";

export async function greetings(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
  try {
    const result = await querySelectedDates(env, request, ctx)
    const dailyQueryResult = {
      severTime: time().format('yyyy-MM-dd HH:mm:ss fff'),
      ...result,
    }

    return new Response(JSON.stringify(dailyQueryResult), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        // 允许的HTTP方法
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        // 允许的HTTP头部
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
      }
    });
  } catch (err) { return handleError(err) }
}

const querySelectedDates = async (env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) => {
  try {
    const result = {
      '今日一句': '',
      '陆陆理发': 0,
      '瓜瓜理发': 0,
      '瓜瓜换床单': 0,
      '陆陆换床单': 0,
      '拖地': 0,
      '下一个节气': 0,
      '节气名': '',
      '节气英文名': '',
      '节气含义': '',
      '节气气象表现': '',
      '节气相关诗句': '',
      '节气风俗习惯': '',
      '节气美食': '',
      '节气补充说明': '',
    }

    const todayFormattedStr = time().format()
    // get poetry line
    let poetryLine: PoetryLinesType
    const lineQuery = "SELECT * FROM PoetryLines WHERE `isDeleted` = 0 AND `showDate` = ?";
    const { results: lineResult } = await env.D1_DB_CONNECTION.prepare(lineQuery).bind(todayFormattedStr).all<PoetryLinesType>();
    if (lineResult && lineResult.length > 0) {
      poetryLine = lineResult[0]
      if (lineResult.length > 0) {
        const filterCreatorItemList = lineResult.filter(items => items.createBy === 'lu')
        if (filterCreatorItemList && filterCreatorItemList.length > 0) {
          poetryLine = filterCreatorItemList[0]
        }
      }
    } else {
      const secondQuery = "SELECT * FROM PoetryLines WHERE `isDeleted` = 0 AND `showDate` = '' ORDER BY `id` DESC";
      const { results: secondResults } = await env.D1_DB_CONNECTION.prepare(secondQuery).all<PoetryLinesType>();
      poetryLine = secondResults[0]
      // 反向更新
      if (poetryLine) {
        const { id, line, author, dynasty, title, showDate, isDeleted } = poetryLine
        const updateSql = "UPDATE PoetryLines SET gmtModified = ?, showDate = ? WHERE `id` = ?"
        const params = [time().format('yyyy-MM-dd HH:mm:ss fff'), todayFormattedStr, id]
        await env.D1_DB_CONNECTION.prepare(updateSql).bind(...params).run()
      }
    }
    result['今日一句'] = poetryLine.line

    // get next solar term
    const startOfToday = time().removeTime()
    const startOfYesterday = time().add(-1, 'day').removeTime()

    const solarTermsQuery = "SELECT * FROM EventDates WHERE `isDeleted` = 0 AND `group` = 'solar_term' AND `happenAt` >= ? ";
    const { results: solarTermsResults } = await env.D1_DB_CONNECTION.prepare(solarTermsQuery).bind(startOfYesterday.format()).all<EventDatesType>();
  
    notEmptyArray(solarTermsResults, '没有节气了，快去配置')
    const filteredEventDates = solarTermsResults.filter(e => time(e.happenAt).notBefore(startOfToday.date));
    // const filteredEventDates = results
    filteredEventDates.sort((a, b) => time(a.happenAt).timestamp - time(b.happenAt).timestamp);
    const closestEventDate = filteredEventDates[0];
    const daysBetween = time(closestEventDate.happenAt).calcNaturalDaysBetween(startOfToday);

    const querySolarTerm = "SELECT * FROM SolarTerms WHERE `key` = ? ";
    const { results: solarTerms } = await env.D1_DB_CONNECTION.prepare(querySolarTerm).bind(closestEventDate.eventName).all<SolarTermType>();
    notEmptyArray(solarTerms, '配的节气名字不对！' + closestEventDate.eventName)
    const solarTerm = solarTerms[0];
    notEmptyObject(solarTerm, '配的节气名字不对！' + closestEventDate.eventName)
    // Hack
    closestEventDate.eventName = solarTerm.name
    result['下一个节气'] = daysBetween
    result['节气名'] = solarTerm.name
    result['节气英文名'] = solarTerm.enName
    result['节气含义'] = solarTerm.meaning
    result['节气气象表现'] = solarTerm.meteorologicalChanges
    result['节气相关诗句'] = solarTerm.relatedVerses
    result['节气风俗习惯'] = solarTerm.custom
    result['节气美食'] = solarTerm.recommendedFoods
    result['节气补充说明'] = solarTerm.addition

    // event_dates
    const eventsQuery = "SELECT * FROM EventDates WHERE `isDeleted` = 0 AND `group` != 'solar_term' AND `datesStatus` = 'active' ORDER BY `id` DESC";
    const { results: eventsResults } = await env.D1_DB_CONNECTION.prepare(eventsQuery).all<EventDatesTypes>();
    console.log('JSON.stringify(eventsResults)')
    console.log(JSON.stringify(eventsResults))

    for (const event of eventsResults) {
      const { eventName } = event
      if (eventName === '陆陆理发') {
        result['陆陆理发'] = startOfToday.calcNaturalDaysBetween(time(event.happenAt))
      } else if (eventName === '陆陆换床单') {
        result['陆陆换床单'] = startOfToday.calcNaturalDaysBetween(time(event.happenAt))
      } else if (eventName === '瓜瓜理发') {
        result['瓜瓜理发'] = startOfToday.calcNaturalDaysBetween(time(event.happenAt))
      } else if (eventName === '瓜瓜换床单') {
        result['瓜瓜换床单'] = startOfToday.calcNaturalDaysBetween(time(event.happenAt))
      } else if (eventName === '拖地') {
        result['拖地'] = startOfToday.calcNaturalDaysBetween(time(event.happenAt))
      }
    }


    return result
  } catch (err) { throw err }
}
