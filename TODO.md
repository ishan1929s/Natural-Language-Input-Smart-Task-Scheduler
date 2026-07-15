# Authentication Fixes TODO

## Critical Fixes
- [ ] Fix login navigation route (should go to '/' not '/dashboard')
- [ ] Fix login response data handling (backend returns `safeUser`, frontend expects `data.user`)
- [ ] Fix user state management in AuthProvider

## Forgot Password Feature
- [ ] Create ForgotPasswordPage component
- [ ] Add forgot password link to LoginPage
- [ ] Add forgot password API endpoint in backend
- [ ] Add password reset token generation and email sending
- [ ] Add reset password page with token validation
- [ ] Update auth routes and API

## Social Login Implementation
- [ ] Implement basic Google OAuth redirect
- [ ] Implement basic GitHub OAuth redirect
- [ ] Add OAuth callback handling
- [ ] Update social login buttons to actual functionality

## Testing
- [ ] Test login flow end-to-end
- [ ] Test registration flow
- [ ] Test forgot password flow
- [ ] Test social login flows
- [ ] Test password change
- [ ] Test profile update
- [ ] Test logout flow
