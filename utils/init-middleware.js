// utils/init-middleware.js
const initMiddleware = (middleware) => {
    return (req, res, next) =>
        middleware(req, res, (result) => (result instanceof Error ? next(result) : next()));
};

export default initMiddleware;
