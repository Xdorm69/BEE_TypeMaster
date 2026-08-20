export class Generator {
    static id() {
        return Math.random().toString(36).substr(2, 9);
    }
}