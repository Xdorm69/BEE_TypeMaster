import { HistoryController } from "./controllers/history.controller.js";
import { HistoryRepository } from "./repository/history.repository.js";
import { HistoryService } from "./service/history.service.js";

const historyRepository = new HistoryRepository();
const historyService = new HistoryService(historyRepository);
const historyController = new HistoryController(
    {
        historyBody: document.getElementById('historyBody')
    },
    historyService
);

historyController.init();
