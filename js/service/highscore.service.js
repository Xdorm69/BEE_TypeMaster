import { ScoreValidator } from "../validators/score.validator.js";

export class HighScoreService {
    constructor(repository) {
        this.repository = repository;
    }

    create(scoreDTO) {
        ScoreValidator.score(scoreDTO);

        return this.repository.save(scoreDTO);
    }

    getAll() {
        return this.repository.getAll();
    }

    getBestByParagraphId(paragraphId) {
        return this.repository.getBestByParagraphId(paragraphId);
    }
}