export function defaultResponse(): Response | PromiseLike<Response> {
	return new Response('🥐 You\'re lost.');
}

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Debug helpers
 */
export function pjson(key: string, val: object) {
	console.log(`🥳 我将打印复杂对象 (${key})`)
	console.log(JSON.stringify(val))
}