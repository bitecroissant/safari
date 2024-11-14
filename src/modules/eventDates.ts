import { handleError } from "../lib/handleErrors"
import { notBlankStr, notEmptyObject } from "../lib/validators"

type EventDatesTypes = {
	id: number
	gmtCreate: string
	gmtModified: string
	isDeleted: number
	group: string
	eventName: string
	happenAt: string
}

// 获取所有时间日期
export async function listEventDates(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	const query = "SELECT * FROM EventDates ORDER BY `id` DESC";
	const { results } = await env.D1_DB_CONNECTION.prepare(query).all<EventDatesTypes>();
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

// 删除一行诗句
export async function deleteEventDates(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		const updateForm = await request.json<EventDatesTypes>()
		notEmptyObject(updateForm, "params could not null")
		const { id } = updateForm
		notBlankStr(id, "id could not be blank")
		const query = "SELECT * FROM EventDates WHERE `id` = ?";
		const { results: eventDates } = await env.D1_DB_CONNECTION.prepare(query).bind(id).all<EventDatesTypes>();
		notEmptyObject(eventDates, "not found event dates")

		const updateSql = "UPDATE EventDates SET isDeleted = 1 WHERE `id` = ?"
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

// 更新一个事件
export async function updateEventDate(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		const updateForm = await request.json<EventDatesTypes>()
		notEmptyObject(updateForm, "params could not null")
		const { id, group, eventName, happenAt, isDeleted } = updateForm
		notBlankStr(id, "id could not be blank")
		notBlankStr(group, "group could not be blank")
		notBlankStr(eventName, "eventName could not be blank")
		notBlankStr(happenAt, "happenAt could not be blank")
		
		const query = "SELECT * FROM EventDates WHERE `id` = ?";
		const { results: eventDates } = await env.D1_DB_CONNECTION.prepare(query).bind(id).all<EventDatesTypes>();
		notEmptyObject(eventDates, "not found event dates")

		const updateSql = "UPDATE EventDates SET isDeleted = ?, `group` = ? , eventName = ? , happenAt = ? WHERE `id` = ?"
		const params = [ isDeleted || 0, group, eventName, happenAt, id ]
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


// 录入一个事件日期
export async function createEventDate(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
	try {
		const createForm = await request.json<EventDatesTypes>()
		notEmptyObject(createForm, "params could not null")
		const { group, eventName, happenAt } = createForm
		notBlankStr(group, "group could not be blank")
		notBlankStr(eventName, "eventName could not be blank")
		notBlankStr(happenAt, "happenAt could not be blank")

		switch (group) {
			case "solar_term":
				// 不需要做操作
				break;
			default:
				// 其他分组, 需要根据 eventName 删除过往的所有数据
				const queryHistoryEventDates = "SELECT * FROM EventDates WHERE `isDeleted` = 0 AND `eventName` = ? AND `group` = ?"
				const { results: historyList } = await env.D1_DB_CONNECTION.prepare(queryHistoryEventDates).bind(eventName, group).run()
				if (historyList && historyList.length > 0) {
					const historyIdList = historyList.map(i => i.id)
					const deleteHistoryPlaceHolder = historyIdList.map(() => '?').join(', ')
					const deleteHistorySql = `UPDATE EventDates SET \`isDeleted\` = 1 WHERE id in (${deleteHistoryPlaceHolder})`
					await env.D1_DB_CONNECTION.prepare(deleteHistorySql).bind(...historyIdList).run()
				}
		}

		const insertSql = "INSERT INTO EventDates (isDeleted,`group`, eventName, happenAt) VALUES (0, ?, ?, ?)"
		const params = [group, eventName, happenAt]
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

