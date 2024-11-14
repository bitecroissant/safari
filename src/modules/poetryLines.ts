import { ValidationError } from "../lib/errors"
import { handleError } from "../lib/handleErrors"
import { time } from "../lib/time"
import { notEmptyObject } from "../lib/validators"

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

// 指定一行诗句出现时间、恢复一个删除的诗句、修改诗句的详细信息
export async function updatePoetryLine(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const createForm = await request.json<PoetryLinesType>()
	// const { line, author, dynasty, title, show_date } = createForm
	// const insertSql = "INSERT INTO PoetryLines (isDeleted, line, author, dynasty, title, show_date) VALUES (0, ?, ?, ?, ?, ?)"
	// const params = [ line, author, dynasty, title, show_date ]
	// const result = await env.D1_DB_CONNECTION.prepare(insertSql).bind(...params).run()

	return new Response(JSON.stringify({}), {
		status: 201, // Created
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

// 获取所有诗句
export async function listPoetryLines(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const query = "SELECT * FROM PoetryLines ORDER BY `id` DESC";
	const { results } = await env.D1_DB_CONNECTION.prepare(query).all<PoetryLinesType>();
	console.log('results')
	console.log(JSON.stringify(results))

	return new Response(JSON.stringify(results), {
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

// 录入一行诗句
export async function createPoetryLine(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const createForm = await request.json<PoetryLinesType>()
	try {
		notEmptyObject(createForm, "params could not null")
		const { line, author, dynasty, title, show_date } = createForm
		const insertSql = "INSERT INTO PoetryLines (isDeleted, line, author, dynasty, title, show_date) VALUES (0, ?, ?, ?, ?, ?)"
		const params = [line, author, dynasty, title, show_date]
		const result = await env.D1_DB_CONNECTION.prepare(insertSql).bind(...params).run()

		return new Response(JSON.stringify({ result }), {
			status: 201, // Created
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Access-Control-Allow-Origin': '*',
				// 允许的HTTP方法
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				// 允许的HTTP头部
				'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
			}
		});
	} catch (error: unknown) {
		return handleError(error)
	}
}

// 随机读取一行诗句
export async function getPoetryLine(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const today = time()
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


