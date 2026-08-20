export class Store {
    static save(key, value) {
        const data = localStorage.setItem(key, JSON.stringify(value));
        return JSON.parse(data) || [];
    }
    static get(key) {
        return localStorage.getItem(key);
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
}
