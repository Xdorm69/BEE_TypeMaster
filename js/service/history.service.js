import { ScoreValidator } from "../validators/score.validator.js";

export class HistoryService {
    constructor(historyRepository, authService) {
        this.historyRepository = historyRepository;
        this.authService = authService;
    }

    async getRecent() {
        const currentUser = await this.authService.getCurrentUser();

        if (!currentUser) throw new Error("History of unauthenticated user is not available");

        const history = this.historyRepository.getByUserId(currentUser.id);

        const totalGames = history.length;

        // Guard against an empty history so we don't hand back
        // Math.max() === -Infinity or 0/0 === NaN to the UI.
        if (totalGames === 0) {
            return {
                totalGames: 0,
                bestWpm: 0,
                averageWpm: 0,
                averageAccuracy: 0,
                averageCorrect: 0,
                averageIncorrect: 0,
                averageTime: 0,
                history: [],
            };
        }

        const bestWpm = Math.max(...history.map(item => item.wpm));
        const averageWpm = history.reduce((acc, item) => acc + item.wpm, 0) / totalGames;
        const averageAccuracy = history.reduce((acc, item) => acc + item.accuracy, 0) / totalGames;
        const averageCorrect = history.reduce((acc, item) => acc + item.correct, 0) / totalGames;
        const averageIncorrect = history.reduce((acc, item) => acc + item.incorrect, 0) / totalGames;
        const averageTime = history.reduce((acc, item) => acc + item.time, 0) / totalGames;

        return {
            totalGames,
            bestWpm,
            averageWpm,
            averageAccuracy,
            averageCorrect,
            averageIncorrect,
            averageTime,
            history,
        };
    }

    async add(scoreDTO) {
        ScoreValidator.score(scoreDTO);

        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) throw new Error("Must be logged in to save history");

        return this.historyRepository.add(currentUser.id, scoreDTO);
    }
}
