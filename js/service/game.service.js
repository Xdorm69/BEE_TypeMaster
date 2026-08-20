import { DEMO_TEXTS } from "../constants/texts.js";

const PROGRESS_CELL_COUNT = 24;

export class TypingGame {
  /**
   * @param {Object} refs
   */
  
  constructor(refs) {
    this.refs = refs;

    // Run state
    this.started = false;
    this.currentIdx = 0;
    this.startTime = 0;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.chars = [];
    this.text = "";
    this.paragraphId = -1;
    this.difficulty = "";

    this._buildProgressCells();
    this._onKeydown = this._onKeydown.bind(this);
  }

  start() {
    document.addEventListener("keydown", this._onKeydown);
    this.refs.nextRunBtn.addEventListener("click", () => {
      this._hideResults();
      this.loadNextParagraph();
    });
    this.loadNextParagraph();
  }

  loadNextParagraph() {
    this._resetState();

    this.paragraphId = this._pickParagraphId();
    const paragraph = this._getParagraph(this.paragraphId);
    this.text = paragraph.text;
    this.difficulty = paragraph.difficulty;

    this.refs.difficultyChip.textContent = paragraph.difficulty;
    this.refs.gameDescription.textContent = "Press any key to start the game";
    this._renderChars();
    this._updateLiveStats();
    this._updateProgress();
  }

  _getParagraph(id) {
    return DEMO_TEXTS[id];
  }
  _pickParagraphId() {
    return Math.floor(Math.random() * DEMO_TEXTS.length);
  }

  _resetState() {
    this.started = false;
    this.currentIdx = 0;
    this.startTime = 0;
    this.correctChars = 0;
    this.paragraphId = -1;
    this.incorrectChars = 0;
    this.chars = [];

    this.refs.resultWpm.classList.remove("new-highscore");
  }

