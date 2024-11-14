export function defaultResponse(): Response | PromiseLike<Response> {
	return new Response('Hello World!');
}

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
