type EventDatesType = {
	happenAt: string
	eventName: string
}
type SolarTermType = {
	name: string
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const parsedUrl = new URL(request.url);
		const path = parsedUrl.pathname;

		switch (path) {
			case '/solarTerms/next':
				const today = new Date();
				const query = "SELECT * FROM EventDates WHERE `isDeleted` = 0 AND type = 'solar_term' "
				const { results } = await env.D1_DB_CONNECTION.prepare(query).all<EventDatesType>()
				const filteredEventDates = results.filter(e => new Date(e.happenAt) >= today)
				filteredEventDates.sort((a, b) => new Date(a.happenAt) as any - (new Date(b.happenAt) as any))
				const closestEventDate = filteredEventDates[0];
				const daysBetween = Math.ceil((new Date(closestEventDate.happenAt) as any - (today as any)) / (1000 * 60 * 60 * 24));

				const querySolarTerm = "SELECT * FROM SolarTerms WHERE name = ? "
				const { results: solarTerms } = await env.D1_DB_CONNECTION.prepare(querySolarTerm).bind(closestEventDate.eventName).all<SolarTermType>()
				const solarTerm = solarTerms[0]
				return new Response(JSON.stringify({ ...closestEventDate, daysBetween, solarTerm }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
			default:
				return new Response('Hello World!');
		}
	},
} satisfies ExportedHandler<Env>;
