import { Store } from "../utils/store.js";

export class AuthRepository {
    constructor () {
        this.storageKey = "CurrentUser";
    }

    setCurrentUser(user) {
        Store.save(this.storageKey, user);
    }

    getCurrentUser() {
        return Store.get(this.storageKey, null);
    }

    clearCurrentUser() {
        Store.remove(this.storageKey);
    }

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
}
