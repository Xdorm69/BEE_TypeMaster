import { Store } from "../utils/store.js";

export class HistoryRepository {
    constructor() {
        this.storageKey = "History";
    }

    getRecent(limit) {
        const history = Store.get(this.storageKey) || [];
        if (!limit) return history;
        
        return history.slice(0, limit);
    }

    add(scoreDTO) {
        const history = Store.get(this.storageKey) || [];
        history.unshift(scoreDTO); //append to start of array
        Store.save(this.storageKey, history);
        return history;
    }
}
