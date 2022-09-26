const puppeteer = require('puppeteer');

const { settingsKeys } = require('../../config/config');
const { getValueByKey } = require('../../config/settings');

async function getSchedule() {
    const scheduleUrl = await getValueByKey(settingsKeys.linkSchedule);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(scheduleUrl, { waitUntil: "domcontentloaded" });

    const schedule = await page.evaluate(() => {
        const deleteWhitespace = (text) => {
            return text.trim().replace(/[\s\\n]{2,}/g, ' ');
        };

        let tables = document.querySelectorAll('table.schedule');
        let data = [];

        for (let table of tables) {
            for (let tr of table.querySelectorAll('tr:not(:first-of-type)')) {
                let trData = [];

                for (let cell of tr.querySelectorAll('th, td')) {
                    let variative = cell.querySelector('div.variative');

                    if (cell.tagName === 'TH') {
                        trData.push({
                            time: deleteWhitespace(cell.textContent),
                        });
                    } else if (variative && variative.children.length >= 4) {
                        trData.push({
                            groups: deleteWhitespace(variative.children[0].textContent),
                            subject: deleteWhitespace(variative.children[1].textContent),
                            classRoom: deleteWhitespace(variative.children[2].textContent),
                            teacher: deleteWhitespace(variative.children[3].textContent),
                        });
                    } else {
                        trData.push({});
                    }
                }

                data.push(trData);
            }
        }

        return data;
    });

    console.log(schedule);

    await browser.close();

    return schedule;
}

module.exports = getSchedule;