

## Plan: Enable Email Verification for New Registrations

### What This Does
When a new architect registers, they will receive a verification email with a confirmation link. They must click the link before they can sign in. This prevents fake accounts and ensures valid email addresses.

### How It Works
Lovable Cloud already sends default verification emails automatically. The only changes needed are:

1. **Disable auto-confirm on email signups** — Currently, new accounts are auto-confirmed (no email check). We'll turn this off so verification is required.

2. **Update the Auth page** — After registration, show a clear message telling the user to check their inbox and click the verification link. Remove the ambiguous "or log in if auto-confirmed" text.

3. **Handle the verification callback** — Ensure the `emailRedirectTo` URL correctly brings verified users back to the app and logs them in.

### Technical Details

| Step | Change |
|------|--------|
| Disable auto-confirm | Use `cloud--configure_auth` to set `enable_signup = true` with email confirmation required |
| Update `src/pages/Auth.tsx` | After successful signup, show "Check your email for a verification link" message instead of navigating away. Clear the form. |
| Update `src/contexts/AuthContext.tsx` | No changes needed — `onAuthStateChange` already handles session updates when the user confirms via the link |

No custom email templates or email domain setup is needed — the built-in default verification emails will handle this securely out of the box.

