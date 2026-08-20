import { Validator } from "../utils/Validator.js";

export class HighScoreService {
    constructor(repository) {
        this.repository = repository;
    }
    
    create(scoreDTO) {
        Validator.score(scoreDTO);
        this.repository.save(scoreDTO);
    }


}
