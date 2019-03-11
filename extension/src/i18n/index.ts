function getLocalMessage(language: string) {
    language = language.toLowerCase();
    let message = require("./en");
    try {
        message = require(`./${language}`);
    } catch {
        language = language.split("-")[0];
        try {
            message = require(`./${language}`);
        } catch {
            //
        }
    }
    return flattenMessages(message.default);
}

function flattenMessages(nestedMessages: Record<string, any>, prefix = ""): Record<string, string> {
    if (nestedMessages === null) {
        return {};
    }
    return Object.keys(nestedMessages).reduce((messages, key) => {
        const value = nestedMessages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "string") {
            Object.assign(messages, { [prefixedKey]: value });
        } else {
            Object.assign(messages, flattenMessages(value, prefixedKey));
        }

        return messages;
    }, {});
}

function getMessageForCurrentLanguage(key: string, defaultString: string) {
    const currentMessages = getLocalMessage(getLanguage());
    if (!currentMessages[key]) {
        // tslint:disable-next-line: no-console no-unused-expression
        console.warn("Unresolved string for ", key);
    }
    return currentMessages[key] || defaultString;
}

function getLanguage() {
    return navigator.language;
}

export {
    getLanguage,
    getLocalMessage,
    getMessageForCurrentLanguage,
};
