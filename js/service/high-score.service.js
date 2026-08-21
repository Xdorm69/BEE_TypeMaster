import { ScoreValidator } from "../validators/score.validator.js";

export class HighScoreService {
    constructor(repository, authService) {
        this.repository = repository;
        this.authService = authService;
    }

    async create(scoreDTO) {
        ScoreValidator.score(scoreDTO);

        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) throw new Error("Must be logged in to save a high score");

        return this.repository.save(currentUser.id, scoreDTO);
    }

    async getAll() {
        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) return [];

        return this.repository.getByUserId(currentUser.id);
    }

    async getBestByParagraphId(paragraphId) {
        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) return null;

        return this.repository.getBestByParagraphId(currentUser.id, paragraphId);
    }
}
