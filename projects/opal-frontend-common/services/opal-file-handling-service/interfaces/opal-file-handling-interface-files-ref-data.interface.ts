import { IOpalFileHandlingInterfaceFile } from './opal-file-handling-interface-file.interface';

export interface IOpalFileHandlingInterfaceFilesRefData {
  number_of_results: number;
  interface_files: IOpalFileHandlingInterfaceFile[] | null;
}
