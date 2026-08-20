import { ScoreDTO } from "../model/score.model.js";
import { UserDTO } from "../model/user.model.js";  

export class Validator {

    static validDifficulties = new Set(['Easy', 'Medium', 'Hard', 'Expert']);

    static user(userDTO) {
        if (!userDTO) throw new Error("UserDTO is required");
        if (!(userDTO instanceof UserDTO)) throw new Error("UserDTO must be an instance of UserDTO");


        const missing = [];

        for (const key in userDTO) {
            if (userDTO[key] === undefined || userDTO[key] === null) {
                missing.push(key);
            }
        }
        
        if (missing.length > 0) {
            throw new Error("All fields must be present: " + `${missing.join(", ")} are missing`);
        }

        if (u.username.length > 20) throw new Error("Too long username");
        
        if (u.password.length < 8) throw new Error("Password too short");

        if (!u.email.includes("@")) throw new Error("Invalid email");

        //make sure password contains nums and alpha with special
        this._password(u.password);

        return {
            username: u.username,
            email: u.email,
            password: u.password,
            avatarUrl: u.avatarUrl || null
        }
        
    }

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
        if (scoreDTO.correct < 0) throw new Error("Correct count cannot be negative");
        if (scoreDTO.incorrect < 0) throw new Error("Incorrect count cannot be negative");

        return scoreDTO;
    }

    static _password(p) {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p)) {
            throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
    }
}