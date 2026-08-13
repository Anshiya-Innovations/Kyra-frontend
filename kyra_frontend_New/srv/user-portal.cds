using { Users } from '../db/common';

service UserPortalService {
  entity Profile as projection on Users;
}
