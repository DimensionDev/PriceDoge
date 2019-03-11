export {
    getTextFormSelector,
    getImage,
    getLink,
    findAncestorByNodeName,
    findAncestorByClassName,
    selectElement,
};

function getTextFormSelector(dom: ParentNode, selector: string) {
    const element = dom.querySelector(selector);
    if (element !== null && element !== undefined && element.textContent != null) {
        return element.textContent.trim();
    } else {
        return "";
    }
}

function getImage(dom: ParentNode, selector: string): string {
    const element = dom.querySelector<HTMLImageElement>(selector);
    if (element) {
        return element.src;
    } else {
        return "";
    }
}

function getLink(dom: ParentNode, selector: string) {
    const element = dom.querySelector<HTMLLinkElement>(selector);
    if (element) {
        return element.href;
    } else {
        return "";
    }
}

function findAncestorByNodeName(node: Node, nodeName: string): Node | null {
    if (node.nodeName === nodeName) {
        return node;
    }
    if (node.parentNode === null || node instanceof Document) {
        return null;
    }
    if (node.parentNode.nodeName === nodeName) {
        return node.parentNode;
    } else {
        return findAncestorByNodeName(node.parentNode, nodeName);
    }
}

function findAncestorByClassName(node: any, className: string): any {
    if (node.parentNode === null || node instanceof Document) {
        return null;
    }
    if (node.parentNode.className === className) {
        return node.parentNode;
    } else {
        return findAncestorByClassName(node.parentNode, className);
    }
}

function selectElement(): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        let target: HTMLElement;
        const mouseMove = (e: MouseEvent) => {
            if (e.target instanceof HTMLElement) {
                if (target !== e.target) {
                    if (target) {
                        target.style.outline = "unset";
                    }
                    target = e.target;
                    target.style.outline = "#f00 solid 2px";
                }
            }
        };
        document.addEventListener("mousemove", mouseMove);
        const mouseDown = (e: MouseEvent) => {
            document.removeEventListener("mousedown", mouseDown);
            document.removeEventListener("mousemove", mouseMove);
            if (target) {
                target.style.outline = "unset";
            }
            resolve(target);
        };
        document.addEventListener("mousedown", mouseDown);
    });
}
