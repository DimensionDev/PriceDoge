import IContent from "../../components/CompareContent/content";
import parsePrice from "../../components/CompareContent/price";
import Neweggs from "../../services/neweggs";
import { getImage, getTextFormSelector } from "../../utils/dom";
import CommodityHandler from "./CommodityHandler";

export default class AmazonHandler extends CommodityHandler {
    protected priceType: string = "$";
    protected urls: string[] = ["www.amazon.com"];
    protected targetTag: string = "header";
    private priceSelectors = [
        "#price_inside_buybox",
        "#priceblock_dealprice",
        "#priceblock_snsprice_Based .a-size-large",
        "#priceblock_ourprice",
        "#olp-upd-new-used",
        "#buyNew_noncbb",
        "#buybox .a-size-medium",
    ];

    public canHandle() {
        return (
            document.querySelector("#canvasCaption") !== null ||
            document.querySelector("#rcx-subscribe-submit-button-announce") !== null ||
            document.querySelector("#add-to-cart-button") !== null ||
            document.querySelector("#buybox-see-all-buying-choices-announce") !== null
        );
    }

    protected getCurrent(): IContent {
        return {
            image: getImage(document, ".imgTagWrapper img"),
            title: getTextFormSelector(document, "#title"),
            price: parsePrice(this.getPrice(document)),
            url: location.href,
            priceType: "$",
        };
    }

    private getPrice(document: Document): string {
        for (const item of this.priceSelectors) {
            const price = getTextFormSelector(document, item);
            if (price !== "") {
                return price;
            }
        }
        return "";
    }
}
