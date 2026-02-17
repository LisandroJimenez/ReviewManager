import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        msg: "Has alcanzado el límite de peticiones por hora. Intenta de nuevo en 60 minutos."
    }
})

export default limiter;