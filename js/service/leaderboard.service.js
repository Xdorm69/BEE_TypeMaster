export class LeaderboardService {
    /*
      @param {Object} highScoreRepository - HighScoreRepository instance
      @param {Object} userRepository - UserRepository instance
      @param {Object} authService - AuthService instance
    */

    constructor(highScoreRepository, userRepository, authService) {
        this.highScoreRepository = highScoreRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    // Ranked list of every user's personal-best WPM, optionally scoped
    // to a single difficulty. { difficulty: null } means "All".
    async getGlobalLeaderboard({ difficulty = null, limit = 50 } = {}) {
        const records = this.highScoreRepository.getAll();

        const entries = records
            .map(record => this._bestEntryForUser(record, difficulty))
            .filter(entry => entry !== null);

        entries.sort(this._compareEntries);

        entries.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        return limit ? entries.slice(0, limit) : entries;
    }

    // Where the logged-in user currently sits on a given leaderboard,
    // even if they're outside the visible `limit`. Null if logged out
    // or if they have no score yet for that difficulty.
    async getMyRank({ difficulty = null } = {}) {
        const currentUser = await this.authService.getCurrentUser();

        if (!currentUser) {
            return null;
        }

        const fullLeaderboard = await this.getGlobalLeaderboard({
            difficulty,
            limit: null
        });

        return fullLeaderboard.find(
            entry => entry.userId === currentUser.id
        ) || null;
    }

    _bestEntryForUser(record, difficulty) {
        const scores = difficulty
            ? record.scores.filter(score => score.difficulty === difficulty)
            : record.scores;

        if (!scores || scores.length === 0) {
            return null;
        }

        const best = scores.reduce(
            (top, score) => (score.wpm > top.wpm ? score : top)
        );

        const user = this.userRepository.getById(record.userId);

        return {
            userId: record.userId,
            username: user ? user.username : "Unknown Bee",
            avatarUrl: user ? user.avatarUrl : null,
            wpm: best.wpm,
            accuracy: best.accuracy,
            difficulty: best.difficulty,
            date: best.date
        };
    }

    _compareEntries(a, b) {
        if (b.wpm !== a.wpm) {
            return b.wpm - a.wpm;
        }

        // Tie-break on accuracy so identical WPMs don't feel arbitrary.
        return b.accuracy - a.accuracy;
    }
}
