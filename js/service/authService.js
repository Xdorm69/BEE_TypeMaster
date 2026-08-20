import { Validator } from "../utils/Validator";

export class Auth {
    /**
     * @param {Object} user
     */

    constructor(user) {
        Validator.user(user);

        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.avatarUrl = user.avatarUrl || "assets/fallback.png";
    }

    async login() {
        // TODO: Implement login logic
    }

    async register() {
        // TODO: Implement register logic
        this._saveToLocalStorage();
    }

    _saveToLocalStorage() {
        const prev = localStorage.getItem("Users");
        const users = prev ? JSON.parse(prev) : [];
        users.push(this);
        localStorage.setItem("Users", JSON.stringify(users));
    }
}




