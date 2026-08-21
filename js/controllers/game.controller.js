import { ScoreDTO } from "../model/score.model.js";

const PROGRESS_CELL_COUNT = 24;

export class GameController {
    /*
      @param {Object} refs - DOM element references
      @param {Object} gameService - Game service instance
      @param {Object} scoreService - Score service instance
      @param {Object} historyService - History service instance
    */

    constructor(refs, gameService, scoreService, historyService) {
        this.refs = refs;
        this.gameService = gameService;
        this.scoreService = scoreService;
        this.historyService = historyService;

        this.chars = [];

        this._onKeydown =
            this._onKeydown.bind(this);

        this._onNextRun =
            this._onNextRun.bind(this);

        this._buildProgressCells();
    }

    start() {
        document.addEventListener(
            "keydown",
            this._onKeydown
        );

        this.refs.nextRunBtn.addEventListener(
            "click",
            this._onNextRun
        );

        this.loadNextParagraph();
    }

    loadNextParagraph() {
        this._hideResults();

        this.gameService.reset();

        const state =
            this.gameService.startGame();

        this._renderGame(state);
    }

    _renderGame(state) {
        this.chars = [];

        this.refs.difficultyChip.textContent =
            state.difficulty;

        this.refs.gameDescription.textContent =
            "Press any key to start the game";

        this._renderChars(state.text);
        this._updateLiveStats(state);
        this._updateProgress(state);
    }

    _renderChars(text) {
        this.refs.gameBody.innerHTML = "";

        [...text].forEach((char) => {

            const span =
                document.createElement("span");

            span.textContent = char;

            this.refs.gameBody.appendChild(span);

            this.chars.push({
                value: char,
                element: span
            });
        });

        if (this.chars.length > 0) {
            this.chars[0]
                .element
                .classList
                .add("current");
        }
    }

    _buildProgressCells() {
        this._progressCells = [];

        for (
            let i = 0;
            i < PROGRESS_CELL_COUNT;
            i++
        ) {
            const cell =
                document.createElement("span");

            cell.className = "progress-cell";

            this.refs.progressTrail.insertBefore(
                cell,
                this.refs.progressBee
            );

            this._progressCells.push(cell);
        }
    }

    _updateProgress(state) {
        const percent = state.progress;

        const filledCount =
            Math.round(
                percent * PROGRESS_CELL_COUNT
            );

        this._progressCells.forEach(
            (cell, index) => {
                cell.classList.toggle(
                    "filled",
                    index < filledCount
                );
            }
        );

        this.refs.progressBee.style.left =
            `${percent * 100}%`;
    }

    _updateLiveStats(state) {
        this.refs.liveWpm.textContent =
            state.wpm;

        this.refs.liveAccuracy.textContent =
            `${state.accuracy}%`;

        this.refs.liveErrors.textContent =
            state.incorrectChars;
    }

    _onKeydown(event) {

        if (event.key === "Enter") {
            this._handleEnter();
            return;
        }

        if (event.key === "Backspace") {
            this._handleBackspace();
            return;
        }

        if (event.key.length !== 1) {
            return;
        }

        this._handleCharacter(event.key);
    }

    _handleEnter() {
        if (
            this.refs.resultsOverlay
                .classList
                .contains("visible")
        ) {
            this.loadNextParagraph();
        }
    }

    _handleCharacter(character) {

        const state =
            this.gameService.getState();

        if (!state.started) {
            this.gameService.startTyping();

            this.refs.gameDescription.textContent =
                "Keep typing...";
        }

        const result =
            this.gameService.handleCharacter(
                character
            );

        if (!result) {
            return;
        }

        const current =
            this.chars[result.index];

        if (!current) {
            return;
        }

        if (result.correct) {
            current.element.classList.add(
                "correct"
            );
        } else {
            current.element.classList.add(
                "incorrect"
            );
        }

        current.element.classList.remove(
            "current"
        );

        const updatedState =
            this.gameService.getState();

        this._updateLiveStats(updatedState);
        this._updateProgress(updatedState);

        if (
            this.gameService.isComplete()
        ) {
            this._finish();
            return;
        }

        this.chars[
            updatedState.currentIdx
        ]?.element.classList.add("current");
    }

    _handleBackspace() {
        const currentIndex =
            this.gameService.getState().currentIdx - 1;

        if (currentIndex < 0) {
            return;
        }

        const character =
            this.chars[currentIndex];

        if (!character) {
            return;
        }

        const result =
            this.gameService.handleBackspace();

        if (!result) {
            return;
        }

        character.element.classList.remove("correct");
        character.element.classList.remove("incorrect");
        character.element.classList.add("current");

        const state =
            this.gameService.getState();

        this._updateLiveStats(state);
        this._updateProgress(state);
    }

    _finish() {

        const scoreDTO =
            this.gameService.finish();

        const isNewHighScore =
            this._isNewHighScore(
                scoreDTO.getWpm()
            );

        try {
            this.scoreService.create(
                scoreDTO
            );
        } catch (error) {
            console.error("Failed to save score:", error);
        }

        try {
            this.historyService.add(
                scoreDTO
            );
        } catch (error) {
            console.error("Failed to save history:", error);
        }

        this._renderResults(
            scoreDTO,
            isNewHighScore
        );
    }

    _renderResults(
        scoreDTO,
        isNewHighScore
    ) {
        const wpm =
            scoreDTO.getWpm();

        const accuracy =
            scoreDTO.getAccuracy();

        this.refs.resultsDifficulty.textContent =
            `${scoreDTO.getDifficulty()} hive cleared`;

        this.refs.resultWpm.textContent =
            wpm;

        this.refs.resultAccuracy.textContent =
            `${accuracy}%`;

        this.refs.resultCorrect.textContent =
            scoreDTO.getCorrect();

        this.refs.resultIncorrect.textContent =
            scoreDTO.getIncorrect();

        const highScores =
            this._getHighScores();

        const bestScore =
            highScores.find(
                item =>
                    item.paragraphId ===
                    scoreDTO.getParagraphId()
            );

        this.refs.resultBestScore.textContent =
            bestScore
                ? bestScore.wpm
                : wpm;

        this.refs.resultWpm.classList.toggle(
            "new-highscore",
            isNewHighScore
        );

        this._showResults();
    }

    _isNewHighScore(wpm) {

        const highScores =
            this._getHighScores();

        const existingEntry =
            highScores.find(
                item =>
                    item.paragraphId ===
                    this.gameService
                        .getState()
                        .paragraphId
            );

        if (!existingEntry) {
            return true;
        }

        return wpm > existingEntry.wpm;
    }

    _getHighScores() {
        try {
            return this.scoreService.getAll();
        } catch (error) {
            console.error(
                "Error getting high scores:",
                error
            );

            return [];
        }
    }

    _onNextRun() {
        this.loadNextParagraph();
    }

    _showResults() {
        this.refs.resultsOverlay
            .classList
            .add("visible");
    }

    _hideResults() {
        this.refs.resultsOverlay
            .classList
            .remove("visible");
    }
}