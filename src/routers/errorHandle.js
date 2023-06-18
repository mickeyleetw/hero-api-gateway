class HeroAppError extends Error{
  constructor(msg, data, statusCode) {
    this.msg = msg;
    this.data = data;
    this.statusCode = statusCode;
  }
}

export default HeroAppError;
