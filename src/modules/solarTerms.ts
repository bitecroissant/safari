import { time } from "../lib/time"

type EventDatesType = {
	happenAt: string
	eventName: string
}

type SolarTermType = {
	name: string
}

// 获取下一个节气信息，目前主要是 iphone 快捷方式在用
export async function getNextSolarTerms(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const today = time()
	today.removeTime()
	const query = "SELECT * FROM EventDates WHERE `isDeleted` = 0 AND `group` = 'solar_term' ";
	const { results } = await env.D1_DB_CONNECTION.prepare(query).all<EventDatesType>();
	const filteredEventDates = results.filter(e => time(e.happenAt).notBefore(today.date));
	filteredEventDates.sort((a, b) => time(a.happenAt).timestamp - time(b.happenAt).timestamp);
	const closestEventDate = filteredEventDates[0];
	const daysBetween = time(closestEventDate.happenAt).calcNaturalDaysBetween(today);

	const querySolarTerm = "SELECT * FROM SolarTerms WHERE name = ? ";
	const { results: solarTerms } = await env.D1_DB_CONNECTION.prepare(querySolarTerm).bind(closestEventDate.eventName).all<SolarTermType>();
	const solarTerm = solarTerms[0];
	return new Response(JSON.stringify({ ...closestEventDate, daysBetween, solarTerm }), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Access-Control-Allow-Origin': '*',
			// 允许的HTTP方法
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			// 允许的HTTP头部
			'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
		}
	});
}
