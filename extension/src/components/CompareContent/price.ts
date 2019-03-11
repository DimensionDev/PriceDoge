import { isNumber } from "util";

const pattern = [
    /\$(\d+\.\d+)/,
    /(\d+\.\d+)/,
];

export default function parsePrice(price: any): number {
    if (isNumber(price)) {
        return price;
    }
    const str = `${price}`;
    if (!price || str === "") {
        return -1;
    }
    const rm = str.replace(",", "");
    for (const item of pattern) {
        const regex = rm.match(item);
        if (regex) {
            const flo = parseFloat(regex[1]);
            if (!isNaN(flo)) {
                return flo;
            }
        }
    }

    const ds = str.match(/(\d+)/g);
    if (ds && ds.length !== 0) {
        return parseFloat(`${ds[ds.length - 2]}.${ds[ds.length - 1]}`);
    }

    return -1;
    // const result = parseFloat(rm);
    // if (isNaN(result)) {
    //     for (const item of pattern) {
    //         const regex = rm.match(item);
    //         if (regex) {
    //             const flo = parseFloat(regex[0]);
    //             if (!isNaN(flo)) {
    //                 return flo.toFixed(2);
    //             }
    //         }
    //     }
    //     return rm;
    // } else {
    //     return result.toFixed(2);
    // }
}
