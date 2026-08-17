
const DEMO_TEXTS = [  
  { difficulty: "Easy", text: "This is BEE Type Master, Our Frontend Project For 5th Semester."},
  { difficulty: "Easy", text: "Fox Jumps Over The Big Black Tree." },
  { difficulty: "Easy", text: "Practice Every Day To Improve Your Typing Speed." },
  { difficulty: "Easy", text: "Coding Is Fun When You Solve Real Problems." },
  { difficulty: "Medium", text: "The quick brown fox jumps over the lazy dog while bright birds sing in the distance." },
  { difficulty: "Medium", text: "Learning to type accurately is more important than typing incredibly fast." },
  { difficulty: "Medium", text: "A journey of a thousand miles begins with a single step and consistent effort." },
  { difficulty: "Hard", text: "JavaScript, HTML, and CSS work together to create interactive, responsive, and visually appealing web applications." },
  { difficulty: "Hard", text: "Success depends on discipline, perseverance, adaptability, and the willingness to learn from every mistake you encounter." },
  { difficulty: "Expert", text: "Sphinx of black quartz, judge my vow! Pack my box with five dozen liquor jugs while quirky zebras zigzag quickly across frozen terrain." },
  { difficulty: "Expert", text: "Complex algorithms, asynchronous programming, optimization techniques, and debugging skills collectively distinguish experienced software engineers from beginners." }
];

/** Number of cells drawn in the honeycomb progress trail (independent of text length). */
const PROGRESS_CELL_COUNT = 24;

class TypingGame {
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

    const paragraph = this._pickParagraph();
    this.text = paragraph.text;
    this.difficulty = paragraph.difficulty;

    this.refs.difficultyChip.textContent = paragraph.difficulty;
    this.refs.gameDescription.textContent = "Press any key to start the game";
    this._renderChars();
    this._updateLiveStats();
    this._updateProgress();
  }

  _pickParagraph() {
    return DEMO_TEXTS[Math.floor(Math.random() * DEMO_TEXTS.length)];
  }

  _resetState() {
    this.started = false;
    this.currentIdx = 0;
    this.startTime = 0;
    this.correctChars = 0;
    this.incorrectChars = 0;
    this.chars = [];
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
    const wpm = seconds > 0 ? (this.correctChars / 5) / (seconds / 60) : 0;
    const attempted = this.correctChars + this.incorrectChars;
    const accuracy = attempted > 0 ? (this.correctChars / attempted) * 100 : 100;

    this.refs.resultsDifficulty.textContent = `${this.difficulty} hive cleared`;
    this.refs.resultWpm.textContent = wpm.toFixed(0);
    this.refs.resultAccuracy.textContent = `${accuracy.toFixed(0)}%`;
    this.refs.resultCorrect.textContent = this.correctChars;
    this.refs.resultIncorrect.textContent = this.incorrectChars;

    this._showResults();
  }

  _showResults() {
    this.refs.resultsOverlay.classList.add("visible");
  }

  _hideResults() {
    this.refs.resultsOverlay.classList.remove("visible");
  }
}

const game = new TypingGame({
  gameBody: document.querySelector("#gameBody"),
  gameDescription: document.querySelector("#gameDescription"),
  difficultyChip: document.querySelector("#difficultyChip"),
  progressTrail: document.querySelector("#progressTrail"),
  progressBee: document.querySelector("#progressBee"),
  liveWpm: document.querySelector("#liveWpm"),
  liveAccuracy: document.querySelector("#liveAccuracy"),
  liveErrors: document.querySelector("#liveErrors"),
  resultsOverlay: document.querySelector("#resultsOverlay"),
  resultsDifficulty: document.querySelector("#resultsDifficulty"),
  resultWpm: document.querySelector("#resultWpm"),
  resultAccuracy: document.querySelector("#resultAccuracy"),
  resultCorrect: document.querySelector("#resultCorrect"),
  resultIncorrect: document.querySelector("#resultIncorrect"),
  nextRunBtn: document.querySelector("#nextRunBtn")
});

game.start();
