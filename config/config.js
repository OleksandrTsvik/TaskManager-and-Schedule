const MONGO_URL = "mongodb://localhost:27017/task-manager";

const PORT = 3001;
const URL = `http://localhost:${PORT}`;

const settingsKeys = {
    countDaysDisplayLastCompletedTasks: 'countDaysDisplayLastCompletedTasks',
    linkSchedule: 'linkSchedule',
    linkOptionalSubjects: 'linkOptionalSubjects',
    cabinetLogin: 'cabinetLogin',
    cabinetPassword: 'cabinetPassword',
    arrayGroups: 'arrGroups',
    arraySubjects: 'arrSubjects',
};

const encryptionKey = 'KFgGqtJyFL50vJpsCFOh9UBm4dxhc9XY';
const encryptionIV = 'Gw7fVhXY520ofTHw';
const encryptionAlgorithm = 'aes-256-cbc';

const encryptionFields = [
    settingsKeys.cabinetLogin,
    settingsKeys.cabinetPassword
];

const uaDayToNumber = {
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
    settingsKeys,
    encryptionKey, encryptionIV,
    encryptionAlgorithm,
    encryptionFields,
    uaDayToNumber
};
