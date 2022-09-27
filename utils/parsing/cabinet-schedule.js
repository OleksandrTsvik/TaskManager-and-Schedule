const puppeteer = require('puppeteer');

const { SETTINGS_KEYS } = require('../../config/config');
const { getSettingsValueByKey } = require('../settings');

async function getCabinetSchedule() {
    const loginCabinetUrl = await getSettingsValueByKey(SETTINGS_KEYS.linkLoginCabinet);
    const scheduleCabinetUrl = await getSettingsValueByKey(SETTINGS_KEYS.linkScheduleCabinet);

    const login = await getSettingsValueByKey(SETTINGS_KEYS.cabinetLogin);
    const password = await getSettingsValueByKey(SETTINGS_KEYS.cabinetPassword);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(loginCabinetUrl, { waitUntil: "domcontentloaded" });

    await page.$eval('#loginform-username', (elem, login) => {
        elem.value = login;
    }, login);

    await page.$eval('#loginform-password', (elem, password) => {
        elem.value = password;
    }, password);

    await page.click('#login-form button[type="submit"][name="login-button"]');

    await page.waitForNavigation();

    await page.goto(scheduleCabinetUrl, { waitUntil: "domcontentloaded" });

    const schedule = await page.$$eval('.pair', (elems) => {
        return elems.map(elem => ({
            time: elem.firstElementChild.children[0].textContent,
            subject: elem.firstElementChild.children[1].textContent,
            classRoom: elem.firstElementChild.children[2].textContent + ',ауд. ' + elem.firstElementChild.children[3].textContent,
            teacher: elem.firstElementChild.children[4].textContent,
            content: elem.lastElementChild.children[1].innerHTML,
        }));
    });

    await browser.close();

    return schedule;
}

module.exports = getCabinetSchedule;