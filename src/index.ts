import { defaultResponse, responseForbidden } from "./lib/helpers";
import { Time, time } from "./lib/time";
import { getPoetryLine } from "./modules/poetryLines";
import { getNextSolarTerms } from "./modules/solarTerms";

const DOMAIN = "gualand.cc"

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// // 如果需要跨域控制 推送前打开下面注释
		// const origin = request.headers.get('Origin')
		// console.log(origin)
		// if (!origin || !origin.endsWith(DOMAIN)) {
		// 	return responseForbidden()
		// }

		const parsedUrl = new URL(request.url);
		const path = parsedUrl.pathname;

		const method = request.method

		switch (path) {
			// 获取下一个节气信息，目前主要是 iphone 快捷方式在用
			case '/solar_terms/next':
				return await getNextSolarTerms(env, request, ctx);
			case '/poetry_lines':
				if (method === 'GET') {
					// 获取所有诗句
					return await getPoetryLine(env, request, ctx);
				}
				break
			case '/poetry_line':
				if (method === 'GET') {
					// 随机读取一行诗句
					return await getPoetryLine(env, request, ctx);
				} else if (method === 'POST') {
					// 录入一行诗句
					return await getNextSolarTerms(env, request, ctx);
				} else if (method === 'PATCH') {
					// 指定一行诗句出现时间
					return await getNextSolarTerms(env, request, ctx);
				} else if (method === 'DELETE') {
					// 删除一行诗句
					return await getNextSolarTerms(env, request, ctx);
				}
				break
			case '/event_dates':
				if (method === 'GET') {
					// 获取所有生效的事件日期
					return await getPoetryLine(env, request, ctx);
				}
				break
			case '/event_date':
				if (method === 'POST') {
					// 录入一个事件日期
					return await getNextSolarTerms(env, request, ctx);
				} else if (method === 'PATCH') {
					// 更新一个事件日期
					return await getNextSolarTerms(env, request, ctx);
				} else if (method === 'DELETE') {
					// 删除一个事件日期
					return await getNextSolarTerms(env, request, ctx);
				}
				break
			default:
				return defaultResponse()
		}
		return defaultResponse();
	},
} satisfies ExportedHandler<Env>;

