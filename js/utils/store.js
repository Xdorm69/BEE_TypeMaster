export class Store {
    static save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    static get(key) {
        return localStorage.getItem(key);
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
}
