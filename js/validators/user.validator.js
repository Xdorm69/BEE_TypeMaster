import { UserDTO } from "../model/user.model.js";  

export class UserValidator {
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

    static _password(p) {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p)) {
            throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
    }
}