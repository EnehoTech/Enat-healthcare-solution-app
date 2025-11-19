// app roles
export const roles = {
  guest: 0,
  super_admin: 1,
  admin: 2,
  doctor: 3,
  nurse: 4,
  patient: 5,
};

// app role categories
export const superAdminOnly = [roles.super_admin];
export const drOnly = [roles.doctor];
export const nurseOnly = [roles.nurse];
export const patientOnly = [roles.patient];

export const drNurseOnly = [roles.doctor, roles.nurse];

export const drNursePatientOnly = [roles.doctor, roles.nurse, roles.patient];

export const adminAndAbove = [roles.super_admin, roles.admin];

export const drAndAbove = [roles.super_admin, roles.admin, roles.doctor];

export const nurseAndAbove = [
  roles.super_admin,
  roles.admin,
  roles.doctor,
  roles.nurse,
];
export const patientAndAbove = [
  roles.super_admin,
  roles.admin,
  roles.doctor,
  roles.nurse,
  roles.patient,
];

export const allRoles = Object.values(roles);
