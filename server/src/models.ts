interface ISearchResult {
    id: string;
    img: string;
    name: string;
    price: number;
    url: string;
}

interface ICartResult {
    title: string;
    price: {
         value: number;
    };
    amount: {
        value: number;
    };
}

export {
    ICartResult,
    ISearchResult,
};
