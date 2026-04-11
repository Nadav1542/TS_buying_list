import {} from 'express';
// Enforce an async Express handler signature so rejected promises can be forwarded.
export const catchAsync = (fn) => {
    return (req, res, next) => {
        // Forward async errors to Express error middleware.
        fn(req, res, next).catch(next);
    };
};
//# sourceMappingURL=catchAsync.js.map