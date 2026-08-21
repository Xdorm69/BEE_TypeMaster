export class Store {

    static save(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save data for key "${key}"`, error);
        }
        return value;
    }

    // `defaultValue` lets each caller decide what "nothing stored yet" means:
    // repositories that hold lists want [], AuthRepository (single object) wants null.
    static get(key, defaultValue = null) {
        const data = localStorage.getItem(key);

        if (data === null) {
            return defaultValue;
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error(`Failed to parse stored data for key "${key}"`, error);
            return defaultValue;
        }
    }

    static remove(key) {
        localStorage.removeItem(key);
    }
}