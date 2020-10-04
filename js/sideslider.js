import TouchDrag from "./touch-drag.js";

const DISTANCE_REQUIRED = 100;
const TIME_TOLERANCE = 500;

/**
 * @type {HTMLElement}
 */
let SideSlider;
let slideOut = false;

function setup() {
    console.log("sideslider is setup");
    SideSlider = document.querySelector("nav.sideslider");

    if (SideSlider === null) {
        return;
    }

    TouchDrag.listen("drag", drag);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("touchend", tap);

    document.addEventListener("touchmove", preventDefault, { passive: false });
}

/**
 * 
 * @param {HTMLElement} start 
 * @param {HTMLElement} target 
 */
function isContainedBy(start, target) {
    if(! (start && target)) {
        return false;
    } else if(start === target) {
        return true;
    } else if(start.parentElement) {
        return isContainedBy(start.parentElement, target);
    } else {
        return false;
    }
}

/**
 * 
 * @param {MouseEvent} event 
 */
function mouseMove(event) {
    const { clientX, target } = event;
    const { clientWidth } = document.body;

    /*     console.log(target);
        console.log(clientX);
        console.log(clientWidth * 0.05); */

    if (clientX <= clientWidth * 0.02 && !SideSlider.classList.contains("active")) {
        SideSlider.classList.add("active");
    } else if (clientX >= clientWidth * 0.02 && !isContainedBy(target, SideSlider)) {
        SideSlider.classList.remove("active");
    }
}

/**
 * 
 * @param {import("./touch-drag.js").DragEvent} event 
 */
function drag(event) {
    const { classList } = SideSlider;
    const { startedAt, movedTo, timestamps } = event;
    const { start, current } = timestamps;
    const x1 = startedAt.x;
    const x2 = movedTo.x;

    if (!classList.contains("active")) {

        //console.log("Positive Drag", Math.abs(x2 - x1));
        if (x1 < x2 && Math.abs(x2 - x1) >= DISTANCE_REQUIRED && current - start <= TIME_TOLERANCE) {
            classList.add("active");
            slideOut = true;
        }

    } else {
        //console.log("Negative Drag", Math.abs(x2 - x1));
        if (x1 >= x2 && Math.abs(x2 - x1) >= DISTANCE_REQUIRED && current - start <= TIME_TOLERANCE) {
            classList.remove("active");
        }
    }
}

/**
 * 
 * @param {TouchEvent} event
 */
function tap(event) {
    const { classList } = SideSlider;

    if (classList.contains("active") && !slideOut) {
        //console.log("Tap Event");
        for (let touch of event.changedTouches) {
            const target = touch.target;
            if (!isContainedBy(target, SideSlider)) {
                classList.remove("active");
            }
        }
    }

    slideOut = false;
}

/**
 * 
 * @param {Event} e 
 */
function preventDefault(e) {
    if(e.cancelable) {
        e.preventDefault();
    }
}

document.addEventListener("DOMContentLoaded", setup);