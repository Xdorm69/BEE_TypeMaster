import { AuthController } from "./controllers/auth.controller.js";

import { AuthRepository } from "./repository/auth.repository.js";
import { UserRepository } from "./repository/user.repository.js";

import { AuthService } from "./service/auth.service.js";
import { UserService } from "./service/user.service.js";

const refs = {
    authForm: document.getElementById("authForm"),

    authTitle: document.getElementById("authTitle"),
    authDescription: document.getElementById("authDescription"),

    authError: document.getElementById("authError"),
    authSuccess: document.getElementById("authSuccess"),

    usernameGroup: document.getElementById("usernameGroup"),
    username: document.getElementById("username"),

    email: document.getElementById("email"),
    password: document.getElementById("password"),

    submitButton: document.getElementById("submitButton"),

    switchText: document.getElementById("switchText"),
    switchMode: document.getElementById("switchMode")
};


const userRepository =
    new UserRepository();

const userService =
    new UserService(userRepository);

const authRepository =
    new AuthRepository();

const authService =
    new AuthService(
        userService,
        authRepository
    );


const controller =
    new AuthController(
        refs,
        authService
    );


controller.init();