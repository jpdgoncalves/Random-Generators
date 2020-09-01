

function createIframe() {
    const iframe = document.createElement("iframe");
    iframe.style.border = "0";
    iframe.style.height = "100%";
    iframe.style.width = "100%";
    return iframe;
}


/**
 * A simple paginator that makes use of a iframe.
 */
export default class IframePaginator {
    /**
     * 
     * @param {HTMLElement} container The container here the paginator should be displayed
     */
    constructor(container) {
        this.container = container;
        this.iframe = createIframe();
        /**
         * @type {Map<string, string>}
         */
        this.pages = new Map();

        container.appendChild(this.iframe);
    }

    /**
     * Adds a page with the specified url
     * @param {string} name The name of the page
     * @param {string} url The url of the page
     */
    addPage(name, url) {
        this.pages.set(name, url);
    }

    /**
     * Displays the page with the name passed as argument
     * @param {string} name The name of the page
     */
    display(name) {
        this.iframe.src = this.pages.get(name);
    }
}