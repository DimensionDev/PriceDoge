import IContent from "../../components/CompareContent/content";
import parsePrice from "../../components/CompareContent/price";
import Amazon from "../../services/amazon";
import { getImage, getTextFormSelector } from "../../utils/dom";
import CommodityHandler from "./CommodityHandler";

export default class NeweggsHandler extends CommodityHandler {
    protected priceType: string = "$";
    protected urls: string[] = ["www.newegg.com/Product/Product.aspx"];
    protected targetTag: string = "header.header";

    protected getCurrent(): IContent {
        return {
            image: getImage(document, ".mainSlide img"),
            title: getTextFormSelector(document, "#grpDescrip_h"),
            price: parsePrice(getTextFormSelector(document, ".grpPrimary .price-current")),
            url: location.href,
            priceType: "￥",
        };
    }
}
