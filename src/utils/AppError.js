class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Ye default Error class ko message bhej dega
        this.statusCode = statusCode; // Ye humara custom status code set kar dega
    }
}

module.exports = {AppError};