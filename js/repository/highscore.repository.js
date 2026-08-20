import { Store } from "../utils/store";

export class HighscoreRepository {

    constructor () {
        this.storageKey = "highscore";
    }

    getAll() {
        let highscores = Store.get(this.storageKey);
        highscores = highscores ? JSON.parse(highscores) : [];
        return highscores;
    }
    
    save(highscoreDTO) {
        const highscores = this.getAll();
        highscores.push(highscoreDTO);
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
