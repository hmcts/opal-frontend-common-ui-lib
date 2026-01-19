export interface IErrorResponse {
  type: string | null;
  title: string | null;
  status: number | null;
  detail: string | null;
  instance: string | null;
  operation_id: string | null;
  retriable: boolean | null;
  conflictReason?: string;
}
