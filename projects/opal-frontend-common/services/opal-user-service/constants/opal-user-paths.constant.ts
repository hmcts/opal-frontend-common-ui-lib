import { IOpalUserPaths } from '@hmcts/opal-frontend-common/services/opal-user-service/interfaces';

const baseUrl = '/opal-user-service';
const users = '/users';
const currentUser = '/0';
const userState = '/state';

export const OPAL_USER_PATHS: IOpalUserPaths = {
  loggedInUserState: `${baseUrl}${users}${currentUser}${userState}`,
  addUser: `${baseUrl}${users}`,
  updateUser: `${baseUrl}${users}`,
};
