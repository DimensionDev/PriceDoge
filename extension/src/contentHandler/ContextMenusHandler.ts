import finder from "@medv/finder";
import IContentHandler from "./IContentHandler";

export default class ContextMenusHandler implements IContentHandler {
    public handle(): Promise<void> {
        document.addEventListener("mousedown", this.mouseDown, false);
        // chrome.runtime.onMessage.addListener((request, sender, callback) => {
        //     switch (request.type) {
        //         case "add_selector_success":
        //             document.dispatchEvent(new CustomEvent("priceDogeMessage", {
        //                 detail: {
        //                     message: "添加成功",
        //                 },
        //             }));
        //             break;
        //     }
        // });
        return Promise.resolve();
    }
    public canHandle(url: string): boolean {
        return true;
    }

    private mouseDown = (e: MouseEvent) => {
        if (e.target instanceof Element && e.button === 2) {
            chrome.runtime.sendMessage({
                data: {
                    selector: finder(e.target),
                    target: e.target,
                    url: location.href,
                },
                type: "context_menu",
            });
        }
    }
}
