export const HTTP_RETRYABLE_STATUS_CODES: readonly number[] = Object.freeze([0, 408, 502, 503, 504]);
export const HTTP_NON_RETRYABLE_STATUS_CODES: readonly number[] = Object.freeze([400, 401, 403, 404, 409, 422]);
