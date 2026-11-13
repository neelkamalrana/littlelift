declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    RESEND_API_KEY?: string;
    SUPABASE_URL?: string;
    SUPABASE_PUBLISHABLE_KEY?: string;
    AUTH_EMAIL_ENABLED?: string;
    AUTH_PHONE_ENABLED?: string;
    BUCKET?: R2Bucket;
  }
}