  _renderChars() {
    this.refs.gameBody.innerHTML = "";

    [...this.text].forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      this.refs.gameBody.appendChild(span);
      this.chars.push({ value: char, element: span });
    });

    if (this.chars.length > 0) {
      this.chars[0].element.classList.add("current");
    }
  }

  _buildProgressCells() {
    this._progressCells = [];
    for (let i = 0; i < PROGRESS_CELL_COUNT; i++) {
      const cell = document.createElement("span");
      cell.className = "progress-cell";
      this.refs.progressTrail.insertBefore(cell, this.refs.progressBee);
      this._progressCells.push(cell);
    }
  }

  _updateProgress() {
    const total = this.chars.length || 1;
    const percent = this.currentIdx / total;
    const filledCount = Math.round(percent * PROGRESS_CELL_COUNT);

    this._progressCells.forEach((cell, i) => {
      cell.classList.toggle("filled", i < filledCount);
    });

    this.refs.progressBee.style.left = `${percent * 100}%`;
  }

  _updateLiveStats() {
    const elapsedMinutes = this.started ? (Date.now() - this.startTime) / 60000 : 0;
    const wpm = elapsedMinutes > 0 ? Math.round((this.correctChars / 5) / elapsedMinutes) : 0;
    const attempted = this.correctChars + this.incorrectChars;
    const accuracy = attempted > 0 ? Math.round((this.correctChars / attempted) * 100) : 100;

    this.refs.liveWpm.textContent = wpm;
    this.refs.liveAccuracy.textContent = `${accuracy}%`;
    this.refs.liveErrors.textContent = this.incorrectChars;
  }

  _onKeydown(e) {
    if (e.key === 'Enter') {
      if (this.refs.resultsOverlay.classList.contains("visible")) {
        this._hideResults();
        this.loadNextParagraph();
      }
      return;
    }

    if (e.key === "Backspace") {
      if (!this.started || this.currentIdx === 0) return;

      // Remove current cursor
      this.chars[this.currentIdx].element.classList.remove("current");

      // Move back to previous character
      this.currentIdx--;

      const previous = this.chars[this.currentIdx];

      // Undo the result of the previous character
      if (previous.element.classList.contains("correct")) {
          this.correctChars--;
      } else if (previous.element.classList.contains("incorrect")) {
          this.incorrectChars--;
      }

      // Remove previous result
      previous.element.classList.remove("correct");
      previous.element.classList.remove("incorrect");

      // Put cursor back
      previous.element.classList.add("current");

      this._updateLiveStats();
      this._updateProgress();

      return;
    }

    if (e.key.length !== 1) return; // ignore Shift, Enter, arrow keys, etc.

    if (!this.started) {
      this.started = true;
      this.startTime = Date.now();
      this.refs.gameDescription.textContent = "Keep typing...";
    }

    const current = this.chars[this.currentIdx];
    if (!current) return;

    if (e.key === current.value) {
      current.element.classList.add("correct");
      this.correctChars++;
    } else {
      current.element.classList.add("incorrect");
      this.incorrectChars++;
    }

    current.element.classList.remove("current");
    this.currentIdx++;

    this._updateLiveStats();
    this._updateProgress();

    if (this.currentIdx >= this.chars.length) {
      this._finish();
      return;
    }

    this.chars[this.currentIdx].element.classList.add("current");
  }


  _finish() {
    const seconds = (Date.now() - this.startTime) / 1000;

    const wpm = seconds > 0
      ? (this.correctChars / 5) / (seconds / 60)
      : 0;

    const attempted = this.correctChars + this.incorrectChars;

    const accuracy = attempted > 0
      ? (this.correctChars / attempted) * 100
      : 100;

    const score = {
      paragraphId: this.paragraphId,
      difficulty: this.difficulty,
      wpm: Math.round(wpm),
      accuracy: Math.round(accuracy),
      correct: this.correctChars,
      incorrect: this.incorrectChars
    };

    const isNewHighScore = this._isNewHighScore(score.wpm);
    this._saveScoreToLocalStorage(score);

    this.refs.resultsDifficulty.textContent = `${this.difficulty} hive cleared`;
    this.refs.resultWpm.textContent = wpm.toFixed(0);
    this.refs.resultAccuracy.textContent = `${accuracy.toFixed(0)}%`;
    this.refs.resultCorrect.textContent = this.correctChars;
    this.refs.resultIncorrect.textContent = this.incorrectChars;

    const highScores = this._getHighScoresFromLocalStorage();

    const bestScore = highScores.find(
      item => item.paragraphId === this.paragraphId
    );

    this.refs.resultBestScore.textContent = bestScore.wpm;

    this.refs.resultWpm.classList.toggle(
      "new-highscore",
      isNewHighScore
    );
    
    
    this._showResults();
  }

  _saveScoreToLocalStorage(score) {
    const highScores = this._getHighScoresFromLocalStorage();

    const existingEntry = highScores.find(
      (item) => item.paragraphId === this.paragraphId
    );

    if (existingEntry) {
      // Only replace if new score is better
      if (score.wpm > existingEntry.wpm) {
        Object.assign(existingEntry, score);
      }
    } else {
      // First score for this paragraph
      highScores.push(score);
    }

    localStorage.setItem("Highscore", JSON.stringify(highScores));
  }

  _isNewHighScore(wpm) {
    const highScores = this._getHighScoresFromLocalStorage();

    const existingEntry = highScores.find(
      (item) => item.paragraphId === this.paragraphId
    );

    // No previous score for this paragraph
    if (!existingEntry) {
      return true;
    }

    return wpm > existingEntry.wpm;
  }

  _getHighScoresFromLocalStorage() {
    const data = localStorage.getItem("Highscore");

    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Invalid highscore data:", error);
      return [];
    }
  }

  _showResults() {
    this.refs.resultsOverlay.classList.add("visible");
  }

  _hideResults() {
    this.refs.resultsOverlay.classList.remove("visible");
  }
}