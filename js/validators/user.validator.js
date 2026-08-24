import { UserDTO, LoginDTO } from "../model/user.model.js";  

export class UserValidator {
    static optionalKeys = new Set(["avatarUrl"]);
    
    static expectedUserKeys = ["username", "email", "password", "avatarUrl"];
    static expectedLoginKeys = ["email", "password"];
    
    static user(userDTO) {
        if (!userDTO) throw new Error("UserDTO is required");
        if (!(userDTO instanceof UserDTO)) throw new Error("UserDTO must be an instance of UserDTO");

        const missing = [];
        
        for (const key of this.expectedUserKeys) {
            if (this.optionalKeys.has(key)) continue;
            
            if (!(key in userDTO) || userDTO[key] === undefined || userDTO[key] === null || userDTO[key] === "") {
                missing.push(key);
            }
        }
        
        if (missing.length > 0) {
            throw new Error("All fields must be present: " + `${missing.join(", ")} are missing`);
        }

        if (userDTO.username?.length > 20) throw new Error("Too long username");
        if (userDTO.password?.length < 8) throw new Error("Password too short");
        if (!userDTO.email?.includes("@")) throw new Error("Invalid email");

        this._password(userDTO.password);

        return {
            username: userDTO.getUsername(),
            email: userDTO.getEmail(),
            password: userDTO.getPassword(),
            avatarUrl: userDTO.getAvatarUrl() || null
        }
    }

    static login(loginDTO) {
        if (!loginDTO) throw new Error("LoginDTO is required");
        if (!(loginDTO instanceof LoginDTO)) throw new Error("LoginDTO must be an instance of loginDTO");

        const missing = [];

        for (const key of this.expectedLoginKeys) {
            if (!(key in loginDTO) || loginDTO[key] === undefined || loginDTO[key] === null || loginDTO[key] === "") {
                missing.push(key);
            }
        }
        
        if (missing.length > 0) {
            throw new Error("All fields must be present: " + `${missing.join(", ")} are missing`);
        }

        if (loginDTO.password?.length < 8) throw new Error("Password too short");
        if (!loginDTO.email?.includes("@")) throw new Error("Invalid email");

        return {
            email: loginDTO.getEmail(),
            password: loginDTO.getPassword()
        }
    }

    static _password(p) {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p)) {
            throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
    }
}
