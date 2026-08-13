@cds.persistence.exists
entity Users {
  key id : UUID;
  username : String(100);
  email : String(100);
  full_name : String(100);
  role : String(50);
  department : String(100);
  is_active : Boolean;
  password : String(100);
}

@cds.persistence.exists
entity Systems {
  key id : UUID;
  name : String(100);
  description : String(255);
}

@cds.persistence.exists
entity Roles {
  key id : UUID;
  system_id : UUID;
  name : String(100);
  description : String(255);
  access_type : String(50);
}

@cds.persistence.exists
entity Requests {
  key id : UUID;
  request_number : String(50);
  requester_username : String(100);
  requester_persona : String(100);
  target_system : String(150);
  role_name : String(150);
  business_sector : String(150);
  business_function : String(150);
  service_topic : String(150);
  selected_persona : String(150);
  access_type : String(50);
  operating_region : String(100);
  access_duration : String(100);
  justification : String;
  status : String(50);
  created_at : Timestamp;
  updated_at : Timestamp;
  submission_timestamp : Timestamp;
}

@cds.persistence.exists
entity RoleConflicts {
  key id : UUID;
  role_id : UUID;
  conflicting_role_id : UUID;
  conflict_reason : String;
  severity : String(50);
  created_at : Timestamp;
}

