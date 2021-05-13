import './scss/index.scss';

// eslint-disable-next-line no-extend-native
Array.prototype.remove = function() {
    // eslint-disable-next-line prefer-rest-params
    let what; const a = arguments; let L = a.length; let ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
