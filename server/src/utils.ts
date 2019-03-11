
function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function findAncestor(node: any, className: string): any {
    if (node.parentNode === null) {
        return null;
    }
    if (node.parentNode.className === className) {
        return node.parentNode;
    } else {
        return findAncestor(node.parentNode, className);
    }
}

export {
    addDays,
    findAncestor,
};
