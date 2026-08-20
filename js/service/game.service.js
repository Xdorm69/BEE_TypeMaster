import { DEMO_TEXTS } from "../constants/texts.js";
import { ScoreDTO } from "../model/score.model.js";

export class GameService {

    constructor() {
        this.reset();
    }

    startGame() {
        const paragraphId = this._pickParagraphId();
        const paragraph = this._getParagraph(paragraphId);

        this.paragraphId = paragraphId;
        this.text = paragraph.text;
        this.difficulty = paragraph.difficulty;

        return this.getState();
    }

    startTyping() {
        if (this.started) {
            return;
        }

        this.started = true;
        this.startTime = Date.now();
    }

    handleCharacter(character) {
        if (!this.started || this.isComplete()) {
            return null;
        }

        if (typeof character !== "string" || character.length !== 1) {
            return null;
        }

        const expectedCharacter = this.text[this.currentIdx];
        const isCorrect = character === expectedCharacter;

        if (isCorrect) {
            this.correctChars++;
        } else {
            this.incorrectChars++;
        }

        const result = {
            index: this.currentIdx,
            correct: isCorrect
        };

        this.currentIdx++;

        return result;
    }

    handleBackspace() {
        if (!this.started || this.currentIdx === 0) {
            return null;
        }

        this.currentIdx--;

        return {
            index: this.currentIdx
        };
    }

    isComplete() {
        return (
            this.text.length > 0 &&
            this.currentIdx >= this.text.length
        );
    }

    finish() {
        const seconds = this.getElapsedSeconds();

        const wpm = seconds > 0
            ? (this.correctChars / 5) / (seconds / 60)
            : 0;

        const attempted =
            this.correctChars + this.incorrectChars;

        const accuracy = attempted > 0
            ? (this.correctChars / attempted) * 100
            : 100;

        return new ScoreDTO(
            this.paragraphId,
            this.difficulty,
            Math.round(wpm),
            Math.round(accuracy),
            this.correctChars,
            this.incorrectChars,
            seconds
        );
    }

    getElapsedSeconds() {
        if (!this.started) {
            return 0;
        }

        return (Date.now() - this.startTime) / 1000;
    }

    getWpm() {
        const seconds = this.getElapsedSeconds();

        if (seconds <= 0) {
            return 0;
        }

        return Math.round(
            (this.correctChars / 5) /
            (seconds / 60)
        );
    }

    getAccuracy() {
        const attempted =
            this.correctChars + this.incorrectChars;

        if (attempted === 0) {
            return 100;
        }

        return Math.round(
            (this.correctChars / attempted) * 100
        );
    }

    getProgress() {
        if (this.text.length === 0) {
            return 0;
        }

        return this.currentIdx / this.text.length;
    }

    getState() {
        return {
            paragraphId: this.paragraphId,
            text: this.text,
            difficulty: this.difficulty,

            currentIdx: this.currentIdx,

            correctChars: this.correctChars,
            incorrectChars: this.incorrectChars,

            started: this.started,

            wpm: this.getWpm(),
            accuracy: this.getAccuracy(),
            progress: this.getProgress()
        };
    }

    reset() {
        this.started = false;
        this.currentIdx = 0;
        this.startTime = 0;

        this.correctChars = 0;
        this.incorrectChars = 0;

        this.text = "";
        this.paragraphId = -1;
        this.difficulty = "";
    }

    _pickParagraphId() {
        return Math.floor(
            Math.random() * DEMO_TEXTS.length
        );
    }

    _getParagraph(id) {
        return DEMO_TEXTS[id];
    }

    undoCharacter(index, wasCorrect) {
    if (wasCorrect) {
        this.correctChars--;
    } else {
        this.incorrectChars--;
    }

    this.currentIdx = index;
}
}