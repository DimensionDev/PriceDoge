import contentHandler from "./contentHandler";
import CommodityHandler from "./contentHandler/commodity/CommodityHandler";
import CustomHandler from "./contentHandler/commodity/CustomHandler";
import IContentHandler from "./contentHandler/IContentHandler";
import Message from "./utils/messaging";

let handlers: IContentHandler[] = [];

function findHadler() {
    handlers = contentHandler.filter((it) => it.canHandle(location.href));
    Promise.all([...handlers.map((it) => it.handle())]).then(async () => {
        if (!handlers.some((it) => it instanceof CommodityHandler)) {
            const handler = new CustomHandler();
            if (await handler.hasPriceInfo()) {
                handler.handle();
                handlers.push(handler);
            }
        }
    });
    Message.on("updateComodityHandlersIfNeeded", () => {
        tryAddCustomHandler();
        return true;
    });
}

async function tryAddCustomHandler() {
    if (!handlers.some((it) => it instanceof CommodityHandler)) {
        const handler = new CustomHandler();
        handler.handle();
        handlers.push(handler);
    }
}

// if (document.readyState === "complete") {
//     // run on firefox
//     findHadler();
// } else {
//     // run on chrome
//     window.addEventListener("load", findHadler);
// }
findHadler();
// tslint:disable-next-line:no-console
console.log("running");
addEventListener("unhandledrejection", (err) => console.error(err));
