export interface IOpalFileHandlingInterfaceFileParams {
  source?: string | null;
  target?: string | null;
  not_target?: string | null;
  type?: string[] | null;
  domain?: string | null;
  status?: string | null;
  not_status?: string[] | null;
  business_unit_code?: string | null;
  from_date?: string | null;
  to_date?: string | null;
}
