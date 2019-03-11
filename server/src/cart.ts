import * as Router from "koa-router";
import JD from "./jd";
import { ICartResult, ISearchResult } from "./models";
import Taobao from "./taobao";

const router = new Router({
    prefix: "/cart",
});

export {
    router as CartRouter,
};

router.post("/sync", async (ctx, next) => {
    const { token, cookie, jdCookie }: { token: string, cookie: any, jdCookie: any } = ctx.request.body;
    const jdCookieStr = jdCookie.map((value: any) => value.name + "=" + value.value).join(";");
    const taobaoCookieStr = cookie.map((value: any) => value.name + "=" + value.value).join(";");
    const cookieResult = await Promise.all([JD.validateCookie(jdCookie), Taobao.validateCookie(cookie)]);
    if (!cookieResult.every((it) => it)) {
        ctx.body = {
            code: 10000 + cookieResult.indexOf(false) + 1,
        };
        return;
    }
    const cartItems = await Promise.all([JD.getCart(jdCookieStr), Taobao.getCart(taobaoCookieStr, token)]);
    const jdCart = cartItems[0];
    const taobaoCart = cartItems[1];
    const searchResult = await Promise.all([
        search(jdCart, (title) => Taobao.search(title, cookie)),
        search(taobaoCart, JD.search),
    ]);
    const taobaoSearch = searchResult[0];
    const jdSearch = searchResult[1];
    await Promise.all([
        JD.addCart(jdCookie, jdSearch.map((it) => ({link: it.url, count: 1}))),
        Taobao.addCart(cookie, taobaoSearch.map((it) => ({link: it.url, count: 1}))),
    ]);
    ctx.body = {
        code: 0,
    };
});

async function search(cart: ICartResult[], func: (title: string) => Promise<ISearchResult[]>)
    : Promise<ISearchResult[]> {
    const items: ISearchResult[] = [];
    for await (const item of cart) {
        const result = await func(item.title);
        if (result.length > 1) {
            items.push(result[0]);
        }
    }
    return items;
}

router.post("/price", async (ctx, next) => {
    const { token, cookie, jdCookie }: { token: string, cookie: any, jdCookie: any } = ctx.request.body;
    const jdCookieStr = jdCookie.map((value: any) => value.name + "=" + value.value).join(";");
    const taobaoCookieStr = cookie.map((value: any) => value.name + "=" + value.value).join(";");
    const cookieResult = await Promise.all([JD.validateCookie(jdCookie), Taobao.validateCookie(cookie)]);
    if (!cookieResult.every((it) => it)) {
        const code = 10000 + cookieResult.indexOf(false) + 1;
        ctx.body = {
            code,
        };
        return;
    }
    const cartItems = await Promise.all([JD.getCart(jdCookieStr), Taobao.getCart(taobaoCookieStr, token)]);
    const jdCart = cartItems[0];
    const taobaoCart = cartItems[1];
    const searchResult = await Promise.all([
        search(jdCart, (title) => Taobao.search(title, cookie)),
        search(taobaoCart, JD.search),
    ]);
    const taobaoSearch = searchResult[0];
    const jdSearch = searchResult[1];
    let taobaoPrice = taobaoCart.map((it) => it.price.value / 100).reduce((prev, curr) => prev + curr);
    if (taobaoSearch.length > 0) {
        taobaoPrice += taobaoSearch.map((it) => it.price).reduce((prev, curr) => prev + curr);
    }
    let jdPrice = jdCart.map((it) => it.price.value / 100).reduce((prev, curr) => prev + curr);
    if (jdSearch.length > 0) {
        jdPrice += jdSearch.map((it) => it.price).reduce((prev, curr) => prev + curr);
    }

    ctx.body = {
        code: 0,
        data: {
            jdCart,
            jdPrice,
            jdSearch,
            taobaoCart,
            taobaoPrice,
            taobaoSearch,
        },
    };
});
