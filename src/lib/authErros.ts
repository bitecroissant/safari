import { validationError, ValidationError } from "./errors"

export const notEmptyObject = (params: any, msg: string) => {
    if (params !== null && params !== undefined && Object.entries(params).length > 0) {
        return
    }
    throw validationError(msg)
}

export const notBlankStr = (str: any, msg: string) => {
    if (str !== null && str !== undefined && typeof str === 'string' && str !== '') {
        return
    }
    throw validationError(msg)
}

export const notEmptyArray = (arr: any, msg: string) => {
    if (Array.isArray(arr) && arr.length > 0) {
        return
    }
    throw validationError(msg)
}