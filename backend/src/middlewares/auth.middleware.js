import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Authorization: Bearer <token> to find token remove bearer keyword
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!accessToken) {
            throw new ApiError(401, "Access token is missing");
        }
        
        const decodedToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "Invalid access token");
        }
        
        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid access token");
        } else if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Access token expired");
        } else if (error instanceof ApiError) {
            throw error;
        } else {
            throw new ApiError(401, "Invalid or expired access token");
        }
    }
});

