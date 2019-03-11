const startWords = [
    "\\(",
    "（",
    "【",
];
const endWords = [
    "\\)",
    "）",
    "】",
];

function buildRegex(): RegExp {
    return new RegExp(`(${startWords.join("|")})[^(${endWords.join("|")})*](${endWords.join("|")})`, "g");
}

function titleFilter(title: string): string {
    const regex = buildRegex();
    return title.replace(regex, " ");
}

export {
    titleFilter,
};
