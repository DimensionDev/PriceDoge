const startWords = [
    "\\(",
    "（",
    "【",
    "{",
    "\\[",
];
const endWords = [
    "\\)",
    "）",
    "】",
    "}",
    "\\]",
];

function buildRegex(): RegExp[] {
    return startWords.map((value, index) => {
        return new RegExp(`[${value}]([^${endWords[index]}])*[${endWords[index]}]`, "g");
    });
}

function titleFilter(title: string): string {
    buildRegex().forEach((it) => {
        title = title.replace(it, "");
    });
    return title.replace(/[$-/:-?{-~!"^_`\[\]]\s.*/, "").trim();
}

export {
    titleFilter,
};
