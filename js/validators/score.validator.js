import { ScoreDTO } from "../model/score.model.js";

export class ScoreValidator {
    static validDifficulties = new Set(['Easy', 'Medium', 'Hard', 'Expert']);

    static score(scoreDTO) {
        if (!scoreDTO) {
            throw new Error("ScoreDTO is required");
        }

        if (!(scoreDTO instanceof ScoreDTO)) {
            throw new Error("ScoreDTO must be an instance of ScoreDTO");
        }

        const missing = [];

        for (const key of Object.keys(scoreDTO)) {
            if (scoreDTO[key] === undefined || scoreDTO[key] === null) {
                missing.push(key);
            }
        }

        if (missing.length > 0) {
            throw new Error(
                `All fields must be present: ${missing.join(", ")} are missing`
            );
        }

        if (!this.validDifficulties.has(scoreDTO.difficulty)) {
            throw new Error("Invalid difficulty");
        }

        if (scoreDTO.time < 0) throw new Error("Time cannot be negative");
        if (!(scoreDTO.date instanceof Date)) throw new Error("Date must be a Date object");
        if (scoreDTO.correct < 0) throw new Error("Correct count cannot be negative");
        if (scoreDTO.incorrect < 0) throw new Error("Incorrect count cannot be negative");

        return scoreDTO;
    }
}