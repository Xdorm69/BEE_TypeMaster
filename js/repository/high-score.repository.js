import { Store } from "../utils/store.js";

export class HighScoreRepository {

    constructor() {
        this.storageKey = "Highscore";
    }

    getAll() {
        return Store.get(this.storageKey);
    }

    getByUserId(userId) {
        const record = this.getAll().find(
            highscore => highscore.userId === userId
        )

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
            record = {userId, scores: []};
            all.push(record);
        }

        const existingIndex = record.scores.findIndex(
            score => score.paragraphId === scoreDTO.getParagraphId()
        );

        if (existingIndex === -1) {
            record.scores.push(scoreDTO);
            Store.save(this.storageKey, all);
            return scoreDTO;
        }

        const exisitingScore = record.scores[existingIndex];

        //only keep better wpm
        if (scoreDTO.getWpm() > exisitingScore.wpm) {
            record.scores[existingIndex] = scoreDTO;
            Store.save(this.storageKey, all);
            return scoreDTO;
        }
        
        return exisitingScore;
    }

}