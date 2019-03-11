import Axios from "axios";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import { CartRouter } from "./cart";
import { ProxyRouter } from "./proxy";
import { SearchRouter } from "./search";

const app = new Koa();

app.use(bodyParser());
if (process.env.NODE_ENV !== "production") {
    // logger
    app.use(async (ctx, next) => {
        // tslint:disable-next-line:no-console
        console.log(`${ctx.request.method} ${ctx.request.url}`);
        // tslint:disable-next-line:no-console
        console.log(ctx.request.body);
        await next();
        // tslint:disable-next-line:no-console
        console.log(JSON.stringify(ctx.body));
    });
    Axios.interceptors.request.use((config) => {
        // tslint:disable-next-line:no-console
        console.log(config.url);
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    Axios.interceptors.response.use((response) => {
        // tslint:disable-next-line:no-console
        console.log(response.data);
        return response;
    }, (error) => {
        return Promise.reject(error);
    });
}

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
        ctx.body = {
            code: 10500,
            message: `${error}`,
        };
    }
});

const apiRouter = new Router({
    prefix: "/api",
});

apiRouter.use(SearchRouter.routes(), SearchRouter.allowedMethods());
apiRouter.use(CartRouter.routes(), CartRouter.allowedMethods());

app.use(ProxyRouter.routes());
app.use(ProxyRouter.allowedMethods());
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

app.listen(80);

// tslint:disable-next-line:no-console
console.log("now listening");
