import IContent from "../../components/CompareContent/content";
import parsePrice from "../../components/CompareContent/price";
import JD from "../../services/jd";
import { findAncestorByClassName, getImage, getTextFormSelector } from "../../utils/dom";
import CommodityHandler from "./CommodityHandler";

export default class TmallHandler extends CommodityHandler {
    protected priceType: string = "￥";
    protected urls: string[] = ["detail.tmall.com"];
    protected targetTag: string = "#site-nav";

    protected getCurrent() {
        return {
            comments: Array.from(document.querySelectorAll(".rate-grid > table > tbody > tr")).map((value) => {
                return {
                    content: Array.from(value.querySelectorAll(".tm-rate-fulltxt")).map((it) =>
                        `${it.textContent}`.trim(),
                    ),
                    order_info: getTextFormSelector(value, ".rate-sku"),
                    user_name: getTextFormSelector(value, ".rate-user-info"),
                };
            }),
            image: getImage(document, "#J_ImgBooth"),
            title: getTextFormSelector(document, ".tb-detail-hd > h1"),
            price: parsePrice(this.getPrice(document)),
            provider: "tmall",
            url: location.href,
            user_name: getTextFormSelector(document, ".sn-user-nick"),
            priceType: "?",
        };
    }
    protected getPrice(element: ParentNode): string {
        const items = Array.from(element.querySelectorAll(".tm-price"));
        // .filter((it) => getComputedStyle(findAncestorByClassName(it, "tm-price-panel")).display !== "none");
        if (items !== null && items.length > 0) {
            return items[items.length - 1].textContent!.trim();
        } else {
            return "";
        }
    }
}
