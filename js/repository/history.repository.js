import { Store } from "../utils/store.js";

export class HistoryRepository {
    constructor() {
        this.storageKey = "History";
    }

    getAll() {
        return Store.get(this.storageKey) || [];
    }

    getByUserId(userId, limit) {
        const allHistory = this.getAll();
        const data = allHistory.find((item) => item.userId === userId);
        
        if (!limit) return data?.history;

        return data?.history.slice(0, limit);
    }

    add(userId, scoreDTO) {
        //make the model somewhat like
        /*
        [
            userId: "user123",
            history: [
                {
                    wpm: 120,
                    accuracy: 95,
                    time: 120,
                    date: "2025-10-14T12:00:00Z"
                }
            ]
        ]

        and update only at userId match or make new if absent
        */

        const allHistory = this.getAll();
        //find existing record if any;
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
        
        return allHistory[existingRecordIndex]?.history || allHistory[allHistory.length - 1].history;
    }
}
