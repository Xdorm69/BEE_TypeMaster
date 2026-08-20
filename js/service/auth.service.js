import { UserDTO } from "../model/user.model.js";
import { Store } from "../utils/store.js";
import { Validator } from "../utils/validator.js";

export class Auth {
    /**
     * @param {Object} user
     */

    constructor(userService) {
        this.storageKey = "users";
        this.userService = userService;
    }

    async login(userDTO) {
        if (!(userDTO instanceof UserDTO)) {
            throw new Error("Invalid user data");
        }
        Validator.user(userDTO);
        
        const user = this.userService.getByEmail(userDTO.email);

        if (user.password !== userDTO.password) {
            throw new Error("Invalid password");
        }

        Store.save("currentUser", user);

        return user;
    }

    async register(userDTO) {
        if (!(userDTO instanceof UserDTO)) {
            throw new Error("Invalid user data");
        }

        Validator.user(userDTO);

        const existingUser = this.userService.getByEmail(userDTO.email);
        
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = this.userService.create(userDTO);

        Store.save("currentUser", user);

        return user;
    }

    async logout() {
        Store.remove("currentUser");
    }
}




