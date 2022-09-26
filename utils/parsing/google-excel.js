const axios = require('axios');
const xlsx = require('xlsx');

const { settingsKeys } = require('../../config/config');
const { getValueByKey } = require('../../config/settings');

async function getOptionalSubjects() {
    const fileURL = await getValueByKey(settingsKeys.linkOptionalSubjects);

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
        return {
            time: obj.B,
            subject: obj.C,
            teacher: obj.D,
            classForm: obj.E,
            weekday: obj.F,
            groups: obj.G
        };
    });

    return sheet01JSON;
}

module.exports = getOptionalSubjects;