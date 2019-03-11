import Axios from "axios";
import * as iconv from "iconv-lite";
import { Browser } from "puppeteer";
import { createBrowser, createMobilePage, createPage } from "./browser";
import { ICartResult, ISearchResult } from "./models";
import { titleFilter } from "./titleFilter";
import { addDays } from "./utils";

const Taobao = {
    addCart,
    getCart,
    search,
    validateCookie,
};

export default Taobao;

// Array.prototype.flatMap = function(lambda) {
//     return Array.prototype.concat.apply([], this.map(lambda));
// };

function getLink(dateString: string, token: string, time: number): string {
    return `https://cart.taobao.com/json/
    asyncGetMyCart.do?isNext=true&endTime=${dateString}&page=1&_thwlang=zh_CN&_tb_token_=${token}&_ksTS=${time}`;
}

async function getCart(cookie: string, token: string): Promise<ICartResult[]> {
    let items = [];
    const time = Date.now();
    const m = addDays(new Date(), 3);
    let dateString =
        m.getUTCFullYear() + "-" +
        ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);
    while (true) {
        const response = await Axios.get(getLink(encodeURIComponent(dateString), token, time), {
            headers: {
                Cookie: cookie,
                Referer: "https://cart.taobao.com/my_cart.htm",
            },
            responseType: "arraybuffer",
        });
        const data = JSON.parse(iconv.decode(response.data, "gb2312"));
        if (data.list === null || data.list === undefined || data.list.length === 0) {
            break;
        }
        dateString = data.globalData.startTime;
        items.push(...data.list);
    }
    items = items
        .filter((it) => it.sellerId === "725677994")
        .flatMap((it) => it.bundles)
        .flatMap((it) => it.orders)
        .map((it) => {
            return {
                amount: {
                    data: it.amount,
                    value: it.amount.now,
                },
                price: {
                    data: it.price,
                    value: it.price.sum,
                },
                title: it.title,
            };
        });
    return items;
}

async function addCart(cookie: any, items: Array<{ link: string, count: number }>) {
    const browser = await createBrowser();
    const page = await browser.newPage();
    await page.setCookie(...cookie);
    for await (const item of items) {
        const link = item.link;
        const count = item.count;
        const isTamll = `${link}`.includes("tmall.com");
        const buttonSelector = isTamll ? "#J_LinkBasket" : ".J_LinkAdd";
        const sureSelector = isTamll ? ".tb-note-title" : "#J_SureSKU";
        const amountSelector = isTamll ? "#J_Amount input" : "#J_IptAmount";
        const sureContinueSelector = isTamll ? "#J_LinkBasket" : "#J_SureContinue";
        const closeSureSelector = isTamll ? ".J_PanelCloser" : ".J_Close";
        await page.goto(link, { waitUntil: "networkidle2" });
        await page.$eval(amountSelector, (it: any, value) => it.value = value, count);
        const addButton = await page.$(buttonSelector);
        if (addButton == null) {
            continue;
        }
        const canAdd = await page.evaluate((selector) => {
            const button = document.querySelector(selector);
            if (getComputedStyle(button).cursor === "default") {
                return false;
            }
            return true;
        }, buttonSelector);
        if (!canAdd) {
            continue;
        }
        await addButton.click();
        const needSelectSku = await page.evaluate((selector) => {
            const sure = document.querySelector(selector);
            if (sure && getComputedStyle(sure).display !== "none") {
                return true;
            }
            return false;
        }, sureSelector);
        if (needSelectSku) {
            const close = await page.$(closeSureSelector);
            await close.click();
            const skus = await page.$$(".J_TSaleProp");
            if (skus != null && await clickSku(skus, 0) && addButton != null) {
                await addButton.click();
                await page.waitForNavigation({
                    waitUntil: "networkidle2",
                });
            }
        } else {
            if (isTamll) {
                await page.waitForResponse((res) => {
                    return res.url().includes("fbuy.tmall.com");
                });
            } else {
                await page.waitForNavigation({
                    waitUntil: "networkidle2",
                });
            }
        }
    }
    await page.close();
    await browser.close();
}

