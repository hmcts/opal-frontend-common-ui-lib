import { IOpalFileHandlingPaths } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';

const baseURL = '/opal-file-handling-service/';
const interfaceFilesPath = 'interface-files';
const interfaceFilesPathById = 'interface-files/{id}';
const interfaceFilesContentPath = 'interface-files/{id}/content';

export const OPAL_FILE_HANDLING_PATHS: IOpalFileHandlingPaths = {
  interfaceFile: `${baseURL}${interfaceFilesPathById}`,
  interfaceFilesRefData: `${baseURL}${interfaceFilesPath}`,
  interfaceFilesContent: `${baseURL}${interfaceFilesContentPath}`,
};
