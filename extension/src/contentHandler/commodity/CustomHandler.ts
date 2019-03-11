import IContent from "../../components/CompareContent/content";
import Amazon from "../../services/amazon";
import JD from "../../services/jd";
import Neweggs from "../../services/neweggs";
import Taobao from "../../services/taobao";
import Message from "../../utils/messaging";
import CommodityHandler from "./CommodityHandler";

export default class CustomHandler extends CommodityHandler {
    protected priceType: string = "";
    protected urls: string[] = ["*.*"];
    protected targetTag: string = "body >:first-child";
    public canHandle(url: string): boolean {
        return false;
    }

    public async hasPriceInfo(): Promise<boolean> {
        return (await this.getPriceFromCustomSelector()) !== -1;
    }

    protected getCurrent(): IContent {
        return {
            image: "",
            title: "",
            price: -1,
            url: "",
            priceType: "$",
        };
    }
}
