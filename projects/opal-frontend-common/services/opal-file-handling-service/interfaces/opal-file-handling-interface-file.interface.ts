export interface IOpalFileHandlingInterfaceFile {
  interface_file_id: number | null;
  source: string | null;
  target: string | null;
  type: string | null;
  domain: string | null;
  status: string | null;
  business_unit_codes: string[] | null;
  filestore_uuid: string | null;
  checksum: string | null;
  created_datetime: string | null;
  file_name: string | null;
  errors: string | null;
}
