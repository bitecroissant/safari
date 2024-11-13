import { time } from "../lib/time"

type PoetryLinesType = {
	id: number
	gmtCreate: string
	gmtModified: string
	isDeleted: number
	line: string
	author: string
	dynasty: string
	title: string
	show_date: string
}

// 随机读取一行诗句
export async function getPoetryLine(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const today = time('2000-1-1')
	const todayFormattedStr = today.format()
	let line: PoetryLinesType
	const query = "SELECT * FROM PoetryLines WHERE `isDeleted` = 0 AND `show_date` = ?";
	const { results } = await env.D1_DB_CONNECTION.prepare(query).bind(todayFormattedStr).all<PoetryLinesType>();
	if (results && results.length > 0) {
		line = results[0]
	} else {
		const secondQuery = "SELECT * FROM PoetryLines WHERE `isDeleted` = 0  ORDER BY `id` DESC";
		const { results: secondResults } = await env.D1_DB_CONNECTION.prepare(secondQuery).all<PoetryLinesType>();
		line = secondResults[0]
	}

	return new Response(JSON.stringify(line), {
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


