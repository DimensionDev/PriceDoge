import Axios from "axios";
import IContent from "../components/CompareContent/content";
import { getImage, getTextFormSelector } from "../utils/dom";
import { titleFilter } from "../utils/titleFilter";

const JD = {
    search,
};

export default JD;

async function search(title: string): Promise<IContent[]> {
    const response = await Axios.get<string>("https://so.m.jd.com/ware/search.action", {
        params: {
            keyword: titleFilter(title),
        },
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(response.data, "text/html");
    return (
        Array.from(doc.querySelectorAll(".search_prolist_item"))
            // .slice(0, 3)
            .map<IContent>((element) => {
                const item = {
                    id: "",
                    image: getImage(element, ".search_prolist_cover img").replace("file://", "https://"),
                    title: getTextFormSelector(element, ".search_prolist_title").trim(),
                    price: parseFloat(element.querySelector(".search_prolist_item_inner em")!.getAttribute("pri")!),
                    url: "",
                    priceType: "￥",
                };
                const skuid = element.getAttribute("skuid");
                item.url = `https://item.jd.com/${skuid}.html`;
                return item;
            })
            .filter((it) => !isNaN(it.price) && it.price !== -1)
            .slice(0, 3)
    );
}
