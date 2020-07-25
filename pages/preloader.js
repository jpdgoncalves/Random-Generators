
const isDOMLoaded = () => document.readyState !== "loading";
const domParser = new DOMParser();


/**
 * Converts the response of the request into text
 * @param {Response} response 
 */
export function responseToText(response) {
    return response.text();
}


/**
 * Converts the response of the request into JSON
 * @param {Response} response
 */
export function responseToJSON(response) {
    return response.json();
}

/**
 * Converts ther response of the request into a Document
 * @param {Response} response 
 */
export function responseToHTMLDOM(response) {
    return response.text().then(
        (text) => {
            return domParser.parseFromString(text, "text/html");
        }
    )
}


/**
 * Class that can be used to preload resources. It supplies an onload property which can be overridden and used like window.onload. 
 * The difference is that it calls the onload method with an argument which is a Map with the resources requested
 * 
 * This method is called after all of the resources requested with the load(url) method have been loaded.
 */
export class PreLoader {
    /**
     * 
     * @param {string} basePath A base path to be when requesting resources
     */
    constructor(basePath = "") {
        this.basePath = basePath.replace(/\/$/, "");
        this.resources = new Map();
        /**
         * @type {function(Map<string, any>):void}
         */
        this.onload = console.log;

        this._requests = new Map();
        this._onLoadCalled = false;
    }

    /**
     * 
     * @param {string} url The url for the resource requested 
     * @param {function(Response):any} converter A converter function which will transform the response into an usable resource
     */
    load(url, converter = responseToText) {
        const fullUrl = `${this.basePath}/${url}`;
        /**
         * 
         * @param {Response} response 
         */
        const callback = async (response) => {
            const resource = await converter(response);
            this._requests.delete(fullUrl);
            this.resources.set(url, resource);
            this._updateState();
        }
        const request = fetch(fullUrl).then(callback);

        this._requests.set(fullUrl, request);

        return this;
    }

    /**
     * @private
     */
    _updateState() {
        if (this._requests.size === 0) {
            if (isDOMLoaded()) {
                this.onload(this.resources);
            } else if (!this._onLoadCalled) {
                document.addEventListener("DOMContentLoader", () => {
                    this.onload(this.resources);
                });

                this._onLoadCalled = true;
            }
        }
    }
}


/**
 * Class to be used to create rather complex chains of resources to preLoad.
 * Like the PreLoader it has an onload method that is called when all the resources are loaded with a Map as an argument.
 * 
 * Note that the preloaders create with this class should not have their onload method overriden as it is used to detect when to fire
 * the PreLoaderMap.onload method.
 */
export class PreLoaderMap {
    constructor() {
        this.resources = new Map();
        /**
         * @type {function(Map<string, Map<string, any>>):void}
         */
        this.onload = console.log;

        /**
         * @type {Map<string, PreLoader>}
         */
        this._preLoaders = new Map();
        this._loadedPreLoaders = 0;
    }

    /**
     * Creates a PreLoader with the specified basePath (if another one with the same name doesn't exist already).
     * The name defines the key it will have in resources property 
     * @param {string} name  
     * @param {string} basePath 
     */
    get(name, basePath = "") {
        if(this._preLoaders.has(name)) {
            return this._preLoaders.get(name);
        } else {
            const preLoader = new PreLoader(basePath);

            preLoader.onload = (resources) => {this._updateState(name, resources)};
            this._preLoaders.set(name, preLoader);

            return preLoader;
        }
    }

    /**
     * 
     * @param {string} name
     * @param {Map<string, any>} resources 
     */
    _updateState(name, resources) {
        this._loadedPreLoaders += 1;

        this.resources.set(name, resources);

        if(this._loadedPreLoaders === this._preLoaders.size) {
            this.onload(this.resources);
        }
    }
}