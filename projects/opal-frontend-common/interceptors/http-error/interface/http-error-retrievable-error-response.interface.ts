export interface ErrorResponse {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  operation_id?: string;
  retriable?: boolean;
}
