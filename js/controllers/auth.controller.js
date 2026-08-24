import { LoginDTO, UserDTO } from "../model/user.model.js";

export class AuthController {
    constructor(refs, authService) {
        this.refs = refs;
        this.authService = authService;

        this.mode = "login";
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.refs.authForm.addEventListener(
            "submit",
            (event) => this.handleSubmit(event)
        );

        this.refs.switchMode.addEventListener(
            "click",
            () => this.toggleMode()
        );
    }

    toggleMode() {
        this.mode =
            this.mode === "login"
                ? "register"
                : "login";

        this.clearMessages();
        this.refs.authForm.reset();

        this.render();
    }

    render() {
        const isLogin = this.mode === "login";

        this.refs.authTitle.textContent =
            isLogin
                ? "Welcome Back"
                : "Create Account";

        this.refs.authDescription.textContent =
            isLogin
                ? "Login to continue your typing journey."
                : "Create an account to track your typing progress.";

        this.refs.usernameGroup.hidden = isLogin;

        this.refs.username.required = !isLogin;

        this.refs.password.autocomplete =
            isLogin
                ? "current-password"
                : "new-password";

        this.refs.submitButton.textContent =
            isLogin
                ? "Login"
                : "Sign Up";

        this.refs.switchText.textContent =
            isLogin
                ? "Don't have an account?"
                : "Already have an account?";

        this.refs.switchMode.textContent =
            isLogin
                ? "Sign up"
                : "Login";
    }

    async handleSubmit(event) {
    event.preventDefault();

    this.clearMessages();

    const email = this.refs.email.value.trim();
    const password = this.refs.password.value;

    this.setLoading(true);

    try {
        if (this.mode === "login") {

            const loginDTO = new LoginDTO({
                email,
                password
            });

            await this.authService.login(loginDTO);

        } else {

            const userDTO = new UserDTO({
                username: this.refs.username.value.trim(),
                email,
                password,
                avatarUrl: null
            });

            await this.authService.register(userDTO);
        }

        window.location.href = "/index.html";

    } catch (error) {
        this.showError(
            error.message || "Something went wrong."
        );
    } finally {
        this.setLoading(false);
    }
}

    setLoading(loading) {
        this.refs.submitButton.disabled = loading;

        this.refs.submitButton.textContent =
            loading
                ? "Please wait..."
                : this.mode === "login"
                    ? "Login"
                    : "Sign Up";
    }

    showError(message) {
        this.refs.authError.textContent = message;
        this.refs.authError.hidden = false;
    }

    clearMessages() {
        this.refs.authError.hidden = true;
        this.refs.authSuccess.hidden = true;

        this.refs.authError.textContent = "";
        this.refs.authSuccess.textContent = "";
    }
}