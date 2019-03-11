function save<T>(key: string, value: T) {
    const obj: any = {};
    obj[key] = value;
    const result = chrome.storage.local.set(obj);
}

function load<T>(key: string): Promise<T> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key] as T);
        });
    });
}

export {
    load,
    save,
};
