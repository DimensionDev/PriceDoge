import Axios from "axios";
import IBackgroundService from "./IBackgroundService";

export default class TrackService implements IBackgroundService {
    private operations: any[] = [];
    private userid = "";
    public run(): void {
        chrome.storage.local.get(["operations"], (data) => {
            if (data.operations) {
                this.operations = data.operations;
            }
        });

        chrome.bookmarks.onCreated.addListener((id, bookmark) => {
            if (bookmark.url) {
                this.save({ url: bookmark.url, title: bookmark.title, time: Date.now(), type: "bookmark_add" });
            }
        });

        // chrome.printerProvider.onPrintRequested.addListener(function() {
        //
        // })

        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            const data = request.data;
            switch (request.type) {
                case "track":
                    this.save(data);
                    break;
            }
        });

        chrome.identity.getProfileUserInfo((userInfo) => {
            if (userInfo.id) {
                this.userid = userInfo.id;
            }
        });

        chrome.identity.onSignInChanged.addListener((account, signedIn) => {
            if (account.id) {
                this.userid = account.id;
            }
        });
        // chrome.tabs.onRemoved.addListener(() => {
        //     this.upload();
        // });
        // chrome.windows.onRemoved.addListener((windowId) => {
        //     this.upload();
        // });
    }

    private async upload() {
        if (Object.keys(this.operations).length === 0) {
            return;
        }
        // tslint:disable-next-line:no-console
        console.log("uploading data");
        const operations = this.operations;
        this.operations = [];
        const response = await Axios.post("https://118.31.229.102/http", operations);
        chrome.storage.local.set({ operations: [] }, () => {
            // tslint:disable-next-line:no-console
            console.log("operations saved");
        });
    }

    private save(value: any) {
        // tslint:disable-next-line:no-console
        console.log("saving");
        this.operations.push(value);
        chrome.storage.local.set({ operations: this.operations });
        // tslint:disable-next-line:no-console
        console.log(this.operations);
        this.upload();
    }
}
