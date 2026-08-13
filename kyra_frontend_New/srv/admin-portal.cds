using { Users } from '../db/common';

service AdminPortalService {
  entity UserManagement as projection on Users;
}
