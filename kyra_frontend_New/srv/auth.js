import cds from '@sap/cds';

export default async function() {
  this.on('login', async (req) => {
    const { username, password, role } = req.data;

    // Query the PostgreSQL Kyra database for the user credentials matching username
    const user = await SELECT.one.from('Users').where({ username: username });

    if (!user) {
      return req.error(400, 'The username is invalid.');
    }

    if (user.password !== password) {
      return req.error(400, 'The password is invalid.');
    }

    // Map selection to expected database roles
    let expectedDbRole = '';
    if (role === 'Requester') {
      expectedDbRole = 'REQUESTER';
    } else if (role === 'Compliance Reviewer') {
      expectedDbRole = 'ADMIN';
    } else if (role === 'Approver') {
      expectedDbRole = 'APPROVER';
    }

    // Enforce role check against the database role column
    if (user.role !== expectedDbRole) {
      return req.error(400, 'Invalid role selected for this user.');
    }

    return {
      success: true,
      message: `Welcome back, ${user.full_name}!`,
      userId: username,
      userUuid: user.id,
      role: role
    };
  });

  // Validate requested roles for restricted classification and conflicts
  this.on('validateAccessRequest', async (req) => {
    const { userId, roleIds } = req.data;
    if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
      return {
        hasConflict: false,
        requiresApproval: false,
        summary: []
      };
    }

    const db = await cds.connect.to('db');

    // 1. Fetch details of all requested roles along with system names
    const rolePlaceholders = roleIds.map((_, i) => `$${i + 1}::uuid`).join(', ');
    const rolesQuery = `
      SELECT r.id as role_id, r.name as role_name, r.access_type, s.name as system_name
      FROM access_management.roles r
      LEFT JOIN access_management.systems s ON r.system_id = s.id
      WHERE r.id IN (${rolePlaceholders})
    `;
    const rolesRes = await db.run(rolesQuery, roleIds);
    const rolesList = rolesRes || [];

    // 2. Fetch active assigned roles for the user if userId provided
    let activeRoleIds = [];
    if (userId) {
      const userRolesRes = await db.run(
        `SELECT role_id FROM access_management.user_roles WHERE user_id = $1::uuid AND (status = 'ACTIVE' OR status IS NULL)`,
        [userId]
      );
      if (userRolesRes) {
        activeRoleIds = userRolesRes.map(ur => ur.role_id);
      }
    }

    // 3. Fetch conflict rules involving requested roles
    const allRelevantRoleIds = [...new Set([...roleIds, ...activeRoleIds])];
    const conflictPlaceholders = allRelevantRoleIds.map((_, i) => `$${i + 1}::uuid`).join(', ');
    const conflictsRes = await db.run(
      `SELECT role_id, conflicting_role_id, conflict_reason, severity 
       FROM access_management.role_conflicts 
       WHERE role_id IN (${conflictPlaceholders}) OR conflicting_role_id IN (${conflictPlaceholders})`,
      allRelevantRoleIds
    );
    const conflictRules = conflictsRes || [];

    let overallHasConflict = false;
    let overallRequiresApproval = false;

    const summary = rolesList.map(r => {
      const isRestricted = (r.access_type === 'RESTRICTED');
      if (isRestricted) {
        overallRequiresApproval = true;
      }

      // Check conflicts
      const matchingConflict = conflictRules.find(c => 
        (c.role_id === r.role_id && allRelevantRoleIds.includes(c.conflicting_role_id)) ||
        (c.conflicting_role_id === r.role_id && allRelevantRoleIds.includes(c.role_id))
      );

      let isConflict = false;
      let conflictReason = '';
      let severity = '';

      if (matchingConflict) {
        isConflict = true;
        overallHasConflict = true;
        overallRequiresApproval = true;
        conflictReason = matchingConflict.conflict_reason;
        severity = matchingConflict.severity || 'CRITICAL';
      }

      return {
        roleId: r.role_id,
        roleName: r.role_name,
        systemName: r.system_name || 'N/A',
        accessType: r.access_type || 'DEFAULT',
        isConflict: isConflict,
        conflictReason: conflictReason,
        severity: severity
      };
    });

    return {
      hasConflict: overallHasConflict,
      requiresApproval: overallRequiresApproval,
      summary: summary
    };
  });


  // Persist new access requests into access_management.requests PostgreSQL table (Preventing duplicate pending requests)
  this.on('submitAccessRequest', async (req) => {
    const { requests } = req.data;
    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return req.error(400, 'No request payloads provided.');
    }

    const db = await cds.connect.to('db');
    let insertedCount = 0;
    let skippedCount = 0;

    for (const r of requests) {
      const sUser = r.requesterUsername || 'Dev001';
      const sSys = r.targetSystem || 'SAP BTP Cloud Platform';
      const sRole = r.roleName || 'IT Developers';

      // Guarantee request number is unique in the database
      let sReqNumber = r.requestNumber || `REQ-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      let bExists = true;
      let iAttempts = 0;
      while (bExists && iAttempts < 15) {
        const existing = await SELECT.one.from('Requests').where({ request_number: sReqNumber });
        if (existing) {
          sReqNumber = `REQ-2026-${Math.floor(100000 + Math.random() * 900000)}`;
          iAttempts++;
        } else {
          bExists = false;
        }
      }

      const id = cds.utils.uuid();
      const now = new Date().toISOString();

      await db.run(
        `INSERT INTO access_management.requests (
          id, request_number, submission_timestamp, requester_username, requester_persona,
          business_sector, business_function, operating_region, target_system,
          service_topic, role_name, selected_persona, access_type, access_duration,
          justification, status, created_at, updated_at
        ) VALUES (
          $1::uuid, $2, $3::timestamptz, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13, $14,
          $15, 'PENDING', $3::timestamptz, $3::timestamptz
        )`,
        [
          id,
          sReqNumber,
          now,
          sUser,
          r.requesterPersona || 'Requester',
          r.businessSector || 'Information Technology & Security',
          r.businessFunction || 'Identity & Access Governance',
          r.operatingRegion || 'Global Enterprise (ALL)',
          sSys,
          r.serviceTopic || 'System Administrator',
          sRole,
          r.selectedPersona || 'Engineering & Developer Persona',
          r.accessType || 'DEFAULT',
          r.accessDuration || 'Permanent (Default)',
          r.justification || 'Access Request'
        ]
      );
      insertedCount++;
    }

    return {
      success: true,
      message: `${insertedCount} access request(s) successfully persisted into access_management.requests PostgreSQL table.`,
      count: insertedCount
    };
  });

  this.on('submitAccessDecision', async (req) => {
    const { requestNumber, decisions } = req.data;
    if (!decisions || !Array.isArray(decisions)) {
      return req.error(400, 'Invalid decisions array.');
    }

    const db = await cds.connect.to('db');
    let updatedCount = 0;

    // Determine approver UUID from request context or fallback
    let approverUuid = 'e1f148e2-235b-4171-aa31-e8b7d4c1235b'; // default Stake001 (APPROVER)
    if (req.user && req.user.id !== 'anonymous') {
      const dbUser = await SELECT.one.from('Users').where({ username: req.user.id });
      if (dbUser) {
        approverUuid = dbUser.id;
      }
    }

    for (const d of decisions) {
      const sReqNum = d.requestNumber || requestNumber;
      const sSys = d.targetSystem;
      const sRole = d.roleName;
      const sPersona = d.selectedPersona;
      const sStatus = (d.status || 'APPROVED').toUpperCase();

      // 1. Update status in requests table
      await db.run(
        `UPDATE access_management.requests
         SET status = $1, updated_at = NOW()
         WHERE request_number = $2
           AND target_system = $3
           AND role_name = $4`,
        [sStatus, sReqNum, sSys, sRole]
      );

      // 2. Fetch full request details to capture relationships
      const requestRow = await SELECT.one.from('Requests').where({
        request_number: sReqNum,
        target_system: sSys,
        role_name: sRole
      });

      if (requestRow) {
        // 3. Log detailed approval decision in approvals table
        const approvalId = cds.utils.uuid();
        await db.run(
          `INSERT INTO access_management.approvals (
            id, request_id, approver_id, action, comments, created_at
          ) VALUES (
            $1::uuid, $2::uuid, $3::uuid, $4, $5, NOW()
          )`,
          [approvalId, requestRow.id, approverUuid, sStatus, `Entitlement ${sStatus} by Approver`]
        );

        // 4. Log event in audit_logs table
        const auditLogId = cds.utils.uuid();
        const sAction = sStatus === 'APPROVED' ? 'REQUEST_APPROVED' : 'REQUEST_REJECTED';
        await db.run(
          `INSERT INTO access_management.audit_logs (
            id, action, performed_by, target_id, details, created_at
          ) VALUES (
            $1::uuid, $2, $3::uuid, $4::uuid, $5::jsonb, NOW()
          )`,
          [
            auditLogId,
            sAction,
            approverUuid,
            requestRow.id,
            JSON.stringify({
              request_number: sReqNum,
              target_system: sSys,
              role_name: sRole,
              selected_persona: sPersona,
              decision: sStatus,
              timestamp: new Date().toISOString()
            })
          ]
        );

        // 5. If approved, add role assignment to user_roles table
        if (sStatus === 'APPROVED') {
          const requesterUser = await SELECT.one.from('Users').where({ username: requestRow.requester_username });
          const sCleanRole = sRole.split('(')[0].trim();
          const roleRecord = await SELECT.one.from('Roles').where({ name: sCleanRole });
          if (requesterUser && roleRecord) {
            const userRoleId = cds.utils.uuid();
            let expiresAt = null;
            const duration = requestRow.access_duration || 'Permanent';
            if (duration.toLowerCase().includes('30')) {
              expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + 30);
            } else if (duration.toLowerCase().includes('90')) {
              expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + 90);
            }
            
            await db.run(
              `INSERT INTO access_management.user_roles (
                id, user_id, role_id, request_id, assigned_at, expires_at, status
              ) VALUES (
                $1::uuid, $2::uuid, $3::uuid, $4::uuid, NOW(), $5::timestamptz, 'ACTIVE'
              ) ON CONFLICT (user_id, role_id) DO UPDATE SET
                status = 'ACTIVE',
                expires_at = EXCLUDED.expires_at,
                assigned_at = NOW(),
                request_id = EXCLUDED.request_id`,
              [userRoleId, requesterUser.id, roleRecord.id, requestRow.id, expiresAt]
            );
          }
        }
      }

      updatedCount++;
    }

    return {
      success: true,
      message: `Successfully updated status and persisted decision details for ${updatedCount} entitlement(s) under batch request.`
    };
  });
}

