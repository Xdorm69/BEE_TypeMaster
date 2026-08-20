import { HighscoreRepository } from "./repository/highscore.repository.js";
import { TypingGame } from "./service/game.service.js";
import { HighScoreService } from "./service/highscore.service.js";

const scoreRepository = new HighscoreRepository();
const scoreService = new HighScoreService(scoreRepository);

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
  resultBestScore: document.querySelector("#resultBestScore"),
  nextRunBtn: document.querySelector("#nextRunBtn")
}, scoreService);

game.start();
