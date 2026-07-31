const gameBody = document.querySelector(".game");
const gameDescription = document.querySelector(".game-description");

const demoTexts = [
  {
    difficulty: "Easy",
    text: "Fox Jumps Over The Big Black Tree."
  },
  {
    difficulty: "Easy",
    text: "Practice Every Day To Improve Your Typing Speed."
  },
  {
    difficulty: "Easy",
    text: "Coding Is Fun When You Solve Real Problems."
  },
  {
    difficulty: "Medium",
    text: "The quick brown fox jumps over the lazy dog while bright birds sing in the distance."
  },
  {
    difficulty: "Medium",
    text: "Learning to type accurately is more important than typing incredibly fast."
  },
  {
    difficulty: "Medium",
    text: "A journey of a thousand miles begins with a single step and consistent effort."
  },
  {
    difficulty: "Hard",
    text: "JavaScript, HTML, and CSS work together to create interactive, responsive, and visually appealing web applications."
  },
  {
    difficulty: "Hard",
    text: "Success depends on discipline, perseverance, adaptability, and the willingness to learn from every mistake you encounter."
  },
  {
    difficulty: "Expert",
    text: "Sphinx of black quartz, judge my vow! Pack my box with five dozen liquor jugs while quirky zebras zigzag quickly across frozen terrain."
  },
  {
    difficulty: "Expert",
    text: "Complex algorithms, asynchronous programming, optimization techniques, and debugging skills collectively distinguish experienced software engineers from beginners."
  }
];

// -----------------------
// State
// -----------------------

const gameState = {
    started: false,
    currentIdx: 0,
    startTime: 0,
    endTime: 0,
    correctChars: 0,
    incorrectChars: 0,
    chars: [],
    text: "",
    difficulty: ""
};

// -----------------------
// Helpers
// -----------------------

function getRandomParagraph() {
    return demoTexts[Math.floor(Math.random() * demoTexts.length)];
}

function resetState() {
    gameState.started = false;
    gameState.currentIdx = 0;
    gameState.startTime = 0;
    gameState.endTime = 0;
    gameState.correctChars = 0;
    gameState.incorrectChars = 0;
    gameState.chars = [];
}

function renderParagraph() {
    resetState();

    gameBody.innerHTML = "";

    const paragraph = getRandomParagraph();

    gameState.text = paragraph.text;
    gameState.difficulty = paragraph.difficulty;

    gameDescription.textContent = `Difficulty: ${paragraph.difficulty}`;

    [...paragraph.text].forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char;

        gameBody.appendChild(span);

        gameState.chars.push({
            value: char,
            element: span
        });
    });

    gameState.chars[0].element.classList.add("current");
}

function finishGame() {
    gameState.endTime = Date.now();

    const seconds = (gameState.endTime - gameState.startTime) / 1000;

    const wpm = (gameState.correctChars / 5) / (seconds / 60);

    alert(`
Difficulty : ${gameState.difficulty}

WPM : ${wpm.toFixed(2)}

Correct : ${gameState.correctChars}
Incorrect : ${gameState.incorrectChars}
    `);

    renderParagraph(); // automatically load another random paragraph
}

// -----------------------
// Keyboard
// -----------------------

document.addEventListener("keydown", (e) => {
    if (e.key.length !== 1) return;

    if (!gameState.started) {
        gameState.started = true;
        gameState.startTime = Date.now();
        gameDescription.textContent = "Keep typing...";
    }

    const current = gameState.chars[gameState.currentIdx];

    if (!current) return;

    if (e.key === current.value) {
        current.element.classList.add("correct");
        gameState.correctChars++;
    } else {
        current.element.classList.add("incorrect");
        gameState.incorrectChars++;
    }

    current.element.classList.remove("current");

    gameState.currentIdx++;

    if (gameState.currentIdx >= gameState.chars.length) {
        finishGame();
        return;
    }

    gameState.chars[gameState.currentIdx].element.classList.add("current");
});

// -----------------------
// Initial Load
// -----------------------

renderParagraph();