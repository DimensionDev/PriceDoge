import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import CompareContent from "./components/CompareContent";
import { getLanguage, getLocalMessage } from "./i18n";
import Message from "./utils/messaging";

const loadCompareData = (targetTag: string, priceType: string) => {
    // tslint:disable-next-line:no-console
    console.log("working!");
    const container = document.createElement("div");
    container.id = "pricedoge-container";
    const target = document.querySelector(targetTag);
    if (target) {
        target.insertAdjacentHTML("beforebegin", container.outerHTML);
    }
    ReactDOM.render(
        <IntlProvider locale={getLanguage()} messages={getLocalMessage(getLanguage())}>
            <CompareContent priceType={priceType} />
        </IntlProvider>, document.getElementById("pricedoge-container"));
};
Message.on("priceDogeInit", (data) => {
    const { priceType, targetTag } = data;
    loadCompareData(targetTag, priceType);
    return true;
});

Message.on("priceDogeMessage", (message) => {
    alert(message);
    return true;
});

const doc: any = global;
const refresh = () => {
    Message.send("refresh_current", true);
};
doc.priceDoge = {
    refresh,
};
