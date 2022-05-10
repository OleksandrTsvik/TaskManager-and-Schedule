export function checkBtn(elem, className) {
    if (
        elem.parentNode.parentNode.nodeName === 'BUTTON' &&
        elem.parentNode.parentNode.classList.contains(className)
    ) {
        elem = elem.parentNode.parentNode;
    } else if (
        elem.parentNode.nodeName === 'BUTTON' &&
        elem.parentNode.classList.contains(className)
    ) {
        elem = elem.parentNode;
    } else if (
        elem.nodeName !== 'BUTTON' ||
        !elem.classList.contains(className)
    ) {
        return undefined;
    }

    return elem;
}