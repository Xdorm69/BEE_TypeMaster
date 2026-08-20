export class Validator {
    static user(u) {
        const missing = [];
        if (!u.username) missing.push("Username");
        if (!u.email) missing.push("Email");
        if (!u.password) missing.push("Password");

        if (missing.length > 0) {
            throw new Error("All fields must be present: " + `${missing.join(", ")} are missing`);
        }

        if (u.username.length > 20) throw new Error("Too long username");
        
        if (u.password.length < 8) throw new Error("Password too short");

        if (!u.email.includes("@")) throw new Error("Invalid email");

        //make sure password contains nums and alpha with special
        this._password(u.password);
        
    }

    static _password(p) {
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p)) {
            throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
    }
}