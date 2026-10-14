import { IOpalFileHandlingErrorObject } from './opal-file-handling-error-object.interface';

export interface IOpalFileHandlingInterfaceFile {
  file_id: number | null;
  source: string | null;
  target: string | null;
  type: string | null;
  domain: string | null;
  status: string | null;
  business_unit_code: string | null;
  file_store_uuid: string | null;
  checksum: string | null;
  date_and_time: string | null;
  file_name: string | null;
  errors: IOpalFileHandlingErrorObject[] | null;
}
