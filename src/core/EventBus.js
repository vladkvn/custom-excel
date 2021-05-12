export class EventBus {
    constructor() {
        this.listeners = {};
    }

    publish(eventName, eventData) {
        const eventListeners = this.listeners[eventName];
        if (eventListeners) {
            eventListeners.forEach((listener) => {
                listener.listen(new Event(eventName, eventData));
            });
        }
    }

    subscribe(eventName, listener) {
        const eventListeners = this.listeners[eventName];
        if (eventListeners) {
            !eventListeners.includes(listener) ? eventListeners.push(listener) : undefined;
        } else {
            this.listeners[eventName] = [listener];
        }
        console.log(`listener added: {name:${eventName}, listener:`, listener);
    }
}

class Event {
    constructor(name, data) {
        this.name = name;
        this.data = data;
    }
}
