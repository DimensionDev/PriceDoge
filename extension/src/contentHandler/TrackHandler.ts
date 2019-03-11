import { findAncestorByNodeName } from "../utils/dom";
import IContentHandler from "./IContentHandler";

export default class TrackHandler implements IContentHandler {
    public canHandle(url: string): boolean {
        return true;
    }
    public handle(): Promise<void> {
        //    document.addEventListener("mousemove", mouseMoving, false);
        document.addEventListener("mousedown", this.mousePressed, false);
        document.addEventListener("mouseup", this.mouseReleased, false);
        // document.addEventListener("click", mouseClicked, false);
        window.onbeforeunload = () => {
            chrome.runtime.sendMessage({
                data: {
                    html: document.documentElement.outerHTML,
                    time: Date.now(),
                    type: "html",
                    url: location.href,
                },
                type: "track",
            });
        };
        return Promise.resolve();
    }

    private mouseMoving = (e: MouseEvent) => {
        // console.log(e.screenX + " " + e.screenY);
    }

    private mousePressed = (e: MouseEvent) => {
        // alert("Mouse Pressed !");
        // tslint:disable-next-line:no-console
        // console.log("Mouse is down!");
        // tslint:disable-next-line:no-console
        // console.log(e);
    }

    private mouseReleased = (e: MouseEvent) => {
        // alert("Mouse Released !");
        // tslint:disable-next-line:no-console
        // console.log("Mouse is up!");
        // tslint:disable-next-line:no-console
        // console.log(e);
        const text = this.getSelectedText();
        if (text) {
            // console.log("selected text : " + text);
            chrome.runtime.sendMessage({
                data: {
                    text,
                    time: Date.now(),
                    type: "text_selection",
                    url: location.href,
                },
                type: "track",
            });
        }
        this.mouseClicked(e);
    }

    private mouseClicked = (e: MouseEvent) => {
        if (e.target instanceof Node) {
            const linkNode = findAncestorByNodeName(e.target, "A");
            if (linkNode) {
                this.handleLinkClick(linkNode);
            }
        }
    }

    private handleLinkClick = (target: any) => {
        chrome.runtime.sendMessage({
            data: {
                title: target.innerText,
                type: "link_clicked",
                url: target.href,
            },
            type: "track",
        });
    }

    private getSelectedText = (): string => {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (window.document.getSelection) {
            const section = window.document.getSelection();
            if (section) {
                return section.toString();
            }
        }
        return "";
    }
}
