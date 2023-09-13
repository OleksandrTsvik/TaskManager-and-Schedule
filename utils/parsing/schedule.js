const puppeteer = require('puppeteer');

const { SETTINGS_KEYS } = require('../../config/config');
const { getSettingsValueByKey } = require('../settings');

async function getSchedule() {
    const scheduleUrl = await getSettingsValueByKey(SETTINGS_KEYS.linkSchedule);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(scheduleUrl, { waitUntil: "domcontentloaded" });

    const schedule = await page.evaluate(() => {
        const deleteWhitespace = (text) => {
            return text.trim().replace(/[\s\\n]{2,}/g, ' ');
        };

        const getSubjectsData = (elements, weekday, time) => {
            const subjects = [];

            for (const elem of elements) {
                if (elem.children.length < 4) {
                    continue;
                }

                subjects.push({
                    week,
                    weekday,
                    time,
                    subject: deleteWhitespace(elem.children[1].textContent),
                    teacher: deleteWhitespace(elem.children[3].textContent).split(/,\s*/).filter(str => str.trim().length > 0),
                    classRoom: deleteWhitespace(elem.children[2].textContent),
                    groups: deleteWhitespace(elem.children[0].textContent).split(/,\s*/).filter(str => str.trim().length > 0)
                });
            }

            return subjects;
        };

        let tables = document.querySelectorAll('table.schedule');

        let data = [];
        let week = 1;

        for (let table of tables) {
            for (let tr of table.querySelectorAll('tr:not(:first-of-type)')) {
                let time;
                let weekday = 1;

                let th = tr.querySelector('th');
                if (th) {
                    time = deleteWhitespace(th.textContent);
                }

                for (let cell of tr.querySelectorAll('td')) {
                    let arrVariative = cell.querySelectorAll('div.variative');

                    data.push(...getSubjectsData(arrVariative, weekday, time));

                    weekday++;
                }
            }

            week++;
        }

        return data;
    });

    // console.log(schedule);

    await browser.close();

    return schedule;
}

module.exports = getSchedule;