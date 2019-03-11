import { getMessageForCurrentLanguage } from "../i18n";
import Message from "../utils/messaging";
import IBackgroundService from "./IBackgroundService";

export default class ContextMenusService implements IBackgroundService {
    private selector!: string;
    private dom!: HTMLElement;
    private url!: string;

    public run(): void {
        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            switch (request.type) {
                case "context_menu":
                    const { target, url, selector } = request.data;
                    this.dom = target;
                    this.selector = selector;
                    this.url = url;
                    break;
            }
        });
        chrome.contextMenus.create({
            contexts: ["selection"],
            id: "ContextMenusService",
            title: getMessageForCurrentLanguage("context_menu.title", "This CSS/Element is price"),
        });
        chrome.contextMenus.onClicked.addListener(this.onCustomElementSelected);
    }

    private onCustomElementSelected = (data: chrome.contextMenus.OnClickData) => {
        if (!this.selector || !this.url) {
            return;
        }
        Message.send("updateComodityHandlersIfNeeded", undefined);
        Message.send("addCustomPriceRule", this.selector);
        Message.send("priceDogeMessage", getMessageForCurrentLanguage("context_menu.success", "Success!"));
    }
}
