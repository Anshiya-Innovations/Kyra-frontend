using { Users as _Users, Requests as _Requests, Roles as _Roles, Systems as _Systems, RoleConflicts as _RoleConflicts } from '../db/common';

type RoleSummaryItem {
  roleId : UUID;
  roleName : String;
  systemName : String;
  accessType : String; // 'DEFAULT' or 'RESTRICTED'
  isConflict : Boolean;
  conflictReason : String;
  severity : String;
}

type RequestPayload {
  requestNumber : String;
  requesterUsername : String;
  requesterPersona : String;
  targetSystem : String;
  roleName : String;
  businessSector : String;
  businessFunction : String;
  serviceTopic : String;
  selectedPersona : String;
  accessType : String;
  operatingRegion : String;
  accessDuration : String;
  justification : String;
}

service AuthService {
  action login(username: String, password: String, role: String) returns {
    success: Boolean;
    message: String;
    userId: String;
    userUuid: UUID;
    role: String;
  };

  action validateAccessRequest(userId: UUID, roleIds: array of UUID) returns {
    hasConflict: Boolean;
    requiresApproval: Boolean;
    summary: array of RoleSummaryItem;
  };

  action submitAccessDecision(
    requestNumber : String,
    decisions : array of {
      requestNumber : String;
      targetSystem : String;
      roleName : String;
      selectedPersona : String;
      status : String;
      comments : String;
    }
  ) returns {
    success : Boolean;
    message : String;
  };

  action submitAccessRequest(requests: array of RequestPayload) returns {
    success: Boolean;
    message: String;
    count: Integer;
  };

  @cds.persistence.name: 'users'
  entity Users as projection on _Users;

  @cds.persistence.name: 'requests'
  entity Requests as projection on _Requests;

  @cds.persistence.name: 'roles'
  entity Roles as projection on _Roles;

  @cds.persistence.name: 'systems'
  entity Systems as projection on _Systems;

  @cds.persistence.name: 'role_conflicts'
  entity RoleConflicts as projection on _RoleConflicts;
}
