import {Event} from './Event.js';

export class EventBus {
    constructor() {
        this.listeners = {};
    }

    publish(eventName, eventData) {
        const eventListeners = this.listeners[eventName];
        if (eventListeners) {
            eventListeners.forEach((listener) => {
                listener(new Event(eventName, eventData));
            });
        }
    }

    subscribe(eventName, listener) {
        let eventListeners = this.listeners[eventName];
        if (eventListeners && !eventListeners.includes(listener)) {
            eventListeners.push(listener);
        } else {
            eventListeners = this.listeners[eventName] = [listener];
        }
        return {
            unsubscribe() {
                eventListeners = eventListeners.filter((l) => l !== listener);
            }
        };
    }
}