async function clickSku(skus: any, index: number): Promise<boolean> {
    const sku = skus[index];
    const selection = await sku.$("li:not(.tb-out-of-stock)");
    if (selection == null) {
        return false;
    } else {
        await selection.click();
        if (index < skus.length - 1) {
            return clickSku(skus, index + 1);
        } else {
            return true;
        }
    }
}

async function searchFromMobile(title: string, browser: Browser, cookie: any): Promise<ISearchResult[]> {
    const page = await createMobilePage(browser);
    const targetUrl = `https://s.m.taobao.com/h5?q=${encodeURIComponent(title)}`;
    await page.setCookie(...cookie);
    await page.goto(targetUrl, {
        waitUntil: "networkidle2",
    });
    const result = await page.evaluate(() => {
        function getTobaoId(url: string): string {
            return url;
            // if (url.includes("tmall.com")) {
            //     return url.match(/id=(\d+)/)[1];
            // } else if (url.includes("taobao.com")) {
            //     return url.match(/i(\d+)\./)[1];
            // }
            // return "";
        }

        function getTobaoUrl(url: string): string {
            return url;
            // const id = getTobaoId(url);
            // if (url.includes("tmall.com")) {
            //     return `https://detail.tmall.com/item.htm?id=${id}`;
            // } else if (url.includes("taobao.com")) {
            //     return `https://item.taobao.com/item.htm?id=${id}`;
            // }
            // return "";
        }

        return Array.from(document.querySelectorAll(".list-item"))
            .slice(0, 3)
            .map((element) => {
                return {
                    id: getTobaoId(element.querySelector("a").href),
                    img: element.querySelector<HTMLImageElement>(".p-pic").src,
                    name: element.querySelector(".d-title").textContent.trim(),
                    price: parseFloat(element.querySelector(".d-price > .h > .font-num").textContent.trim()),
                    url: getTobaoUrl(element.querySelector("a").href),
                };
            });
    });
    await page.close();
    return result;
}

async function searchFromWeb(title: string, browser: Browser, cookie: any): Promise<ISearchResult[]> {
    const page = await createPage(browser);
    await page.setViewport({
        height: 1080,
        width: 1920,
    });
    const targetUrl = `https://s.taobao.com/search?q=${encodeURIComponent(title)}`;
    await page.setCookie(...cookie);
    await page.goto(targetUrl, {
        waitUntil: "networkidle2",
    });
    const result = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".J_MouserOnverReq:not(.item-ad)"))
            .slice(0, 3)
            .map((element) => ({
                id: "", // TODO
                img: element.querySelector<HTMLImageElement>(".J_ItemPic").src,
                name: element.querySelector(".title").textContent.trim(),
                price: parseFloat(element.querySelector(".price strong").textContent.trim()),
                url: element.querySelector<HTMLLinkElement>(".pic-link").href,
            }));
    });
    await page.close();
    return result;
}

async function search(q: string, cookie: any): Promise<ISearchResult[]> {
    const title = titleFilter(q);
    const browser = await createBrowser();
    let result: ISearchResult[] = null;
    try {
        result = await searchFromMobile(title, browser, cookie);
        if (!result || result.length === 0) {
            result = await searchFromWeb(title, browser, cookie);
        }
    } catch (error) {
        result = await searchFromWeb(title, browser, cookie);
    }
    await browser.close();
    return result;
}

async function validateCookie(cookie: any): Promise<boolean> {
    const cookieStr = cookie.map((value: any) => value.name + "=" + value.value).join(";");
    const response = await Axios.get("https://cart.taobao.com/trail_mini_cart.htm", {
        headers: {
            Cookie: cookieStr,
        },
    });
    let data = `${response.data}`.trim();

    if (data.startsWith("(")) {
        data = data.substring(1);
    }
    if (data.endsWith(")")) {
        data = data.substring(0, data.length - 1);
    }

    const json = JSON.parse(data);
    return json.isLogin !== "false";
}
