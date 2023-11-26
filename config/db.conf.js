const SETTINGS_KEYS = {
  countDaysDisplayLastCompletedTasks: 'countDaysDisplayLastCompletedTasks',
  linkSchedule: 'linkSchedule',
  linkOptionalSubjects: 'linkOptionalSubjects',
  linkLoginCabinet: 'linkLoginCabinet',
  linkScheduleCabinet: 'linkScheduleCabinet',
  cabinetLogin: 'cabinetLogin',
  cabinetPassword: 'cabinetPassword',
  arrayGroups: 'arrGroups',
  arraySubjects: 'arrSubjects',
  dateFirstWeekSchedule: 'dateFirstWeekSchedule',
};

const OPTIONAL_SETTINGS_KEYS = [SETTINGS_KEYS.linkOptionalSubjects];

const ENCRYPTION_FIELDS = [
  SETTINGS_KEYS.cabinetLogin,
  SETTINGS_KEYS.cabinetPassword,
];

module.exports = {
  SETTINGS_KEYS,
  OPTIONAL_SETTINGS_KEYS,
  ENCRYPTION_FIELDS,
};
