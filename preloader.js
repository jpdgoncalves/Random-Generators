
let DOMREADY = false;

document.addEventListener("DOMContentLoaded", () => { DOMREADY = true }, { once: true });


export default class PreLoader {
    constructor() {
        this.resources = new Map();
        this.onload = console.log;

        this._requests = new Map();
        this._futureOnLoad = false;
    }

    load(url) {

        const request = fetch(url).then(
            (response) => response.text()
        ).then(
            (text) => {
                this._requests.delete(url);
                this.resources.set(url, text);
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