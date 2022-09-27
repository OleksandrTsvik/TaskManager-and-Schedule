const MONGO_URL = "mongodb://localhost:27017/task-manager";

const PORT = 3001;
const URL = `http://localhost:${PORT}`;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

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

const ENCRYPTION_KEY = 'KFgGqtJyFL50vJpsCFOh9UBm4dxhc9XY';
const ENCRYPTION_IV = 'Gw7fVhXY520ofTHw';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';

const ENCRYPTION_FIELDS = [
    SETTINGS_KEYS.cabinetLogin,
    SETTINGS_KEYS.cabinetPassword
];

const UA_DAY_TO_NUMBER = {
    ['Понеділок']: 1,
    ['Вівторок']: 2,
    ['Середа']: 3,
    ['Четвер']: 4,
    ['П\'ятниця']: 5,
    ['П&#39;ятниця']: 5,
    ['Субота']: 6,
    ['Неділя']: 7
};

module.exports = {
    MONGO_URL, PORT, URL,
    SETTINGS_KEYS,
    ENCRYPTION_KEY, ENCRYPTION_IV, ENCRYPTION_ALGORITHM, ENCRYPTION_FIELDS,
    UA_DAY_TO_NUMBER,
    MS_PER_DAY
};
