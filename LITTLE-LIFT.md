# Little Lift — no-signup edition

Public bill wall with category filtering and pagination; anonymous posting with optional redacted image; direct PayPal.Me handoff; private management links to resolve or remove requests.

## Run locally

Use Node 22.13+ and `npm ci`, then `npm run build`. Apply the two migrations in `drizzle/` in order using the local D1 instructions in README.md. Run `npm run dev -- --port 5173`.

The app uses Sites D1 (`DB`) and R2 (`BUCKET`). It does not need Supabase login, email delivery, or PayPal API credentials. Legacy auth files are retained but are not used by the bill flows.

## Verification

- `node --test lib/*.test.mjs`
- `npx tsc --noEmit`
- `npm run build`
- Local API checks exercised anonymous posting, token ownership, cross-origin rejection, resolving/removing posts, and image access.
- Browser checks exercised posting, PayPal handoff (without transferring money), and mobile layout.

## Payment and ownership behavior

Payment occurs entirely on PayPal. The app cannot verify payments, recipient identity, or bill authenticity. Resolution is explicitly uploader-reported. A private link is a bearer capability: keep it private; anyone holding it can manage that bill. Only its SHA-256 hash is stored. There is no recovery if the link is lost. Images must be redacted by uploaders; resizing removes metadata in the normal browser upload flow but does not obscure visible personal information.

Anonymous posting has a honeypot and a per-PayPal-profile limit of five open/recent requests. These are basic controls, not verified identity or comprehensive abuse prevention. Deleted/resolved bill images cannot be fetched publicly. Historic account-owned records are preserved, but cannot be managed using a new private link.

## Publication

Public hosting approved by the owner. Existing Sites project: appgprj_6aee5ed8adac819189e8bbbb13567d5c. Local test data is not included in deployment. Portfolio inclusion is deferred until the owner has tested the live app.

## Optional management-link email
Users may request one email when posting, sent through Resend from littlelift@neelkamalrana.com. Configure RESEND_API_KEY as a Sites secret; never commit its value. Emails and raw management tokens are not stored in bill records. Resend processes the recipient address and private link for delivery. The UI reports API acceptance, not guaranteed inbox delivery, and always presents the private link. Sending stops when more than 90 bills have been created that UTC day; provider limits also apply. There is no resend/recovery endpoint. Delivery failure does not undo posting. Keep open/click tracking disabled for these private links.
