import { DEMO_TEXTS } from "../constants/texts.js";
import { GameState } from "../model/game-state.model.js";
import { ScoreDTO } from "../model/score.model.js";

export class GameService {

    constructor() {
        this.gameState = new GameState();
    }

    startGame() {
        const paragraphId = this._pickParagraphId();
        const paragraph = this._getParagraph(paragraphId);

        this.gameState.paragraphId = paragraphId;
        this.gameState.text = paragraph.text;
        this.gameState.difficulty = paragraph.difficulty;

        return this.getState();
    }

    startTyping() {
        if (this.gameState.started) {
            return;
        }

        this.gameState.started = true;
        this.gameState.startTime = Date.now();
    }

    handleCharacter(character) {
        if (!this.gameState.started || this.isComplete()) {
            return null;
        }

        if (typeof character !== "string" || character.length !== 1) {
            return null;
        }

        const expectedCharacter = this.gameState.text[this.gameState.currentIdx];
        const isCorrect = character === expectedCharacter;

        if (isCorrect) {
            this.gameState.correctChars++;
        } else {
            this.gameState.incorrectChars++;
        }

        const result = {
            index: this.gameState.currentIdx,
            correct: isCorrect
        };

        this.gameState.history.push(result);

        this.gameState.currentIdx++;

        return result;
    }

    handleBackspace() {
      if (!this.gameState.started || this.gameState.currentIdx === 0) {
          return null;
      }

      this.gameState.currentIdx--;

      const result = this.gameState.history.pop();

      if (!result) {
          return null;
      }

      if (result.correct) {
          this.gameState.correctChars--;
      } else {
          this.gameState.incorrectChars--;
      }

      return result;
    }

    isComplete() {
        return (
            this.gameState.text.length > 0 &&
            this.gameState.currentIdx >= this.gameState.text.length
        );
    }

    finish() {
        const seconds = this.getElapsedSeconds();

        const wpm = seconds > 0
            ? (this.gameState.correctChars / 5) / (seconds / 60)
            : 0;

        const attempted =
            this.gameState.correctChars + this.gameState.incorrectChars;

        const accuracy = attempted > 0
            ? (this.gameState.correctChars / attempted) * 100
            : 100;

        return new ScoreDTO(
            this.gameState.paragraphId,
            this.gameState.difficulty,
            Math.round(wpm),
            Math.round(accuracy),
            this.gameState.correctChars,
            this.gameState.incorrectChars,
            seconds,
            new Date()
        );
    }

    getElapsedSeconds() {
        if (!this.gameState.started) {
            return 0;
        }

        return (Date.now() - this.gameState.startTime) / 1000;
    }

    getWpm() {
        const seconds = this.getElapsedSeconds();

        if (seconds <= 0) {
            return 0;
        }

        return Math.round(
            (this.gameState.correctChars / 5) /
            (seconds / 60)
        );
    }

    getAccuracy() {
        const attempted =
            this.gameState.correctChars + this.gameState.incorrectChars;

        if (attempted === 0) {
            return 100;
        }

        return Math.round(
            (this.gameState.correctChars / attempted) * 100
        );
    }

    getProgress() {
        if (this.gameState.text.length === 0) {
            return 0;
        }

        return this.gameState.currentIdx / this.gameState.text.length;
    }

    getState() {
        return {
            paragraphId: this.gameState.paragraphId,
            text: this.gameState.text,
            difficulty: this.gameState.difficulty,

            currentIdx: this.gameState.currentIdx,

            correctChars: this.gameState.correctChars,
            incorrectChars: this.gameState.incorrectChars,

            started: this.gameState.started,

            wpm: this.getWpm(),
            accuracy: this.getAccuracy(),
            progress: this.getProgress()
        };
    }

    reset() {
        this.gameState.reset();
    }

    _pickParagraphId() {
        return Math.floor(
            Math.random() * DEMO_TEXTS.length
        );
    }

    _getParagraph(id) {
        return DEMO_TEXTS[id];
    }

}