export class Store {
    constructor(rootReducer, initialState = {}) {
        this.rootReducer = rootReducer;
        this.state = rootReducer({...initialState}, {type: '_INIT_'});
        this.listeners = [];
    }

    subscribe(fn) {
        this.listeners.push(fn);
        return {
            unsubscribe() {
                this.listeners = this.listeners.filter((listener) => listener !== fn);
            }
        };
    }

    dispatch(action) {
        this.state = this.rootReducer(this.state, action);
        this.listeners.forEach((listener)=>listener(this.state));
    }

    getState() {
        return this.state;
    }
}
