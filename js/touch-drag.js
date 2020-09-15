const EMPTY_SET = new Set();

/**
 * A class that can be used as is to emit events or to extend components to support event emittion.
 */
class EventEmitter {

    constructor() {
        /**
         * @type {Map<string, Set<function>>}
         */
        this.listeners = new Map();
    }

    /**
     * Emit an event
     * @param {string} event Name of the event
     * @param {*} data Data associated with the event
     */
    emit(event, data) {
        const listeners = this.listeners.get(event) || EMPTY_SET;
        for (let listener of listeners) {
            listener(data);
        }
    }

    /**
     * Listen to a particular event
     * @param {string} event Name of the event
     * @param {function(any)} listener Handler for the event
     */
    listen(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(listener);
    }

    /**
     * remove a listenner from a particular event
     * @param {string} event Name of the event
     * @param {function(any)} listener reference to the handler of the event
     */
    unlisten(event, listener) {
        if (!this.listeners.has(event)) {
            return;
        }
        this.listeners.get(event).delete(listener);
    }

    /**
     * Clear all of the listeners of a particular event. If nothing is specified then all listeners will be cleared
     * @param {string} [event] 
     */
    clear(event) {
        if (!event) {
            this.listeners.clear();
        } else {
            this.listeners.get(event).clear();
        }
    }

}

const TouchDrag = new EventEmitter();
/**
 * @typedef {{
    identifier: 0,
    startedAt: {
        x: 0,
        y: 0
    },
    movedTo: {
        x: 0,
        y: 0
    },
    timestamps: {
        start: 0,
        current: 0
    },
    distance: 0
}} DragEvent
 */
const pressedPositions = new Map();
const DragEvent = {
    identifier: 0,
    startedAt: {
        x: 0,
        y: 0
    },
    movedTo: {
        x: 0,
        y: 0
    },
    timestamps: {
        start: 0,
        current: 0
    },
    distance: 0
};
const {sqrt, pow, round} = Math;

function euclideanDistance(x1, y1, x2, y2) {
    return sqrt( pow(x1 - x2, 2) + pow(y1 - y2, 2) );
}

/**
 * 
 * @param {TouchEvent} event 
 */
function touchStart(event) {
    for (let touch of event.changedTouches) {
        const { identifier, clientX, clientY } = touch;
        pressedPositions.set(identifier, [clientX, clientY, Date.now()]);
    }
}

/**
 * 
 * @param {TouchEvent} event 
 */
function touchMove(event) {
    for (let touch of event.changedTouches) {
        const {identifier, clientX, clientY } = touch;
        if (pressedPositions.has(identifier)) {
            const [prevX, prevY, prevTime] = pressedPositions.get(identifier);
            DragEvent.identifier = identifier;
            DragEvent.startedAt.x = prevX;
            DragEvent.startedAt.y = prevY;
            DragEvent.movedTo.x = clientX;
            DragEvent.movedTo.y = clientY;
            DragEvent.timestamps.start = prevTime;
            DragEvent.timestamps.current = Date.now();
            DragEvent.distance = round( euclideanDistance(prevX, prevY, clientX, clientY) );
            TouchDrag.emit("drag", DragEvent);
        }
    }
}

/**
 * 
 * @param {TouchEvent} event 
 */
function touchEnd(event) {
    for (let touch of event.changedTouches) {
        pressedPositions.delete(touch.identifier);
    }
}

/**
 * 
 * @param {TouchEvent} event 
 */
function touchCancel(event) {
    for (let touch of event.changedTouches) {
        pressedPositions.delete(touch.identifier);
    }
}

document.addEventListener("touchstart", touchStart);
document.addEventListener("touchmove", touchMove);
document.addEventListener("touchend", touchEnd);
document.addEventListener("touchcancel", touchCancel);

export default TouchDrag;