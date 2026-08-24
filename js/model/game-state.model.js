export class GameState {
    constructor() {
        this.started = false;

        this.currentIdx = 0;
        this.startTime = 0;

        this.correctChars = 0;
        this.incorrectChars = 0;

        this.history = [];

        this.text = "";
        this.paragraphId = -1;
        this.difficulty = "";
    }

    reset() {
        this.started = false;

        this.currentIdx = 0;
        this.startTime = 0;

        this.correctChars = 0;
        this.incorrectChars = 0;

        this.history = [];

        this.text = "";
        this.paragraphId = -1;
        this.difficulty = "";
    }
}