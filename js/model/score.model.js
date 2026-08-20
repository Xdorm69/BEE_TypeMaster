export class Score {
    constructor(wpm, accuracy, time) {
        this.wpm = wpm;
        this.accuracy = accuracy;
        this.time = time;
    }
    
    getWpm() {return this.wpm;}
    getAccuracy() {return this.accuracy;}
    getTime() {return this.time;}
    
    setWpm(wpm) {this.wpm = wpm;}
    setAccuracy(accuracy) {this.accuracy = accuracy;}
    setTime(time) {this.time = time;}
}

export class ScoreDTO extends Score {
    constructor(wpm, accuracy, time) {
        super(wpm, accuracy, time);
    }
}
