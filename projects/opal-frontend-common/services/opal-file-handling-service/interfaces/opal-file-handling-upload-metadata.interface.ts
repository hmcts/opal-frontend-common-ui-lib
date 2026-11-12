export interface IOpalFileHandlingUploadMetadata {
  source: string;
  target: string;
  type: string;
  domain: string;
  file_name: string;
  should_pre_process_file?: boolean;
  related_interface_file_id?: number;
  payment_type?: string;
  /** Only supplied for TRANSFORMED_JSON files. */
  business_unit_id?: number | null;
}
