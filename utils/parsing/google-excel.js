const axios = require('axios');
const xlsx = require('xlsx');

const { SETTINGS_KEYS, UA_DAY_TO_NUMBER } = require('../../config/config');
const { getSettingsValueByKey } = require('../settings');
const { upperCaseFirst } = require('../upperCaseFirst');

async function getOptionalSubjects() {
    const fileURL = await getSettingsValueByKey(SETTINGS_KEYS.linkOptionalSubjects);

    const response = await axios({
        method: 'GET',
        url: fileURL,
        responseType: 'arraybuffer'
    });

    if (response.status !== 200) {
        console.log('STATUS CODE:', response.status);

        return null;
    }

    const workbook = xlsx.read(response.data);

    let sheet01 = workbook.Sheets[workbook.SheetNames[0]];
    let sheet01JSON = xlsx.utils.sheet_to_json(sheet01);

    sheet01JSON = sheet01JSON.filter(obj => Object.keys(obj).length >= 6);
    sheet01JSON = sheet01JSON.slice(1);

    // console.log(sheet01JSON[0]);

    sheet01JSON = sheet01JSON.map(obj => {
        let groups = [];
        if (obj.G) {
            groups = [obj.G.trim()];
        }

        return {
            week: 1,
            weekday: UA_DAY_TO_NUMBER[upperCaseFirst(obj.F)],
            time: obj.B,
            subject: obj.C,
            teacher: obj.D.split(/,\s*/).filter(str => str && str.trim().length > 0),
            classRoom: obj.E,
            groups,
            selective: true
        };
    });

    // console.log(sheet01JSON);

    return sheet01JSON;
}

module.exports = getOptionalSubjects;