const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        return Promise.resolve(requestHandler(req, res, next))
            .catch((error) => {
                console.error("Error occurred in async handler:", error);
                next(error);
            });
    };
};

export default asyncHandler;