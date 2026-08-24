import { LeaderboardController } from "./controllers/leaderboard.controller.js";
import { AuthUIController } from "./controllers/auth-ui.controller.js";

import { HighScoreRepository } from "./repository/high-score.repository.js";
import { UserRepository } from "./repository/user.repository.js";
import { AuthRepository } from "./repository/auth.repository.js";

import { LeaderboardService } from "./service/leaderboard.service.js";
import { UserService } from "./service/user.service.js";
import { AuthService } from "./service/auth.service.js";

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
// LEADERBOARD
// =========================

const highScoreRepository =
    new HighScoreRepository();

const leaderboardService =
    new LeaderboardService(
        highScoreRepository,
        userRepository,
        authService
    );

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
// LEADERBOARD CONTROLLER
// =========================

const leaderboardController =
    new LeaderboardController(
        {
            tabs: document.querySelector("#leaderboardTabs"),
            myRank: document.querySelector("#myRank"),
            leaderboardBody: document.querySelector("#leaderboardBody")
        },
        leaderboardService,
        authService
    );

leaderboardController.init();
