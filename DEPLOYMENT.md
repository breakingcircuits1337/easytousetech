# Deployment Guide for easy to use .tech

## Netlify Deployment

### Prerequisites
1. Netlify account
2. Repository connected to Netlify
3. Stripe account with API keys

### Environment Variables Required

Add these in Netlify Site Settings > Environment Variables:

```bash
STRIPE_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
DATABASE_URL=file:./dev.db
NODE_ENV=production
```

### Stripe Webhook

For Stripe webhook to work, you'll need:
1. A deployed site URL
2. Configure Stripe webhook endpoint: `https://your-site.netlify.app/api/stripe/webhook`
3. Get `STRIPE_WEBHOOK_SECRET` from Stripe webhook settings
4. Add `STRIPE_WEBHOOK_SECRET` to Netlify environment variables

### Build Settings

Netlify automatically detects the `.netlify.toml` file:
- Build command: `bun run build`
- Publish directory: `.next`
- Node version: 18.x or higher

### Deployment Steps

1. Push code to Git repository
2. Netlify auto-deploys on push
3. Configure environment variables in Netlify dashboard
4. Set up Stripe webhook
5. Test payment flow

### Testing Before Production

1. Test all services locally: `bun run dev`
2. Test Stripe checkout with test keys
3. Verify all pages load correctly
4. Test mobile responsiveness

### Production Checklist

- [ ] All environment variables set in Netlify
- [ ] Stripe webhook configured
- [ ] Test payment flow works
- [ ] SSL/HTTPS enabled (automatic on Netlify)
- [ ] Custom domain configured (optional)
- [ ] Contact info is correct
- [ ] All services display correctly

### Known Issues

**Console errors in development**: These are normal Next.js development warnings and don't affect production builds.

**Stripe test mode**: Use test keys (sk_test_...) for development, switch to live keys (sk_live_...) for production.

## Database

The site uses SQLite with Prisma. The database file is located at:
- Development: `./dev.db`
- Production: Netlify builds are read-only, so the database won't persist across deployments.

For persistent data in production, consider using:
- Vercel Postgres
- PlanetScale MySQL
- Supabase PostgreSQL
- Railway PostgreSQL

## Support

For deployment issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test with production build locally: `bun run build && bun run start`
4. Contact Netlify support if needed
