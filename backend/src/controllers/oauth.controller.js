import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Generate access + refresh tokens
const generateAccessTokenandRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// GitHub OAuth Callback
export const githubCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    throw new ApiError(400, "Authorization code is missing");
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new ApiError(400, `GitHub OAuth error: ${tokenData.error_description || tokenData.error}`);
    }

    const { access_token } = tokenData;

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json'
      }
    });

    const githubUser = await userResponse.json();

    // Get user email if not public
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json'
        }
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find(e => e.primary && e.verified);
      email = primaryEmail ? primaryEmail.email : emails[0]?.email;
    }

    if (!email) {
      throw new ApiError(400, "Could not retrieve email from GitHub. Please make sure your GitHub email is verified.");
    }

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { githubId: githubUser.id.toString() },
        { email: email.toLowerCase() }
      ]
    });

    if (user) {
      // Update existing user
      if (!user.githubId) {
        user.githubId = githubUser.id.toString();
      }
      if (!user.profile_picture && githubUser.avatar_url) {
        user.profile_picture = githubUser.avatar_url;
      }
      user.authProvider = 'github';
      await user.save({ validateBeforeSave: false });
    } else {
      // Create new user
      const username = githubUser.login || email.split('@')[0];
      
      // Ensure unique username
      let uniqueUsername = username;
      let counter = 1;
      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }

      user = await User.create({
        username: uniqueUsername,
        email: email.toLowerCase(),
        fullname: githubUser.name || githubUser.login,
        githubId: githubUser.id.toString(),
        profile_picture: githubUser.avatar_url,
        authProvider: 'github',
        // No password for OAuth users
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error('GitHub OAuth Error:', error);
    const errorUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=${encodeURIComponent(error.message || 'GitHub authentication failed')}`;
    return res.redirect(errorUrl);
  }
});

// Google OAuth Callback (placeholder for future implementation)
export const googleCallback = asyncHandler(async (req, res) => {
  throw new ApiError(501, "Google OAuth not yet implemented");
});

// Initiate GitHub OAuth
export const githubAuth = asyncHandler(async (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email`;
  return res.redirect(githubAuthUrl);
});

// Initiate Google OAuth (placeholder)
export const googleAuth = asyncHandler(async (req, res) => {
  throw new ApiError(501, "Google OAuth not yet implemented");
});
