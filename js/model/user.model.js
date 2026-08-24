export class User {
    constructor(id, username, email, password, avatarUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatarUrl = avatarUrl;
    }
    getId() {return this.id;}
    getUsername() {return this.username;}
    getEmail() {return this.email;}
    getPassword() {return this.password;}
    getAvatarUrl() {return this.avatarUrl;}

    setId(id) {this.id = id;}
    setUsername(username) {this.username = username;}
    setEmail(email) {this.email = email;}
    setPassword(password) {this.password = password;}
    setAvatarUrl(avatarUrl) {this.avatarUrl = avatarUrl;}
}

export class UserDTO {
    constructor({username, email, password, avatarUrl}) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatarUrl = avatarUrl;
    }
    getUsername() { return this.username; }
    getEmail() { return this.email; }
    getPassword() { return this.password; }
    getAvatarUrl() { return this.avatarUrl; }

    setUsername(username) { this.username = username; }
    setEmail(email) { this.email = email; }
    setPassword(password) { this.password = password; }
    setAvatarUrl(avatarUrl) { this.avatarUrl = avatarUrl; }

}

export class LoginDTO {
    constructor({email, password}) {
        this.email = email;
        this.password = password;
    }
    getEmail() { return this.email; }
    getPassword() { return this.password; }

    setEmail(email) { this.email = email; }
    setPassword(password) { this.password = password; }

}

export class UserResponseDTO {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.avatarUrl = user.avatarUrl;
    }

    getId() { return this.id; }
    getUsername() { return this.username; }
    getEmail() { return this.email; }
    getAvatarUrl() { return this.avatarUrl; }
}

