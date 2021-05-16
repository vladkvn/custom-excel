import {isEqual} from '../utils';

export class StoreSubscriber {
    constructor(store) {
        this.store = store;
        this.sub = null;
        this.prevState = {};
    }

    subscribeComponents(components) {
        this.sub = this.store.subscribe((state) => {
            Object.keys(state).forEach((key) => {
                if (!isEqual(this.prevState[key], state[key])) {
                    components.forEach((component) => {
                        if (component.isWatching(key)) {
                            component.renderState(state, key);
                        }
                    });
                }
            });

            this.prevState = JSON.parse(JSON.stringify(this.store.getState()));
        });
    }

    unsubscribeFromStore() {
        this.sub.unsubscribe();
    }
}
