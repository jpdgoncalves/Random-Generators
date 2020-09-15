document.addEventListener("DOMContentLoaded", setup);

function setup() {
    /**@type {HTMLDivElement[]} */
    const sideSwitchers = document.querySelectorAll("div.sideswitcher");

    for (let sideSwitcher of sideSwitchers) {
        switchTo(sideSwitcher, "start");
    }

    console.log("Sideswitcher setup");
}


/**
 * Display the item with the name in the target sideswitcher
 * @param {HTMLDivElement} sideswitcher The sideswitcher that you wish to target
 * @param {string} next The name of the item you wish to switch to
 */
export default function switchTo(sideswitcher, next) {
    const currentItem = sideswitcher.querySelector(`div.ss-item.display`);
    const nextItem = sideswitcher.querySelector(`div.ss-item[data-ss-name='${next}']`);

    if(currentItem !== null) {
        currentItem.classList.remove("display");
    }

    nextItem.classList.add("display");
}