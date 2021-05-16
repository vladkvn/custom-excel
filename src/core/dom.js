class Dom {
    constructor(selector) {
        this.$el = typeof selector === 'string' ?
            document.querySelector(selector) :
            selector;
    }

    html(html) {
        if (typeof html === 'string') {
            this.$el.innerHTML = html;
            return this;
        }
        return this.$el.outerHTML.trim();
    }

    clear() {
        this.html('');
        return this;
    }

    removeClass(className) {
        this.$el.classList.remove(className);
        return this;
    }

    on(eventType, callback) {
        this.$el.addEventListener(eventType, callback);
        return this;
    }

    off(eventType, callback) {
        this.$el.removeEventListener(eventType, callback);
        return this;
    }

    removeChild(child) {
        if (child instanceof Dom) {
            child = child.$el;
        }
        this.$el.removeChild(child);
    }

    addClass(classes) {
        this.$el.classList.add(classes);
        return this;
    }


    append(node) {
        if (node instanceof Dom) {
            node = node.$el;
        }

        if (Element.prototype.append) {
            this.$el.append(node);
        } else {
            this.$el.appendChild(node);
        }

        return this;
    }

    css(style = {}) {
        Object.keys(style).forEach((key)=>{
            try {
                this.$el.style[key] = style[key];
                // eslint-disable-next-line no-empty
            } catch (_) {}
        });
        return this;
    }
}

// event.target
export function $(selector, all=true) {
    return new Dom(selector, all);
}

$.create = (tagName, classes = '') => {
    const el = document.createElement(tagName);
    if (classes) {
        el.classList.add(classes);
    }
    return $(el);
};


$.all = (selector) => {
    const result = [];
    document.querySelectorAll(selector).forEach((foundElement)=>{
        result.push($(foundElement));
    });
    return result;
};
