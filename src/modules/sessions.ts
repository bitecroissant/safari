

import { getJwtSecret } from "../lib/auth/jwtHelpers"
import { handleError } from "../lib/handleErrors"
import { notEmptyArray, notBlankStr, notEmptyObject } from "../lib/validators"
import jwt from "@tsndr/cloudflare-worker-jwt"

type CreateSessionRequest = {
    token: string
}

// Signin
export async function createSessions(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
    try {
        const createForm = await request.json<CreateSessionRequest>()
        notEmptyObject(createForm, "params could not null")
        const { token: requestToken } = createForm
        notBlankStr(requestToken, "requestToken could not be blank")

        // verify token
        const queryUserToken = "SELECT * FROM UserTokens WHERE `isDeleted` = 0 AND `token` = ? AND `user` != 'jwt'";
        const { results: userTokenList } = await env.D1_DB_CONNECTION.prepare(queryUserToken).bind(requestToken).all<UserTokens>();
        notEmptyArray(userTokenList, "🤢 Get away!")
        const userToken = userTokenList[0]
        
        const jwtSecret = await getJwtSecret(env)
        const jwtToken = await jwt.sign({ user: userToken.user }, jwtSecret)

        return new Response(JSON.stringify({ jwt: jwtToken }), {
        // return new Response(JSON.stringify({ jwt: jwtToken }), {
            status: 201, 
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
            }
        });
    } catch (error: unknown) {
        return handleError(error)
    }
}
