
import { UserResponseDTO } from "../model/user.model.js";
import { UserValidator } from "../validators/user.validator.js";

export class AuthService {
    constructor(userService, authRepository) {
        this.userService = userService;
        this.authRepository = authRepository;
    }

    async login(userDTO) {
        UserValidator.login(userDTO);

        const user =
            await this.userService.getByEmail(userDTO.email);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.password !== userDTO.password) {
            throw new Error("Invalid password");
        }

        const userResponseDTO = new UserResponseDTO(user);
        this.authRepository.setCurrentUser(userResponseDTO);

        return userResponseDTO;
    }

    async register(userDTO) {
        UserValidator.user(userDTO);

        const existingUser =
            await this.userService.getByEmail(userDTO.email);

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const existingUserByUsername =
            await this.userService.getByUsername(userDTO.username);

        if (existingUserByUsername) {
            throw new Error("User with this username already exists");
        }

        const user =
            await this.userService.create(userDTO);

        const userResponseDTO = new UserResponseDTO(user);
        this.authRepository.setCurrentUser(userResponseDTO);

        return userResponseDTO;
    }

    async getCurrentUser() {
        return this.authRepository.getCurrentUser();
    }
    
    async logout() {
        this.authRepository.clearCurrentUser();
    }
}