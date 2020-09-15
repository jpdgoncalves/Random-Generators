import IframePaginator from "./js/iframe-paginator.js";

/**
 * 
 * @param {Event} event 
 */
function cloneEvent(event) {
    return new event.constructor(event.type, event);
}

/**
 * 
 * @param {Event} event 
 * @param {HTMLElement} target 
 */
function redispatchEvent(event, target) {
    const newEvent = cloneEvent(event);
    target.dispatchEvent(newEvent);
}

/**
 * 
 * @param {HTMLIFrameElement} iframe 
 */
function iframeEventsFix(iframe) {
    const iframeWindow = iframe.contentWindow.document;
    iframeWindow.onmousemove = (e) => {redispatchEvent(e, document)};
    iframeWindow.ontouchstart = (e) => {redispatchEvent(e, document)};
    iframeWindow.ontouchmove = (e) => {redispatchEvent(e, document)};
    iframeWindow.ontouchend = (e) => {redispatchEvent(e, document)};
    iframeWindow.ontouchcancel = (e) => {redispatchEvent(e, document)};
}

window.onload = () => {
    const paginator = new IframePaginator(document.body);
    const navigation = document.getElementById("navigation");

    paginator.addPage("character-traits", "./pages/character-traits.html");
    paginator.display("character-traits");

    paginator.iframe.onload = () => {iframeEventsFix(paginator.iframe)};

    for(let li of navigation.children) {
        li.addEventListener("click", (e) => {
            const target = e.target;
            const page = target.dataset.page;
            paginator.display(page);
        });
    }
}