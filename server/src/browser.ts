import * as puppeteer from "puppeteer";
import * as devices from "puppeteer/DeviceDescriptors";
const iPhone = devices["iPhone X"];

async function createBrowser() {
    if (process.env.NODE_ENV === "production") {
        return await puppeteer.connect({ browserWSEndpoint: "ws://puppeteer:3000" });
    } else {
        return await puppeteer.launch();
    }
}

async function createPage(browser: puppeteer.Browser) {
    return await browser.newPage();
}

async function createMobilePage(browser: puppeteer.Browser) {
    const page = await createPage(browser);
    await page.emulate(iPhone);
    return page;
}

export {
    createBrowser,
    createMobilePage,
    createPage,
};
