export class AuthUIController {

    constructor(refs, authService) {
        this.refs = refs;
        this.authService = authService;
    }

    async init() {
        await this.render();
    }

    async render() {
        const user =
             await this.authService.getCurrentUser();


        if (!user) {
            this.renderLoggedOut();
            return;
        }

        this.renderLoggedIn(user);
    }

    renderLoggedOut() {
        this.refs.authNav.innerHTML = `
            <a
                href="/html/auth.html"
                class="nav-link"
            >
                Login
            </a>
        `;
    }

    renderLoggedIn(user) {

        const avatar =
            user.avatarUrl ||
            "../assets/default-avatar.png";

        this.refs.authNav.innerHTML = `
            <div class="user-menu">

                <img
                    src="${avatar}"
                    alt="${user.username}"
                    class="user-menu__avatar"
                >

                <span class="user-menu__name">
                    ${user.username}
                </span>

                <button
                    type="button"
                    class="user-menu__logout"
                    id="logoutButton"
                >
                    Logout
                </button>

            </div>
        `;

        this.refs.logoutButton =
            document.getElementById("logoutButton");

        this.refs.logoutButton.addEventListener(
            "click",
            () => this.handleLogout()
        );
    }

    async handleLogout() {
        await this.authService.logout();

        this.render();
    }
}