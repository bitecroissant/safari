export const validationError = (msg: string) => {
    return new ValidationError(msg)
}

export class ValidationError extends Error {
    constructor(msg: string) {
        super(msg)
        this.name = "ValidationError"
    }
}