import { IOpalFileHandlingInterfaceFile } from './opal-file-handling-interface-file.interface';

export interface IOpalFileHandlingInterfaceFilesRefData {
  count: number;
  interface_files: IOpalFileHandlingInterfaceFile[] | null;
}
