import { getCookie } from "../utils/cookie";
import IBackgroundService from "./IBackgroundService";

export default class CookieService implements IBackgroundService {
    public run(): void {
        chrome.runtime.onMessage.addListener((request, sender, callback) => {
            const data = request.data;
            switch (request.type) {
                case "require_cookie":
                    getCookie(data).then((result) => {
                        callback(result);
                    });
                    return true;
                default:
                    break;
            }
        });
    }
}
