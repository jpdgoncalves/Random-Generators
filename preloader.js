
const parser = new DOMParser();
let DOMREADY = false;

document.addEventListener("DOMContentLoaded", () => { DOMREADY = true }, { once: true });


export class PreLoader {
    constructor() {
        this.resources = new Map();
        this.onload = console.log;

        this._requests = new Map();
        this._futureOnLoad = false;
    }

    /**
     * 
     * @param {string} url 
     * @param {Function} converter 
     */
    load(url, converter = responseToText) {

        const request = fetch(url).then(
            (response) => converter(response)
        ).then(
            (resource) => {
                this._requests.delete(url);
                this.resources.set(url, resource);
                this._proxyOnLoadDispatch();
            }
        )

        this._requests.set(
            url,
            request
        );

        return this;
    }


    _proxyOnLoadDispatch() {
        if (this._requests.size === 0) {
            if (DOMREADY) {
                this.onload(this.resources);
            } else if (!this._futureOnLoad) {
                this._futureOnLoad = true;

                document.addEventListener("DOMContentLoaded", () => {
                    DOMREADY = true;
                    this.onload(this.resources);
                }, { once: true });
            }
        }
    }
}


/**
 * 
 * @param {Response} response 
 */
export function responseToText(response) {
    return response.text();
}


export function responseToList(response) {
    return responseToText(response).then(
        (text) => text.split("\n").map(
            (word) => word.trim()
        )
    );
}


/**
 * 
 * @param {Response} response
 */
export function responseToHTML(response) {
    return response.text().then(
        (text) => {
            const html = [];
            const doc = parser.parseFromString(text, "text/html");

            while(doc.body.children.length > 0) {
                let element = doc.body.children[0];
                html.push(element);
                doc.body.removeChild(element);
            }

            return html;
        }
    )
}