import { validationError, ValidationError } from "./errors"

export const notEmptyObject = (params: any, msg: string) => {
    if (params !== null && params !== undefined && Object.entries(params).length > 0) {
        return
    }
    throw validationError(msg)
}