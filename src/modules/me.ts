import { jwtAuth } from "../lib/auth/jwtHelpers"

// 获取登录用户
export async function me(env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>, ctx: ExecutionContext) {
    try {
        const userToken = await jwtAuth(env, request)
        console.log('userToken')
        console.log(JSON.stringify(userToken))
        return new Response(JSON.stringify(userToken), {
            // return new Response(JSON.stringify({ jwt: jwtToken }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
            }
        });
    } catch (error) {
        return new Response('Invalid Token', { status: 401 });
    }
}