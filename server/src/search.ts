import * as Router from "koa-router";
import JD from "./jd";
import Taobao from "./taobao";

const router = new Router({
    prefix: "/search",
});

export {
    router as SearchRouter,
};

router.post("/", async (ctx) => {
    const { q, provider, cookie }: { q: string, provider: string, cookie: { taobao: any, jd: any }} = ctx.request.body;
    if (provider === "jd") {
        ctx.body = await Taobao.search(q, cookie.taobao);
    } else if (provider === "tmall" || provider === "taobao") {
        ctx.body = await JD.search(q);
    } else {
        ctx.body = [];
    }
});

router.post("/taobao", async (ctx) => {
    const { q, cookie }: { q: string, cookie: any } = ctx.request.body;
    ctx.body = await Taobao.search(q, cookie);
});

router.get("/jd", async (ctx) => {
    const { q }: { q: string } = ctx.query;
    ctx.body = await JD.search(q);
});
