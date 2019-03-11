import Axios from "axios";
import IContent from "../components/CompareContent/content";
import parsePrice from "../components/CompareContent/price";
import { getImage, getLink, getTextFormSelector } from "../utils/dom";
import { titleFilter } from "../utils/titleFilter";

const Neweggs = {
    search,
};

export default Neweggs;

async function search(title: string): Promise<IContent[]> {
    // tslint:disable-next-line:max-line-length
    const link = `https://www.newegg.com/Product/ProductList.aspx?Submit=ENE&DEPA=0&Order=BESTMATCH&Description=${encodeURIComponent(
        titleFilter(title),
    )}&N=-1&isNodeId=1`;
    const response = await Axios.get<string>(link);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, "text/html");
    return Array.from(doc.querySelectorAll(".item-container"))
        .map<IContent>((element) => ({
            image: getImage(element, ".item-img img"),
            title: getTextFormSelector(element, ".item-title"),
            price: parsePrice(getTextFormSelector(element, ".price-current")),
            url: getLink(element, ".item-title"),
            priceType: "￥",
        }))
        .filter((it) => it.price !== -1 && it.title)
        .slice(0, 3);
}
