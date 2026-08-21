import { ScoreValidator } from "../validators/score.validator.js";

export class HistoryService {
    constructor(historyRepository, authService) {
        this.historyRepository = historyRepository;
        this.authService = authService;
    }

    async getRecent() {
        const currentUser = await this.authService.getCurrentUser();
        
        if (!currentUser) throw new Error("History of unatuenticated is not available");
        
        // tops 
        const history = this.historyRepository.getByUserId(currentUser.id);

        //explicit properties to add 
        // totalGames 
        const totalGames = history.length;

        //best wpm
        const bestWpm = Math.max(...history.map(item => item.wpm));

        //average wpm
        const averageWpm = history.reduce((acc, item) => acc + item.wpm, 0) / totalGames;

        //average accuracy
        const averageAccuracy = history.reduce((acc, item) => acc + item.accuracy, 0) / totalGames;

        //average correct
        const averageCorrect = history.reduce((acc, item) => acc + item.correct, 0) / totalGames;

        //average incorrect
        const averageIncorrect = history.reduce((acc, item) => acc + item.incorrect, 0) / totalGames;

        //average time
        const averageTime = history.reduce((acc, item) => acc + item.time, 0) / totalGames;

        const data = {
            totalGames,
            bestWpm,
            averageWpm,
            averageAccuracy,
            averageCorrect,
            averageIncorrect,
            averageTime,
            history,
        }

        return data;
    }

    async add(userId, scoreDTO) {
        ScoreValidator.score(scoreDTO);

        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) throw new Error("History of unatuenticated is not available");
        
        const history = this.historyRepository.add(userId, scoreDTO);
        return history;
    }
}