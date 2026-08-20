export class Store {

    static save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
    }

    static get(key) {
        const data = localStorage.getItem(key);

        if (data === null) {
            return [];
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error(`Failed to parse stored data for key "${key}"`, error);
            return [];
        }
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
}