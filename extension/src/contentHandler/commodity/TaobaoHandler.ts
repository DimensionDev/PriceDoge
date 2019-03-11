import IContent from "../../components/CompareContent/content";
import parsePrice from "../../components/CompareContent/price";
import JD from "../../services/jd";
import { getImage, getTextFormSelector } from "../../utils/dom";
import CommodityHandler from "./CommodityHandler";

export default class TaobaoHandler extends CommodityHandler {
    protected priceType: string = "￥";
    protected urls: string[] = ["item.taobao.com"];
    protected targetTag: string = "#J_SiteNav";

    protected getCurrent() {
        return {
            comments: Array.from(document.querySelectorAll('[id^="review-"]')).map((value) => {
                return {
                    content: Array.from(value.querySelectorAll('[class*="ReviewContent"]')).map((it) =>
                        `${it.textContent}`.trim(),
                    ),
                    order_info: getTextFormSelector(value, ".tb-r-act-bar"),
                    user_avatar: getImage(value, ".avatar"),
                    user_name: getTextFormSelector(value, ".from-whom"),
                };
            }),
            image: getImage(document, "#J_ImgBooth"),
            title: getTextFormSelector(document, "#J_Title > .tb-main-title"),
            price: parsePrice(getTextFormSelector(document, ".tb-rmb-num")),
            provider: "taobao",
            url: location.href,
            user_name: getTextFormSelector(document, ".site-nav-login-info-nick"),
            priceType: "?",
        };
    }
}
