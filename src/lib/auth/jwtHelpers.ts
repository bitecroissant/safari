import { authError } from "../errors";
import { responseForbidden } from "../handleErrors";
import { notBlankStr, notEmptyArray } from "../validators";
import jwt from "@tsndr/cloudflare-worker-jwt"

export const getJwtSecret = async (env: Env) => {
    // find private secret
    const query = "SELECT * FROM UserTokens WHERE `isDeleted` = 0 AND `user` = 'jwt'";
    const { results: jwtTokenList } = await env.D1_DB_CONNECTION.prepare(query).all<UserTokens>();
    notEmptyArray(jwtTokenList, "Not jwt secrts from db.")
    const jwtSecret = jwtTokenList[0].token
    notBlankStr(jwtSecret, "Not jwt secrts str from db.")
    return jwtSecret
}

export const jwtAuth = async (env: Env, request: Request<unknown, IncomingRequestCfProperties<unknown>>) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw authError("🤢 Get away!")
    const token = authHeader.split(' ')[1];
    const jwtSecret = await getJwtSecret(env)
    const decodeResult = await jwt.verify<UserTokens>(token, jwtSecret);
    if (!decodeResult || !decodeResult.payload) {
        throw authError("🤢 Get away!")
    }
    return decodeResult.payload
}