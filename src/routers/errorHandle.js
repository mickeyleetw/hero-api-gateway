class HeroAppError {
  constructor(msg, data, statusCode) {
    this.msg = msg;
    this.data = data;
    this.statusCode = statusCode;
  }
}

export default HeroAppError;
