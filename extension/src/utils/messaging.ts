import IContent from "../components/CompareContent/content";
/** All messages and its type is defined here. */
interface ITypedMessages {
    priceDogeMessage: string;
    updateComodityHandlersIfNeeded: void;
    addCustomPriceRule: string;
    require_extension_id: void;
    refresh_current: boolean;
    priceDogeUpdateSearchProvider: string;
    addCustomImageRule: string;
    addCustomTitleRule: string;
    priceDogeSelection: boolean;
    priceDogeLoadItems: IContent[];
    price_doge_load_current: IContent;
    priceDogeInit: { priceType: string; targetTag: string };
    provice_extension_id: string;
}
class MessageCenter {
    private listeners: Array<{ key: string; handler: (data: any) => boolean }> = [];
    private id = "";

    constructor() {
        if (chrome && chrome.runtime) {
            if (chrome.runtime.onMessage) {
                chrome.runtime.onMessage.addListener((request, sender, callback) => {
                    const { key, data } = request;
                    const handled = this.listeners.filter((it) => it.key === key).some((it) => it.handler(data));
                    if (!handled) {
                        if (document && document.dispatchEvent) {
                            document.dispatchEvent(
                                new CustomEvent("MessageCenter", {
                                    detail: {
                                        data,
                                        key,
                                    },
                                }),
                            );
                        }
                    }
                });
            }
            if (chrome.runtime.onMessageExternal) {
                chrome.runtime.onMessageExternal.addListener((request, sender, callback) => {
                    const { key, data } = request;
                    this.listeners.filter((it) => it.key === key).forEach((it) => it.handler(data));
                });
            }
        }
        if (document && document.addEventListener) {
            document.addEventListener("MessageCenter", (event: any) => {
                const { key, data } = event.detail;
                this.listeners.filter((it) => it.key === key).forEach((it) => it.handler(data));
            });
        }
        if (chrome && chrome.runtime && chrome.runtime.id) {
            this.on("require_extension_id", () => {
                this.send("provice_extension_id", chrome.runtime.id);
                return true;
            });
        }
        if (!chrome || !chrome.runtime || !chrome.runtime.id) {
            this.on("provice_extension_id", (data) => {
                this.id = data;
                return true;
            });
            this.send("require_extension_id", undefined);
        }
    }

    public on<Key extends keyof ITypedMessages>(key: Key, handler: (data: ITypedMessages[Key]) => boolean): any {
        this.listeners.push({
            handler: (data) => handler(data),
            key,
        });
    }

    public send<Key extends keyof ITypedMessages>(key: Key, data: ITypedMessages[Key]): any {
        console.log(key, data);

        if (chrome && chrome.runtime) {
            if (chrome.runtime.sendMessage) {
                try {
                    chrome.runtime.sendMessage({
                        data,
                        key,
                    });
                } catch (error) {
                    if (this.id) {
                        chrome.runtime.sendMessage(this.id, {
                            data,
                            key,
                        });
                    }
                }
            }
        }
        if (document && document.dispatchEvent) {
            document.dispatchEvent(
                new CustomEvent("MessageCenter", {
                    detail: {
                        data,
                        key,
                    },
                }),
            );
        }
        if (chrome && chrome.tabs) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
                const currentTab = tab[0];
                if (currentTab.id) {
                    chrome.tabs.sendMessage(currentTab.id, {
                        data,
                        key,
                    });
                }
            });
        }
    }
}

const Message = new MessageCenter();

export default Message;
