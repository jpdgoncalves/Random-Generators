import * as PL from "./preloader.js";
import * as Random from "./random.js";

const preLoader = new PL.PreLoader();

preLoader.load("templates/character-traits.html", PL.responseToHTML)
    .load("resources/traits/positive.txt", PL.responseToList)
    .load("resources/traits/neutral.txt", PL.responseToList)
    .load("resources/traits/negative.txt", PL.responseToList);

preLoader.onload = (resources) => {
    const characterTraitsPage = resources.get("templates/character-traits.html");
    const positiveTraits = resources.get("resources/traits/positive.txt");
    const negativeTraits = resources.get("resources/traits/negative.txt");
    const neutralTraits = resources.get("resources/traits/neutral.txt");
    
    for(let element of characterTraitsPage) {
        document.body.appendChild(element);
    }

    const ptElement = document.getElementById("positive-traits");
    const neutElement = document.getElementById("neutral-traits");
    const negElement = document.getElementById("negative-traits");
    const genElement = document.getElementById("generate");
    const outputElement = document.getElementById("output");

    genElement.addEventListener("click", () => {
        const pTraits = parseValue(ptElement);
        const neutTraits = parseValue(neutElement);
        const negTraits = parseValue(negElement);

        outputElement.innerHTML = "";
        outputElement.appendChild(createTitle("Positive Traits"));
        outputElement.appendChild(createList(Random.choices(positiveTraits, pTraits)));
        outputElement.appendChild(createTitle("Neutral Traits"));
        outputElement.appendChild(createList(Random.choices(neutralTraits, neutTraits)));
        outputElement.appendChild(createTitle("Negative Traits"));
        outputElement.appendChild(createList(Random.choices(negativeTraits, negTraits)));
    });
}

/**
 * 
 * @param {HTMLElement} element 
 */
function parseValue(element) {
    let value = parseInt(element.innerText);
    return Number.isNaN(value) ? 1 : value;
}

/**
 * @param {string} text
 */
function createTitle(text) {
    let div = document.createElement("div");
    let h1 = document.createElement("h1");
    h1.innerText = text;
    div.appendChild(h1);
    return div;
}

/**
 * @param {string[]} text
 */
function createList(text) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = text.join("\n");
    div.appendChild(p);
    return div;
}