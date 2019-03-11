import IContent from "../components/CompareContent/content";
import { getCookie } from "../utils/cookie";
import http from "../utils/createHttp";
import { titleFilter } from "../utils/titleFilter";

const Taobao = {
    search,
};

export default Taobao;

async function search(title: string): Promise<IContent[]> {
    const cookie = await getCookie(".taobao.com");
    if (!cookie || cookie.length === 0) {
        return [];
    }
    const response = await http.post<
        Array<{
            img: string;
            name: string;
            price: number;
            url: string;
        }>
    >("/search/taobao", {
        cookie,
        q: titleFilter(title),
    });
    return response.data.map<IContent>((x) => ({
        image: x.img,
        price: x.price,
        priceType: "￥",
        title: x.name,
        url: x.url,
    }));
}
