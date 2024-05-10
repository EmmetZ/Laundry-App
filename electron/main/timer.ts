import { FetchType } from "../types";

class Timer {
  private _time: number;
  private _duration: number;
  private _interval: NodeJS.Timeout | null;
  private _timeout: NodeJS.Timeout | null;
  private onFinish: (type: FetchType) => void;

  constructor(duration: number, onFinish: (type: FetchType) => void) {
    this._duration = duration;
    this._time = this._duration;
    this._interval = null;
    this._timeout = null;
    this.onFinish = onFinish;
  }

  start() {
    if (this._interval) {
      clearInterval(this._interval);
    }
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
    this._timeout = setTimeout(() => {
      this.onFinish("request");
    }, 1000);
    this._interval = setInterval(() => {
      if (this._time <= 1) {
        this.onFinish("request");
        this.reset();
        return;
      }
      this._time -= 1;
      if (this._time % 60 === 0) console.log(this._time);
    }, 1000);
  }

  reset(getData: boolean = false, type: FetchType = "request") {
    this._time = this._duration;
    if (getData) {
      this.onFinish(type);
    }
  }

  stop() {
    if (this._interval) clearInterval(this._interval);
    if (this._timeout) clearTimeout(this._timeout);
    this._interval = null;
    this._timeout = null;
    this._time = this._duration;
  }

  set interval(value: number) {
    this._duration = value;
    console.log(this._duration);
  }
}

export default Timer;
