const rejectMsgList = [
	"Hit the road, Jack!",
	"Take a hike!",
	"Beat it!",
	"Scram!",
	"Get out of Dodge!",
	"Vamoose!",
	"Buzz off!",
	"Catch you later, alligator!",
	"Time to fly, bye-bye!",
	"See you in the funny papers!",
	"Don't let the door hit you on the way out!",
	"You're like a bad penny; I can't get rid of you!",
	"I think you've overstayed your welcome.",
	"Why don't you go and find someone else to bother?",
	"I'm about to turn into a pumpkin, so you'd better scram!",
]

const DOMAIN = "gualand.cc"

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

type EventDatesType = {
	happenAt: string
	eventName: string
}
type SolarTermType = {
	name: string
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const origin = request.headers.get('Origin')
		console.log(origin)
		if (!origin || !origin.endsWith(DOMAIN)) {
			return new Response(rejectMsgList[getRandomInt(0, rejectMsgList.length)], { status: 403 });
		}
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
			default:
				return new Response('Hello World!');
		}
	},
} satisfies ExportedHandler<Env>;
