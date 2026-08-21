import { HistoryController } from "./controllers/history.controller.js";
import { HistoryRepository } from "./repository/history.repository.js";
import { HistoryService } from "./service/history.service.js";

import { AuthRepository } from "./repository/auth.repository.js";
import { UserRepository } from "./repository/user.repository.js";
import { AuthService } from "./service/auth.service.js";
import { UserService } from "./service/user.service.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authRepository = new AuthRepository();
const authService = new AuthService(userService, authRepository);

const historyRepository = new HistoryRepository();
const historyService = new HistoryService(historyRepository, authService);

const historyController = new HistoryController(
    {
        historyBody: document.getElementById('historyBody')
    },
    historyService
);

historyController.init();
