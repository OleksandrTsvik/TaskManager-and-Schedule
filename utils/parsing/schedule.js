const puppeteer = require('puppeteer');

const { SETTINGS_KEYS } = require('../../config/config');
const { getValueByKey } = require('../settings');

async function getSchedule() {
    const scheduleUrl = await getValueByKey(SETTINGS_KEYS.linkSchedule);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(scheduleUrl, { waitUntil: "domcontentloaded" });

    const schedule = await page.evaluate(() => {
        const deleteWhitespace = (text) => {
            return text.trim().replace(/[\s\\n]{2,}/g, ' ');
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
                    let variative = cell.querySelector('div.variative');

                    if (variative && variative.children.length >= 4) {
                        data.push({
                            week,
                            weekday,
                            time,
                            subject: deleteWhitespace(variative.children[1].textContent),
                            teacher: deleteWhitespace(variative.children[3].textContent).split(/,\s*/).filter(str => str.trim().length > 0),
                            classRoom: deleteWhitespace(variative.children[2].textContent),
                            groups: deleteWhitespace(variative.children[0].textContent).split(/,\s*/).filter(str => str.trim().length > 0)
                        });
                    }

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