export default class DrawRect {
    #enabled = false;
    set enabled(val) {
        this.#enabled = val;
    }
    get enabled() {
        return this.#enabled;
    }
    static enabledCallback = () => {
        this.enabled = true;
    }
    static disabled = () => {
        this.enabled = false;
    }
} 