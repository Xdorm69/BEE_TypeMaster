import { HighScoreRepository } from "./repository/high-score.repository.js";

import { GameService } from "./service/game.service.js";
import { HighScoreService } from "./service/high-score.service.js";

import { GameController } from "./controllers/game.controller.js";

const scoreRepository = new HighScoreRepository();
const scoreService = new HighScoreService(scoreRepository);

const gameService = new GameService();
const gameController = new GameController({
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
},
gameService,
scoreService
)

gameController.start();
