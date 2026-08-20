import { Store } from "../utils/store.js";

export class HighscoreRepository {

    constructor () {
        this.storageKey = "highscore";
    }

    getAll() {
        return Store.get(this.storageKey);
    }
    
    save(scoreDTO) {
        const highscores = this.getAll();
        highscores.push(scoreDTO);
        Store.save(this.storageKey, highscores);
    }
    
    update(userId, paragraphId, highscoreDTO) {
        const highscores = this.getAll();
        const userHighscores = highscores.find(h => h.userId === userId);

        if (userHighscores) {
            userHighscores.paragraphs[paragraphId] = highscoreDTO;
        }

        Store.save(this.storageKey, highscores);
    }
    
    getByUserId(userId) {
        const highscores = this.getAll();
        return highscores.find(highscore => highscore.userId === userId);
    }
}
