export function defaultResponse(): Response | PromiseLike<Response> {
	return new Response('Hello World!');
}


export const rejectMsgList = [
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

export function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function responseForbidden(): Response | PromiseLike<Response> {
    return new Response(rejectMsgList[getRandomInt(0, rejectMsgList.length)], { status: 403 });
}
