export class HerokuAppError {
    msg
    data
    statusCode
    constructor(msg, data, statusCode) {
        this.msg = msg;
        this.data = data;
        this.statusCode = statusCode;
    }
}