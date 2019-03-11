import IContent from "../../components/CompareContent/content";
import parsePrice from "../../components/CompareContent/price";
import Taobao from "../../services/taobao";
import { getImage, getTextFormSelector } from "../../utils/dom";
import Message from "../../utils/messaging";
import CommodityHandler from "./CommodityHandler";

export default class JdHandler extends CommodityHandler {
    protected priceType: string = "￥";
    protected urls: string[] = ["item.jd.com"];
    protected targetTag: string = "#shortcut-2014";
    private observer = new MutationObserver(() => {
        Message.send("refresh_current", false);
        this.observer.disconnect();
    });

    protected getCurrent() {
        const obj = {
            comments: Array.from(document.querySelectorAll(".comment-item")).map((value) => {
                return {
                    content: Array.from(value.querySelectorAll(".comment-con")).map((it) => `${it.textContent}`.trim()),
                    order_info: getTextFormSelector(value, ".order-info"),
                    // rating: value.querySelector<HTMLImageElement>(".comment-star").className.slice(-1),
                    user_avatar: getImage(value, ".avatar"),
                    user_name: getTextFormSelector(value, ".user-info"),
                };
            }),
            image: getImage(document, "#spec-img"),
            title: getTextFormSelector(document, ".sku-name"),
            price: parsePrice(getTextFormSelector(document, ".p-price .price")),
            provider: "jd",
            url: location.href,
            user_name: getTextFormSelector(document, ".nickname"),
            priceType: "?",
        };
        const target = document.querySelector(".p-price .price");
        if (obj.price === -1 && target) {
            this.observer.observe(target, { attributes: true, childList: true, subtree: true });
        }
        return obj;
    }
}
