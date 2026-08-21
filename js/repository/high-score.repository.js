import { Store } from "../utils/store.js";

export class HighScoreRepository {

    constructor() {
        this.storageKey = "Highscore";
    }

    // model:
    // [
    //   { userId: "user123", scores: [ { paragraphId, wpm, ... }, ... ] }
    // ]

    getAll() {
        return Store.get(this.storageKey, []);
    }

    getByUserId(userId) {
        const record = this.getAll().find(r => r.userId === userId);
        return record ? record.scores : [];
    }

    getBestByParagraphId(userId, paragraphId) {
        const scores = this.getByUserId(userId);
        return scores.find(score => score.paragraphId === paragraphId) || null;
    }

    save(userId, scoreDTO) {
        const all = this.getAll();
        let record = all.find(r => r.userId === userId);

        if (!record) {
            record = { userId, scores: [] };
            all.push(record);
        }

        const existingIndex = record.scores.findIndex(
            score => score.paragraphId === scoreDTO.paragraphId
        );

        // No score exists for this paragraph yet for this user
        if (existingIndex === -1) {
            record.scores.push(scoreDTO);
            Store.save(this.storageKey, all);
            return scoreDTO;
        }

        const existingScore = record.scores[existingIndex];

        // Only keep the better WPM
        if (scoreDTO.wpm > existingScore.wpm) {
            record.scores[existingIndex] = scoreDTO;
            Store.save(this.storageKey, all);
            return scoreDTO;
        }

        // Existing score is already better
        return existingScore;
    }
}
