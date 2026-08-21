import { Store } from "../utils/store.js";

export class GameRepository {
    constructor() {
        this.storageKey = 'games';
    }

    getAll() {
        return Store.get(this.storageKey, []);
    }
    
    save(userId, game) {
        const games = this.getAll();
        const existingGameIndex = games.findIndex(g => g.userId === userId);

        if (existingGameIndex !== -1) {
            games[existingGameIndex].history.push(game);
        } else {
            games.push({userId, history: [game]});
        }

        Store.save(this.storageKey, games);
    }

    getById(userId) {
        const games = this.getAll();
        return games.find(g => g.userId === userId);
    }
}
