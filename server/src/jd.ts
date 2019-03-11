import Axios from "axios";
import jsdom = require("jsdom");
import { ICartResult, ISearchResult } from "./models";
import { titleFilter } from "./titleFilter";
import { findAncestor } from "./utils";
const { JSDOM } = jsdom;

const JD = {
    addCart,
    getCart,
    search,
    validateCookie,
};

export default JD;

async function addCart(cookie: any, items: Array<{ link: string, count: number}>) {
    const cookieStr = cookie.map((value: any) => value.name + "=" + value.value).join(";");
    for await (const item of items) {
        const id = item.link.match("\\d+")[0];
        const count = item.count;
        await Axios.get(`https://cart.jd.com/gate.action?pid=${id}&pcount=${count}&ptype=1`, {
            headers: {
                Cookie: cookieStr,
            },
        });
    }
}

async function getCart(cookie: string): Promise<ICartResult[]> {
    const response = await Axios.get<string>("https://cart.jd.com/cart.action", {
        headers: {
            Cookie: cookie,
        },
    });
    const doc = new JSDOM(response.data).window.document;
    const items = Array.from(doc.querySelectorAll(".market-icon")).map((it) => {
        return findAncestor(it, "item-form");
    }).map((it) => {
        return {
            amount: {
                value: parseInt(it.querySelector(".quantity-form > .itxt").value, 10),
            },
            price: {
                data: {
                    now: parseInt(it
                        .querySelector(".plus-switch").textContent.match("\\d+\\.\\d+")[0].replace(".", ""), 10),
                    origin: parseInt(it
                        .querySelector(".plus-switch").textContent.match("\\d+\\.\\d+")[0].replace(".", ""), 10),
                    sum: parseInt(it
                        .querySelector(".cell > strong")
                        .textContent.trim().match("\\d+\\.\\d+")[0].replace(".", ""), 10),
                },
                value: parseInt(it
                    .querySelector(".cell > strong")
                    .textContent.trim().match("\\d+\\.\\d+")[0].replace(".", ""), 10),
            },
            title: it.querySelector(".p-name").textContent.trim(),
        };
    });
    return items;
}

async function search(q: string): Promise<ISearchResult[]> {
    const title = titleFilter(q);
    const response = await Axios.get<string>("https://so.m.jd.com/ware/search.action", {
        params: {
            keyword: title,
        },
    });
    const doc = new JSDOM(response.data).window.document;
    const result = Array.from(doc.querySelectorAll(".search_prolist_item"))
                        .slice(0, 3)
                        .map((element) => {
                            const item = {
                                id: "",
                                // id: element.querySelector(".search_prolist_item_inner")
                                //             .getAttribute("tourl").match(/sku=(\d+)/)[1],
                                img: element.querySelector<HTMLImageElement>(".search_prolist_cover img").src
                                            .replace("file://", "https://"),
                                name: element.querySelector(".search_prolist_title").textContent.trim(),
                                price: parseFloat(
                                    element.querySelector(".search_prolist_item_inner em").getAttribute("pri")),
                                url: "",
                                // url: element.querySelector(".search_prolist_item_inner").getAttribute("tourl"),
                            };
                            const skuid = element.getAttribute("skuid");
                            item.url = `https://item.jd.com/${skuid}.html`;
                            return item;
                        });
    return result;
}

async function validateCookie(cookie: any): Promise<boolean> {
    const cookieStr = cookie.map((value: any) => value.name + "=" + value.value).join(";");

    const response = await Axios.get("https://home.jd.com/getUserVerifyRight.action", {
        headers: {
            Cookie: cookieStr,
        },
    });
    return response.data.success || false;
}
