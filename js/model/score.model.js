export class Score {
    constructor(paragraphId, difficulty, wpm, accuracy, correct, incorrect, time) {
        this.paragraphId = paragraphId;
        this.difficulty = difficulty;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.correct = correct;
        this.incorrect = incorrect;
        this.time = time;
    }
    
    getWpm() {return this.wpm;}
    getAccuracy() {return this.accuracy;}
    getTime() {return this.time;}
    getParagraphId() {return this.paragraphId;}
    getDifficulty() {return this.difficulty;}
    getCorrect() {return this.correct;}
    getIncorrect() {return this.incorrect;}
    
}

export class ScoreDTO  {
    constructor(paragraphId, difficulty, wpm, accuracy, correct, incorrect, time, date) {
        this.paragraphId = paragraphId;
        this.difficulty = difficulty;
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.correct = correct;
        this.incorrect = incorrect;
        this.time = time;
        this.date = date;
    }
    
    getWpm() {return this.wpm;}
    getAccuracy() {return this.accuracy;}
    getTime() {return this.time;}
    getParagraphId() {return this.paragraphId;}
    getDifficulty() {return this.difficulty;}
    getCorrect() {return this.correct;}
    getIncorrect() {return this.incorrect;}
    getDate() {return this.date;}
}
