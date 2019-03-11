import Axios from "axios";
import IContent from "../components/CompareContent/content";
import parsePrice from "../components/CompareContent/price";
import { getImage, getLink, getTextFormSelector } from "../utils/dom";
import { titleFilter } from "../utils/titleFilter";

const Amazon = {
    search,
};

export default Amazon;

async function search(title: string): Promise<IContent[]> {
    const link = `https://www.amazon.com/s?field-keywords=${encodeURIComponent(titleFilter(title))}`;
    const response = await Axios.get<string>(link);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, "text/html");
    return Array.from(doc.querySelectorAll(".s-result-item"))
        .map<IContent>((element) => ({
            image: getImage(element, "img"),
            title: getTextFormSelector(element, ".s-access-title"),
            price: parsePrice(getPrice(element.querySelector(".sx-price"))),
            url: getLink(element, ".s-access-detail-page"),
            priceType: "$",
        }))
        .filter((it) => it.price !== -1 && it.title)
        .slice(0, 3);
}

function getPrice(element: Element | null) {
    if (element == null) {
        return ``;
    }
    const whole = getTextFormSelector(element, ".sx-price-whole");
    const fractional = getTextFormSelector(element, ".sx-price-fractional");
    return `${whole}.${fractional}`;
}
