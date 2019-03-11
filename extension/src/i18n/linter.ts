// Run it by ts-node -O '{\"module\": \"commonjs\"}' ./src/i18n/linter.ts
import { readdirSync } from "fs";
import { getLocalMessage } from "./index";

const langs = readdirSync(__dirname)
    .filter((x: string) => !x.match(".ts") && x !== "en")
    .map((x) => ({ lang: x, locale: getLocalMessage(x) }));
const base = getLocalMessage("en");

const violate = new Map(langs.map<[string, string[]]>((x) => [x.lang, []]));

for (const key of Object.keys(base)) {
    for (const lang of langs) {
        if (!lang.locale[key]) {
            violate.set(lang.lang, violate.get(lang.lang)!.concat(key));
        }
    }
}

let msg = "";
for (const [lang, strings] of Array.from(violate.entries())) {
    // tslint:disable: no-console
    msg += (`语言 ${lang} 缺少以下字符串: \n`);
    msg += ("\t" + strings.join("\n\t"));
}
if (msg) {
    throw new Error(msg);
}
