# Group Escape Houses - Vercel Deployment Guide

## 🚀 Deployment to Vercel

This Next.js application is configured for seamless deployment on Vercel.

**Last Updated**: December 15, 2025 - Ready for production deployment

### Prerequisites
- Vercel account
- Git repository (GitHub, GitLab, or Bitbucket)

### Environment Variables Setup

Before deploying, configure these environment variables in your Vercel dashboard:

#### Required Environment Variables

```bash
# Database Configuration
TURSO_CONNECTION_URL=your_turso_connection_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Authentication
BETTER_AUTH_SECRET=your_better_auth_secret

# Payment Processing
STRIPE_TEST_KEY=your_stripe_test_key
STRIPE_LIVE_KEY=your_stripe_live_key

# Email Service
RESEND_API_KEY=your_resend_api_key

# Autumn Configuration
AUTUMN_SANDBOX_SECRET_KEY=your_autumn_sandbox_key
AUTUMN_PRODUCTION_SECRET_KEY=your_autumn_production_key
AUTUMN_SECRET_KEY=your_autumn_secret_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### Deployment Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**
   - **Framework Preset**: Next.js (automatically detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (automatically set)
   - **Output Directory**: `.next` (automatically set)

3. **Environment Variables**
   - Add all required environment variables listed above
   - Set appropriate environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Post-Deployment Configuration

1. **Custom Domain** (Optional)
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `groupescapehouses.co.uk`)

2. **Update Environment Variables**
   - Update `NEXT_PUBLIC_APP_URL` with your production domain
   - Ensure all API keys are for production environment

3. **Database Migration**
   - Run any pending database migrations if needed
   - Verify database connectivity

### Vercel Configuration

The `vercel.json` file includes:
- Custom headers for security and caching
- Image optimization settings
- Function timeout configurations
- Build optimizations

### Monitoring & Maintenance

- **Analytics**: Enable Vercel Analytics in project settings
- **Error Monitoring**: Check function logs in Vercel dashboard
- **Performance**: Monitor Core Web Vitals in Vercel dashboard

### Troubleshooting

**Build Failures:**
- Check environment variables are properly set
- Verify database connectivity
- Check build logs in Vercel dashboard

**Runtime Errors:**
- Check function logs for API errors
- Verify external service integrations (Stripe, Resend, etc.)
- Check CORS and authentication configurations

### Security Notes

- All sensitive keys are stored as environment variables
- HTTPS is enforced by Vercel
- Security headers are configured in `vercel.json`

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database accessible and migrated
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Test deployment on preview environment
- [ ] Verify all pages load correctly
- [ ] Check canonical URLs are perfectly working
- [ ] Test PDF download functionality
- [ ] Verify destination page routing
- [ ] Confirm favicon displays correctly

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)