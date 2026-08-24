const DIFFICULTIES = ["All", "Easy", "Medium", "Hard", "Expert"];
const MEDALS = ["🥇", "🥈", "🥉"];

export class LeaderboardController {
    /*
      @param {Object} refs - DOM element references
      @param {Object} leaderboardService - LeaderboardService instance
      @param {Object} authService - AuthService instance
    */

    constructor(refs, leaderboardService, authService) {
        this.refs = refs;
        this.leaderboardService = leaderboardService;
        this.authService = authService;

        this.activeDifficulty = "All";

        this._onTabClick =
            this._onTabClick.bind(this);
    }

    async init() {
        this._renderTabs();
        await this._render();
    }

    _renderTabs() {
        this.refs.tabs.innerHTML = DIFFICULTIES.map(difficulty => `
            <button
                type="button"
                class="leaderboard-tab ${difficulty === this.activeDifficulty ? "active" : ""}"
                data-difficulty="${difficulty}"
            >
                ${difficulty}
            </button>
        `).join("");

        this.refs.tabs
            .querySelectorAll(".leaderboard-tab")
            .forEach(tab => tab.addEventListener("click", this._onTabClick));
    }

    async _onTabClick(event) {
        this.activeDifficulty =
            event.currentTarget.dataset.difficulty;

        this._renderTabs();
        await this._render();
    }

    async _render() {
        const difficulty =
            this.activeDifficulty === "All" ? null : this.activeDifficulty;

        const [leaderboard, currentUser] = await Promise.all([
            this.leaderboardService.getGlobalLeaderboard({ difficulty }),
            this.authService.getCurrentUser()
        ]);

        this._renderMyRank(leaderboard, currentUser, difficulty);

        if (leaderboard.length === 0) {
            this.refs.leaderboardBody.innerHTML = `
                <div class="leaderboard-empty">
                    <div class="leaderboard-empty__icon">🐝</div>
                    <h3>The hive is quiet</h3>
                    <p>No races logged yet for this difficulty. Be the first!</p>
                    <a href="/index.html" class="leaderboard-empty__button">
                        Start Typing →
                    </a>
                </div>
            `;
            return;
        }

        const podium = leaderboard.slice(0, 3);
        const rest = leaderboard.slice(3);

        this.refs.leaderboardBody.innerHTML = `
            ${this._renderPodium(podium, currentUser)}
            ${this._renderTable(rest, currentUser)}
        `;
    }

    _renderMyRank(leaderboard, currentUser, difficulty) {
        if (!this.refs.myRank) {
            return;
        }

        if (!currentUser) {
            this.refs.myRank.innerHTML = `
                <p class="my-rank__message">
                    <a href="/html/auth.html">Log in</a> to see where you stand in the hive.
                </p>
            `;
            return;
        }

        const entry =
            leaderboard.find(item => item.userId === currentUser.id);

        if (!entry) {
            this.refs.myRank.innerHTML = `
                <p class="my-rank__message">
                    You haven't set a score${difficulty ? ` on ${difficulty}` : ""} yet.
                    <a href="/index.html">Start typing →</a>
                </p>
            `;
            return;
        }

        this.refs.myRank.innerHTML = `
            <div class="my-rank__badge">
                <span class="my-rank__label">Your Rank</span>
                <strong class="my-rank__value">#${entry.rank}</strong>
            </div>

            <div class="my-rank__stats">
                <span>${entry.wpm} WPM</span>
                <span>${entry.accuracy}% accuracy</span>
            </div>
        `;
    }

    _renderPodium(podium, currentUser) {
        if (podium.length === 0) {
            return "";
        }

        // Classic podium ordering: 2nd, 1st, 3rd — guard for fewer than 3 entries.
        const order = [1, 0, 2].filter(index => podium[index]);

        return `
            <div class="podium">
                ${order.map(index => {
                    const entry = podium[index];
                    const isMe =
                        currentUser && entry.userId === currentUser.id;

                    return `
                        <div class="podium-spot podium-spot--${index + 1} ${isMe ? "podium-spot--me" : ""}">
                            <span class="podium-medal">${MEDALS[index]}</span>

                            <img
                                class="podium-avatar"
                                src="${entry.avatarUrl || "/assets/default-avatar.png"}"
                                alt="${entry.username}"
                            >

                            <span class="podium-name">${entry.username}</span>
                            <span class="podium-wpm">${entry.wpm} WPM</span>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }

    _renderTable(entries, currentUser) {
        if (entries.length === 0) {
            return "";
        }

        return `
            <div class="leaderboard-table">
                <div class="leaderboard-table__header">
                    <span>Rank</span>
                    <span>Bee</span>
                    <span>WPM</span>
                    <span>Accuracy</span>
                    <span>Difficulty</span>
                </div>

                ${entries.map(entry => {
                    const isMe =
                        currentUser && entry.userId === currentUser.id;

                    return `
                        <div class="leaderboard-row ${isMe ? "leaderboard-row--me" : ""}">
                            <span class="leaderboard-rank">#${entry.rank}</span>

                            <span class="leaderboard-user">
                                <img
                                    class="leaderboard-avatar"
                                    src="${entry.avatarUrl || "/assets/default-avatar.png"}"
                                    alt="${entry.username}"
                                >
                                ${entry.username}${isMe ? " <span class=\"you-tag\">you</span>" : ""}
                            </span>

                            <span class="leaderboard-wpm">${entry.wpm}</span>
                            <span class="leaderboard-accuracy">${entry.accuracy}%</span>

                            <span>
                                <span class="difficulty difficulty--${String(entry.difficulty).toLowerCase()}">
                                    ${entry.difficulty}
                                </span>
                            </span>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
    }
}
