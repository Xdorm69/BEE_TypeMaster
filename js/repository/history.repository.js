import { Store } from "../utils/store.js";

export class HistoryRepository {
    constructor() {
        this.storageKey = "History";
    }

    getAll() {
        return Store.get(this.storageKey, []);
    }

    getByUserId(userId, limit) {
        const allHistory = this.getAll();

        const record = allHistory.find((item) => item.userId === userId);
        const history = record ? record.history : [];

        if (!limit) return history;

        return history.slice(0, limit);
    }

    add(userId, scoreDTO) {
        // model:
        // [
        //   {
        //     userId: "user123",
        //     history: [
        //       { wpm: 120, accuracy: 95, time: 120, date: "2025-10-14T12:00:00Z" }
        //     ]
        //   }
        // ]
        // update only at userId match or make new if absent

        const allHistory = this.getAll();
        const existingRecordIndex = allHistory.findIndex((item) => item.userId === userId);

        if (existingRecordIndex !== -1) {
            allHistory[existingRecordIndex].history.unshift(scoreDTO);
        } else {
            allHistory.push({
                userId: userId,
                history: [scoreDTO]
            });
        }

        Store.save(this.storageKey, allHistory);

        return allHistory.find((item) => item.userId === userId);
    }
}
