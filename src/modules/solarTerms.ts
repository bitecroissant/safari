import { jwtAuth } from "../lib/auth/jwtHelpers"
import { validationError } from "../lib/errors"
import { handleError } from "../lib/handleErrors"
import { pjson } from "../lib/helpers"
import { time } from "../lib/time"
import { notEmptyArray, notEmptyObject } from "../lib/validators"

export type EventDatesType = {
	happenAt: string
	eventName: string
}

export type SolarTermType = {
	name: string
	key: string,
	enName: string,
	meteorologicalChanges: string,
	relatedVerses: string
	meaning: string
	custom: string
	recommendedFoods: string
	addition: string
}

// 获取下一个节气信息，目前主要是 iphone 快捷方式在用
export async function getNextSolarTerms(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		const today = time()
		today.removeTime()
		const yesterday = time().add(-1, 'day')
		yesterday.removeTime()
		const query = "SELECT * FROM EventDates WHERE `isDeleted` = 0 AND `group` = 'solar_term' AND `happenAt` >= ? ";
		const { results } = await env.D1_DB_CONNECTION.prepare(query).bind(yesterday.format()).all<EventDatesType>();
		notEmptyArray(results, '没有节气了，快去配置')
		const filteredEventDates = results.filter(e => time(e.happenAt).notBefore(today.date));
		// const filteredEventDates = results
		filteredEventDates.sort((a, b) => time(a.happenAt).timestamp - time(b.happenAt).timestamp);
		const closestEventDate = filteredEventDates[0];
		const daysBetween = time(closestEventDate.happenAt).calcNaturalDaysBetween(today);

		const querySolarTerm = "SELECT * FROM SolarTerms WHERE `key` = ? ";
		const { results: solarTerms } = await env.D1_DB_CONNECTION.prepare(querySolarTerm).bind(closestEventDate.eventName).all<SolarTermType>();
		notEmptyArray(solarTerms, '配的节气名字不对！' + closestEventDate.eventName)
		const solarTerm = solarTerms[0];
		notEmptyObject(solarTerm, '配的节气名字不对！' + closestEventDate.eventName)
		// Hack
		closestEventDate.eventName = solarTerm.name
		return new Response(JSON.stringify({ ...closestEventDate, daysBetween, solarTerm }), {
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				// 允许的HTTP方法
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				// 允许的HTTP头部
				'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
			}
		})
	} catch (err) {
		return handleError(err)
	}
}
