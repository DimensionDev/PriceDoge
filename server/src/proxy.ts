import axios from "axios";
import * as Router from "koa-router";

const router = new Router({
    prefix: "/proxy",
});

export {
    router as ProxyRouter,
};

router.post("/", async (ctx, next) => {
    const { cookie, link } = ctx.request.body;

    const response = await axios.get(link, {
        headers: {
            Cookie: cookie,
        },
    });

    ctx.body = response.data;
});
