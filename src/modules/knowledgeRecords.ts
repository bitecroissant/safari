import { jwtAuth } from "../lib/auth/jwtHelpers"
import { handleError } from "../lib/handleErrors"
import { time } from "../lib/time"
import { notBlankStr, notEmptyObject } from "../lib/validators"

type KnowledgeRecords = {
	id: number
	gmtCreate: string
	gmtModified: string
	isDeleted: number
	desc: string
	name: string
	relatedUrl: string
	addition: string
	source: string
}

export async function deleteKnowledgeRecord(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		await jwtAuth(env, request)
		const url = new URL(request.url);
		const id = url.searchParams.get('id')
		notBlankStr(id, "id could not be blank")
		const query = "SELECT * FROM KnowledgeRecords WHERE `id` = ?";
		const { results: records } = await env.D1_DB_CONNECTION.prepare(query).bind(id).all<KnowledgeRecords>();
		notEmptyObject(records, "not found line")

		const kill = url.searchParams.get('kill')
		if (kill) {
			const updateSql = "DELETE FROM KnowledgeRecords WHERE `id` = ?"
			const params = [id]
			const result = await env.D1_DB_CONNECTION.prepare(updateSql).bind(...params).run()
			return new Response(JSON.stringify({ result }), {
				status: 200,
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

		const updateSql = "UPDATE KnowledgeRecords SET isDeleted = 1, gmtModified = ? WHERE `id` = ?"
		const params = [time().format('yyyy-MM-dd HH:mm:ss fff'), id]
		const result = await env.D1_DB_CONNECTION.prepare(updateSql).bind(...params).run()

		return new Response(JSON.stringify({ result }), {
			status: 200,
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

export async function updateKnowledgeRecord(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		await jwtAuth(env, request)
		const updateForm = await request.json<KnowledgeRecords>()
		notEmptyObject(updateForm, "params could not null")
		const { id, desc, name, relatedUrl, addition, source, isDeleted } = updateForm
		notBlankStr(id, "id could not be blank")
		notBlankStr(desc, "desc could not be blank")
		notBlankStr(name, "name could not be blank")
		notBlankStr(relatedUrl, "relatedUrl could not be blank")

		const query = "SELECT * FROM KnowledgeRecords WHERE `id` = ?";
		const { results: records } = await env.D1_DB_CONNECTION.prepare(query).bind(id).all<KnowledgeRecords>();
		notEmptyObject(records, "not found KnowledgeRecords")

		const updateSql = "UPDATE KnowledgeRecords SET gmtModified = ?, isDeleted = ?, desc = ? , name = ? , relatedUrl = ?, addition = ? , source = ? WHERE `id` = ?"
		const params = [time().format('yyyy-MM-dd HH:mm:ss fff'), isDeleted || 0, desc, name, relatedUrl, addition, source, id]
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

export async function listKnowledgeRecords(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		await jwtAuth(env, request)
		const query = "SELECT * FROM KnowledgeRecords ORDER BY `id` DESC";
		const { results } = await env.D1_DB_CONNECTION.prepare(query).all<KnowledgeRecords>();
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
	} catch (err) { return handleError(err) }
}

export async function createKnowledgeRecords(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		await jwtAuth(env, request)
		const createForm = await request.json<KnowledgeRecords>()
		notEmptyObject(createForm, "params could not null")
		const { id, desc, name, relatedUrl, addition, source, isDeleted } = createForm
		notBlankStr(desc, "desc could not be blank")
		notBlankStr(name, "name could not be blank")
		notBlankStr(relatedUrl, "relatedUrl could not be blank")

		const insertSql = "INSERT INTO KnowledgeRecords (gmtCreate, gmtModified, isDeleted, line, author, dynasty, title, showDate, createBy) VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?)"
		const params = [time().format('yyyy-MM-dd HH:mm:ss fff'), time().format('yyyy-MM-dd HH:mm:ss fff'), desc, name, relatedUrl, addition, source]
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
