function getCookie(domain: string): Promise<chrome.cookies.Cookie[]> {
    return new Promise((resolve) => {
        if (chrome.cookies) {
            chrome.cookies.getAll({ domain }, (cookies) => {
                resolve(cookies);
            });
        } else {
            chrome.runtime.sendMessage({ type: "require_cookie", data: domain }, (response) => {
                resolve(response);
            });
        }
    });
}

export {
    getCookie,
};
