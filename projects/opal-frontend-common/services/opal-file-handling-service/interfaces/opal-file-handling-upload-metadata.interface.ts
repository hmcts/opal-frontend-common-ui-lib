export interface IOpalFileHandlingUploadMetadata {
  source: string;
  target: string;
  type: string;
  domain: string;
  file_name: string;
  should_pre_process_file?: boolean;
  related_interface_file_id?: number;
  payment_type?: string;
  business_unit_code?: string | null;
}
