export class HeroAppError {
  msg
  data
  status_code
  constructor(msg, data, status_code) {
    this.msg = msg;
    this.data = data;
    this.status_code = status_code;
  }
}