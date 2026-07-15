# 🔧 OAuth Setup Guide - GitHub Authentication

## Prerequisites
- GitHub account
- Backend running on a specific port (default: 3000)
- Frontend running on a specific port (default: 5173)

---

## Step 1: Create GitHub OAuth App

1. **Go to GitHub Developer Settings**
   - Navigate to: https://github.com/settings/developers
   - Or: GitHub Profile → Settings → Developer settings → OAuth Apps

2. **Click "New OAuth App"**

3. **Fill in Application Details:**

   | Field | Value |
   |-------|-------|
   | **Application name** | TaskMaster (or your app name) |
   | **Homepage URL** | `http://localhost:5173` (your frontend URL) |
   | **Application description** | Task management application with OAuth |
   | **Authorization callback URL** | `http://localhost:3000/api/v1/auth/github/callback` |

   ⚠️ **Important**: The callback URL must match exactly what's in your backend `.env` file

4. **Click "Register application"**

5. **Copy your credentials:**
   - **Client ID**: Will be visible immediately
   - **Client Secret**: Click "Generate a new client secret" and copy it immediately (you won't be able to see it again!)

---

## Step 2: Configure Backend Environment Variables

1. **Create/Update `.env` file** in `/workspace/backend/`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/taskmaster
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmaster

# JWT Secrets (generate random strings)
JWT_ACCESS_TOKEN=your_super_secret_access_token_key_here
JWT_REFRESH_TOKEN=your_super_secret_refresh_token_key_here
JWT_RESET_TOKEN=your_super_secret_reset_token_key_here

# Token Expiration
ACCESS_TOKEN_EXPIRES_IN=60m
REFRESH_TOKEN_EXPIRES_IN=10d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/api/v1/auth/github/callback

# Optional: Google OAuth (for future implementation)
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret
# GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

2. **Replace the following:**
   - `your_github_client_id_here` → Your actual GitHub Client ID
   - `your_github_client_secret_here` → Your actual GitHub Client Secret
   - JWT secrets → Generate random strings (use online generator or `openssl rand -hex 32`)
   - MONGODB_URI → Your MongoDB connection string

---

## Step 3: Verify Backend is Running

```bash
cd backend
npm install
npm start
```

**Expected output:**
```
Server running on port 3000
MongoDB connected successfully
```

**Test the OAuth endpoint:**
```bash
curl http://localhost:3000/api/v1/auth/github
```

Should redirect to GitHub authorization page.

---

## Step 4: Verify Frontend is Running

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 5: Test OAuth Flow

1. **Open browser**: http://localhost:5173/login

2. **Click "GitHub" button**
   - Should redirect to GitHub authorization page
   - URL should be: `https://github.com/login/oauth/authorize?client_id=...`

3. **Authorize the application**
   - GitHub will ask for permission
   - Click "Authorize [Your App Name]"

4. **Verify redirect**
   - Should redirect back to: `http://localhost:5173/auth/callback?accessToken=...&refreshToken=...`
   - Then redirect to: `http://localhost:5173/dashboard`

5. **Check LocalStorage** (Browser DevTools → Application → Local Storage):
   ```
   tm_access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   tm_refresh_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Problem**: GitHub callback URL doesn't match

**Solution**: 
1. Check `.env` file: `GITHUB_CALLBACK_URL` must be exactly: `http://localhost:3000/api/v1/auth/github/callback`
2. Check GitHub OAuth app settings: Authorization callback URL must match exactly
3. No trailing slashes!
4. Use `http://` not `https://` for local development

### Error: "Client authentication failed"
**Problem**: Invalid Client ID or Client Secret

**Solution**:
1. Regenerate Client Secret in GitHub settings
2. Copy the new secret immediately
3. Update `.env` file
4. Restart backend server

### Error: "Could not retrieve email from GitHub"
**Problem**: GitHub email is not public or not verified

**Solution**:
1. Go to GitHub → Settings → Emails
2. Verify your email address
3. Optionally make it public (or app will use primary email)

### OAuth redirects but shows error
**Problem**: Backend not running or environment variables incorrect

**Solution**:
1. Check backend logs for errors
2. Verify all `.env` variables are set
3. Check MongoDB is running and connected
4. Verify JWT secrets are set

### Tokens not stored in LocalStorage
**Problem**: OAuth callback page issue

**Solution**:
1. Check browser console for errors
2. Verify `OAuthCallback.jsx` component is loaded
3. Check route `/auth/callback` is registered in `App.jsx`

### Login successful but redirects to login again
**Problem**: Token validation failing

**Solution**:
1. Check JWT secrets match in `.env`
2. Verify tokens are stored with correct keys: `tm_access_token` and `tm_refresh_token`
3. Check `verifyJWT` middleware is working
4. Test `/api/v1/auth/me` endpoint with token

---

## Testing the Authentication

### Manual Testing Checklist

- [ ] **Register new user** with email/password
- [ ] **Login** with username and password
- [ ] **Login** with email and password
- [ ] **Logout** and verify tokens are cleared
- [ ] **GitHub OAuth** - first time user (creates account)
- [ ] **GitHub OAuth** - existing user (links account)
- [ ] **GitHub OAuth** - user with existing email (updates user)
- [ ] **Access protected route** without login (should redirect)
- [ ] **Access protected route** with login (should work)
- [ ] **Refresh page** after login (should stay logged in)
- [ ] **Try wrong password** (should show error)
- [ ] **Try non-existent user** (should show error)
- [ ] **Token refresh** works automatically

### Automated Testing

Run the comprehensive E2E test suite:

```bash
cd frontend
npm run test:e2e
```

Or run specific auth tests:

```bash
npx playwright test tests-e2e/auth-complete.spec.js
```

---

## Security Notes

### For Development:
- ✅ `http://localhost` is fine for testing
- ✅ Store secrets in `.env` (not committed to git)
- ✅ Use different secrets for each environment

### For Production:
- ⚠️ Use `https://` for all URLs
- ⚠️ Set `NODE_ENV=production`
- ⚠️ Use strong, random JWT secrets (32+ characters)
- ⚠️ Update GitHub OAuth app with production URLs:
  - Homepage URL: `https://yourdomain.com`
  - Callback URL: `https://yourdomain.com/api/v1/auth/github/callback`
- ⚠️ Enable `secure: true` for cookies in production
- ⚠️ Set proper CORS configuration
- ⚠️ Use environment variables for all secrets (never hardcode)

---

## API Endpoints Reference

### GitHub OAuth Flow

1. **Initiate OAuth**
   ```
   GET /api/v1/auth/github
   → Redirects to GitHub authorization
   ```

2. **GitHub Callback**
   ```
   GET /api/v1/auth/github/callback?code=<auth_code>
   → Exchanges code for tokens
   → Creates/updates user
   → Redirects to: /auth/callback?accessToken=xxx&refreshToken=xxx
   ```

3. **Frontend Callback Handler**
   ```
   GET /auth/callback?accessToken=xxx&refreshToken=xxx
   → Stores tokens in localStorage
   → Redirects to /dashboard
   ```

### Traditional Auth Flow

1. **Register**
   ```
   POST /api/v1/auth/register
   Body: { username, email, fullname, password }
   Response: { success, message, data: { safeUser } }
   ```

2. **Login**
   ```
   POST /api/v1/auth/login
   Body: { username/email, password }
   Response: { success, message, data: { safeUser, accessToken, refreshToken } }
   ```

3. **Get Current User**
   ```
   GET /api/v1/auth/me
   Headers: Authorization: Bearer <accessToken>
   Response: { success, message, data: { user } }
   ```

---

## FAQ

**Q: Can I use GitHub OAuth without email/password login?**
A: Yes! OAuth is independent. Users can sign up/login exclusively with GitHub.

**Q: What happens if a GitHub user already has an account with the same email?**
A: The system will link the GitHub account to the existing user account.

**Q: Can I add Google OAuth later?**
A: Yes! The structure is already in place. Follow the same pattern as GitHub OAuth.

**Q: How do I test OAuth in CI/CD?**
A: Use mocked OAuth responses or test accounts. See the E2E test suite for examples.

**Q: What if GitHub is down?**
A: Users can still login with email/password. OAuth is an additional option, not a replacement.

---

## Support

If you encounter issues:
1. Check backend logs: `backend/logs/` or console output
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Test each endpoint individually with curl or Postman
5. Review the comprehensive test suite for expected behavior

---

## Next Steps

- [ ] Set up production GitHub OAuth app
- [ ] Configure production environment variables
- [ ] Implement Google OAuth (optional)
- [ ] Add multi-factor authentication (optional)
- [ ] Set up email verification (optional)
- [ ] Configure rate limiting for auth endpoints
- [ ] Set up monitoring and logging

---

**🎉 You're all set! Your authentication system is now fully functional with GitHub OAuth support.**
