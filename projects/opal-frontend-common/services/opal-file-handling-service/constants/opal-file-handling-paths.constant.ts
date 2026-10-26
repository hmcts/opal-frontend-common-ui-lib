import { IOpalFileHandlingPaths } from '@hmcts/opal-frontend-common/services/opal-file-handling-service/interfaces';
import { OPAL_FILE_HANDLING_BASE_PATH } from './opal-file-handling-base-path.constant';
import { OPAL_FILE_HANDLING_FILE_ID_PATH_PARAM } from './opal-file-handling-file-id-path-param.constant';

export const OPAL_FILE_HANDLING_PATHS: IOpalFileHandlingPaths = {
  interfaceFile: `${OPAL_FILE_HANDLING_BASE_PATH}interface-files/${OPAL_FILE_HANDLING_FILE_ID_PATH_PARAM}`,
  interfaceFilesRefData: `${OPAL_FILE_HANDLING_BASE_PATH}interface-files`,
  interfaceFilesContent: `${OPAL_FILE_HANDLING_BASE_PATH}interface-files/${OPAL_FILE_HANDLING_FILE_ID_PATH_PARAM}/content`,
};
