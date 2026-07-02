export interface IHttpRetryPolicy {
  retryCount: number;
  delayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
  retryableStatusCodes: readonly number[];
}

export type IHttpRetryPolicyOptions = Partial<IHttpRetryPolicy>;
