import { Store } from "../utils/store.js";

export class HighScoreRepository {

    constructor() {
        this.storageKey = "Highscore";
    }

    getAll() {
        return Store.get(this.storageKey);
    }

    save(scoreDTO) {
        const highscores = this.getAll();

        const existingIndex = highscores.findIndex(
            score => score.paragraphId === scoreDTO.paragraphId
        );

        // No score exists for this paragraph yet
        if (existingIndex === -1) {
            highscores.push(scoreDTO);
            Store.save(this.storageKey, highscores);
            return scoreDTO;
        }

        const existingScore = highscores[existingIndex];

        // Only keep the better WPM
        if (scoreDTO.wpm > existingScore.wpm) {
            highscores[existingIndex] = scoreDTO;

            Store.save(this.storageKey, highscores);

            return scoreDTO;
        }

        // Existing score is already better
        return existingScore;
    }

    getBestByParagraphId(paragraphId) {
        return this.getAll().find(
            score => score.paragraphId === paragraphId
        ) || null;
    }

    update(userId, paragraphId, highscoreDTO) {
        const highscores = this.getAll();

        const userHighscores = highscores.find(
            highscore => highscore.userId === userId
        );

        if (!userHighscores) {
            return null;
        }

        userHighscores.paragraphs[paragraphId] = highscoreDTO;

        Store.save(this.storageKey, highscores);

        return highscoreDTO;
    }

    getByUserId(userId) {
        return this.getAll().find(
            highscore => highscore.userId === userId
        ) || null;
    }
}