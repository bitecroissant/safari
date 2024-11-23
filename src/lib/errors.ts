export const validationError = (msg: string) => {
    return new ValidationError(msg)
}

export class ValidationError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = "ValidationError"
    }
}

export const authError = (msg: string) => {
    return new AuthError(msg)
}

export class AuthError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = "AuthError"
    }
}