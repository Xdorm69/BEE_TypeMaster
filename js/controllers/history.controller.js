export class HistoryController {
    constructor(refs, historyService) {
        this.refs = refs;
        this.historyService = historyService;
    }

    init() {
        const data = this.historyService.getRecent();

        if (!data.history || data.history.length === 0) {
            this.refs.historyBody.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty__icon">⌨</div>
                    <h3>No races yet</h3>
                    <p>Complete your first typing race and your results will appear here.</p>
                    <a href="/index.html" class="history-empty__button">
                        Start Typing →
                    </a>
                </div>
            `;

            return;
        }

        const totalGames = data.totalGames;
        const bestWpm = data.bestWpm;
        const averageWpm = data.averageWpm;
        const averageAccuracy = data.averageAccuracy;

        this.refs.historyBody.innerHTML = `
            <div class="history-stats">
                <div class="stat-card">
                    <span class="stat-card__label">Games</span>
                    <strong class="stat-card__value">
                        ${totalGames}
                    </strong>
                </div>

                <div class="stat-card">
                    <span class="stat-card__label">Best WPM</span>
                    <strong class="stat-card__value stat-card__value--accent">
                        ${bestWpm}
                    </strong>
                </div>

                <div class="stat-card">
                    <span class="stat-card__label">Average WPM</span>
                    <strong class="stat-card__value">
                        ${averageWpm.toFixed(1)}
                    </strong>
                </div>

                <div class="stat-card">
                    <span class="stat-card__label">Avg. Accuracy</span>
                    <strong class="stat-card__value">
                        ${averageAccuracy.toFixed(1)}%
                    </strong>
                </div>
            </div>

            <div class="history-table">
                <div class="history-table__header">
                    <span>#</span>
                    <span>Difficulty</span>
                    <span>WPM</span>
                    <span>Accuracy</span>
                    <span>Correct</span>
                    <span>Incorrect</span>
                    <span>Time</span>
                    <span>Played At</span>
                </div>

                ${data.history.map((item, index) => `
                    <div class="history-row">

                        <span class="history-number">
                            ${totalGames - index}
                        </span>

                        <span>
                            <span class="difficulty difficulty--${String(item.difficulty).toLowerCase()}">
                                ${item.difficulty}
                            </span>
                        </span>

                        <span class="history-wpm">
                            ${item.wpm}
                        </span>

                        <span class="history-accuracy">
                            ${item.accuracy}%
                        </span>

                        <span class="history-correct">
                            ${item.correct}
                        </span>

                        <span class="history-incorrect">
                            ${item.incorrect}
                        </span>

                        <span class="history-time">
                            ${Number(item.time).toFixed(2)}s
                        </span>

                        <span class="history-played-at">
                            ${new Date(item.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>

                    </div>
                `).join("")}
            </div>
        `;
    }
}