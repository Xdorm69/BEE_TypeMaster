import { HighScoreRepository } from "./repository/high-score.repository.js";
import { HistoryRepository } from "./repository/history.repository.js";
import { UserRepository } from "./repository/user.repository.js";
import { AuthRepository } from "./repository/auth.repository.js";

import { GameService } from "./service/game.service.js";
import { HighScoreService } from "./service/high-score.service.js";
import { HistoryService } from "./service/history.service.js";
import { UserService } from "./service/user.service.js";
import { AuthService } from "./service/auth.service.js";

import { GameController } from "./controllers/game.controller.js";
import { AuthUIController } from "./controllers/auth-ui.controller.js";



// =========================
// AUTH
// =========================

const userRepository =
    new UserRepository();

const userService =
    new UserService(userRepository);

const authRepository =
    new AuthRepository();

const authService =
    new AuthService(
        userService,
        authRepository
    );

// =========================
// GAME
// =========================

const scoreRepository =
    new HighScoreRepository();

const scoreService =
    new HighScoreService(scoreRepository, authService);


const historyRepository =
    new HistoryRepository();

const historyService =
    new HistoryService(historyRepository, authService);


const gameService =
    new GameService();


// =========================
// AUTH UI
// =========================

const authUIController =
    new AuthUIController(
        {
            authNav: document.querySelector("#authNav")
        },
        authService
    );

authUIController.init();


// =========================
// GAME CONTROLLER
// =========================

const gameController =
    new GameController(
        {
            gameBody: document.querySelector("#gameBody"),

            gameDescription:
                document.querySelector("#gameDescription"),

            difficultyChip:
                document.querySelector("#difficultyChip"),

            progressTrail:
                document.querySelector("#progressTrail"),

            progressBee:
                document.querySelector("#progressBee"),

            liveWpm:
                document.querySelector("#liveWpm"),

            liveAccuracy:
                document.querySelector("#liveAccuracy"),

            liveErrors:
                document.querySelector("#liveErrors"),

            resultsOverlay:
                document.querySelector("#resultsOverlay"),

            resultsDifficulty:
                document.querySelector("#resultsDifficulty"),

            resultWpm:
                document.querySelector("#resultWpm"),

            resultAccuracy:
                document.querySelector("#resultAccuracy"),

            resultCorrect:
                document.querySelector("#resultCorrect"),

            resultIncorrect:
                document.querySelector("#resultIncorrect"),

            resultBestScore:
                document.querySelector("#resultBestScore"),

            nextRunBtn:
                document.querySelector("#nextRunBtn")
        },

        gameService,
        scoreService,
        historyService
    );


gameController.start();