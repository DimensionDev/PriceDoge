import IContent from "../../components/CompareContent/content";
import parsePrice from "../../components/CompareContent/price";
import Amazon from "../../services/amazon";
import JD from "../../services/jd";
import Neweggs from "../../services/neweggs";
import Taobao from "../../services/taobao";
import { getImage, getTextFormSelector } from "../../utils/dom";
import Message from "../../utils/messaging";
import { load, save } from "../../utils/storage";
import IContentHandler from "../IContentHandler";

export default abstract class CommodityHandler implements IContentHandler {
    protected abstract urls: string[];
    protected abstract targetTag: string;
    protected abstract priceType: string;
    protected searchProvider!: string;

    public canHandle(url: string): boolean {
        return this.urls.some((it) => url.includes(it));
    }

    public async handle(): Promise<void> {
        Message.on("addCustomTitleRule", (rule) => {
            this.addCustomTitleRule(rule);
            return true;
        });
        Message.on("addCustomImageRule", (rule) => {
            this.addCustomImageRule(rule);
            return true;
        });
        Message.on("addCustomPriceRule", (rule) => {
            this.addCustomPriceRule(rule);
            return true;
        });
        Message.on("refresh_current", (loadData) => {
            this.LoadCurrent(loadData);
            return true;
        });

        Message.on("priceDogeUpdateSearchProvider", (data) => {
            this.searchProvider = data;
            Message.send("refresh_current", true);
            return true;
        });

        const targetTag = this.targetTag;
        const priceType = this.priceType;
        await this.addScript(chrome.extension.getURL("static/js/compare.js"));
        Message.send("priceDogeInit", {
            priceType,
            targetTag,
        });
        const current = await this.LoadCurrent(true);
        window.onbeforeunload = () => {
            chrome.runtime.sendMessage({
                data: { data: current, url: location.href },
                type: "commodity_info",
            });
        };
    }
    protected abstract getCurrent(): IContent;

    protected async addCustomSelector(selector: string, name: string) {
        const key = `${this.constructor.name}${name}`;
        const existSelectors = await load<{ values: string[] }>(key);
        if (existSelectors && existSelectors.values) {
            if (!existSelectors.values.includes(selector)) {
                await save(key, { values: [...existSelectors.values, selector] });
            }
        } else {
            await save(key, { values: [selector] });
        }
        this.LoadCurrent(true);
    }

    protected async addCustomPriceRule(selector: string) {
        this.addCustomSelector(selector, "_custom_price_rule");
    }

    protected async addCustomTitleRule(selector: string) {
        this.addCustomSelector(selector, "_custom_title_rule");
    }

    protected async addCustomImageRule(selector: string) {
        this.addCustomSelector(selector, "_custom_image_rule");
    }

    protected getRules = async (name: string): Promise<string[]> => {
        const key = `${this.constructor.name}${name}`;
        const existSelectors = await load<{ values: string[] }>(key);
        if (existSelectors && existSelectors.values) {
            return existSelectors.values;
        }
        return [];
    };

    protected getImageFromCustomSelector = async (): Promise<string> => {
        for (const item of await this.getRules("_custom_image_rule")) {
            const src = getImage(document, item);
            if (src && src !== "") {
                return src;
            }
        }
        return "";
    };

    protected getTitleFromCustomSelector = async (): Promise<string> => {
        for (const item of await this.getRules("_custom_title_rule")) {
            const title = getTextFormSelector(document, item);
            if (title && title !== "") {
                return title;
            }
        }
        return "";
    };

    protected getPriceFromCustomSelector = async (): Promise<number> => {
        for (const item of await this.getRules("_custom_price_rule")) {
            const price = parsePrice(getTextFormSelector(document, item));
            if (!isNaN(price) && price !== -1) {
                return price;
            }
        }
        return -1;
    };

    protected async provideData(current: IContent): Promise<IContent[]> {
        if (!current.title) {
            return [];
        }
        switch (this.searchProvider) {
            case "Newegg":
                return Neweggs.search(current.title);
            case "Taobao":
                return Taobao.search(current.title);
            case "JD":
                return JD.search(current.title);
            default:
                return Amazon.search(current.title);
        }
        return [];
    }

    private async LoadCurrent(loadData: boolean) {
        const current = this.getCurrent();
        if (current.price === -1) {
            current.price = await this.getPriceFromCustomSelector();
        }
        if (current.title === "") {
            current.title = await this.getTitleFromCustomSelector();
        }
        if (current.image === "") {
            current.image = await this.getImageFromCustomSelector();
        }
        Message.send("price_doge_load_current", current);
        if (current.title && loadData) {
            this.provideData(current).then((items) => {
                Message.send("priceDogeLoadItems", items);
            });
        }
        return current;
    }

    private addScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.onload = () => {
                resolve();
            };
            script.src = src;
            document.head.appendChild(script);
        });
    }
}
