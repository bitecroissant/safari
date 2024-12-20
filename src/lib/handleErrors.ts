import { AuthError, ValidationError } from "./errors";
import { getRandomInt } from "./helpers";

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

export const serverErrorMsgList = [
    "We're closed for a little 'me time'!",
    "Today, we’re just a ghost town!",
    "Taking a break to recharge our batteries!",
    "Our team is off on a secret mission!",
    "Out of order until further notice – just like my morning coffee!",
    "We're currently closed – please come back when we’re less 'socially distant'!",
    "The store is closed today, our staff are on a quest for the perfect slice of pizza!"
]

export const handleError = (err: unknown) => {
    if (err instanceof ValidationError) {
        return responseBadRequest((err as Error).message)
    }
    if (err instanceof AuthError) {
        return responseForbidden()
    }
    throw err;
    // return responseInternalServerError(serverErrorMsgList[getRandomInt(0, serverErrorMsgList.length - 1)])
}

export function responseInternalServerError(msg: string): Response | PromiseLike<Response> {
    return new Response(JSON.stringify({ msg }), { status: 500 });
}

export function responseBadRequest(msg: string): Response | PromiseLike<Response> {
    return new Response(JSON.stringify({ msg }), {
        status: 400,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            // 允许的HTTP方法
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            // 允许的HTTP头部
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
        }
    })
}

export function responseForbidden(): Response | PromiseLike<Response> {
    return new Response(JSON.stringify({ msg: '🔇 ' + rejectMsgList[getRandomInt(0, rejectMsgList.length - 1)] }), {
        status: 403,
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
