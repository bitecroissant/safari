import { handleError } from "../lib/handleErrors"
import { time } from "../lib/time"
import { notBlankStr, notEmptyObject } from "../lib/validators"

type PoetryLinesType = {
	id: number
	gmtCreate: string
	gmtModified: string
	isDeleted: number
	line: string
	author: string
	dynasty: string
	title: string
	showDate: string
	createBy: string
}

// 删除一行诗句
export async function deletePoetryLine(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get('id')
		notBlankStr(id, "id could not be blank")
		const query = "SELECT * FROM PoetryLines WHERE `id` = ?";
		const { results: lines } = await env.D1_DB_CONNECTION.prepare(query).bind(id).all<PoetryLinesType>();
		notEmptyObject(lines, "not found line")

		const updateSql = "UPDATE PoetryLines SET isDeleted = 1 WHERE `id` = ?"
		const params = [id]
		const result = await env.D1_DB_CONNECTION.prepare(updateSql).bind(...params).run()

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

// 指定一行诗句出现时间、恢复一个删除的诗句、修改诗句的详细信息
export async function updatePoetryLine(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		const updateForm = await request.json<PoetryLinesType>()
		notEmptyObject(updateForm, "params could not null")
		const { id, line, author, dynasty, title, showDate, isDeleted } = updateForm
		notBlankStr(id, "id could not be blank")
		notBlankStr(line, "line could not be blank")
		const query = "SELECT * FROM PoetryLines WHERE `id` = ?";
		const { results: lines } = await env.D1_DB_CONNECTION.prepare(query).bind(id).all<PoetryLinesType>();
		notEmptyObject(lines, "not found line")

		const updateSql = "UPDATE PoetryLines SET isDeleted = ?, line = ? , author = ? , dynasty = ?, title = ? , showDate = ? WHERE `id` = ?"
		const params = [isDeleted || 0, line, author, dynasty, title, showDate, id]
		const result = await env.D1_DB_CONNECTION.prepare(updateSql).bind(...params).run()

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

// 获取所有诗句
export async function listPoetryLines(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const query = "SELECT * FROM PoetryLines ORDER BY `id` DESC";
	const { results } = await env.D1_DB_CONNECTION.prepare(query).all<PoetryLinesType>();
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
	try {
		const createForm = await request.json<PoetryLinesType>()
		notEmptyObject(createForm, "params could not null")
		const { line, author, dynasty, title, showDate, createBy } = createForm
		notBlankStr(line, "line could not be blank")
		const insertSql = "INSERT INTO PoetryLines (isDeleted, line, author, dynasty, title, showDate, createBy) VALUES (0, ?, ?, ?, ?, ?, ?)"
		const params = [line, author, dynasty, title, showDate, createBy || 'gua']
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
	const query = "SELECT * FROM PoetryLines WHERE `isDeleted` = 0 AND `showDate` = ?";
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
