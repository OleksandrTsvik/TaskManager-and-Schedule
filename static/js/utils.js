export function checkBtn(elem, elemName, className) {
    if (
        elem.parentNode.parentNode.nodeName === elemName &&
        elem.parentNode.parentNode.classList.contains(className)
    ) {
        elem = elem.parentNode.parentNode;
    } else if (
        elem.parentNode.nodeName === elemName &&
        elem.parentNode.classList.contains(className)
    ) {
        elem = elem.parentNode;
    } else if (
        elem.nodeName !== elemName ||
        !elem.classList.contains(className)
    ) {
        return undefined;
    }

    return elem;
}