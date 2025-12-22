# Domain Setup Guide

This guide explains how to set up custom domains and redirects for your website.

## Main Domain Setup

### Step 1: Add Domain in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your main domain (e.g., `semigassolutions.com`)

### Step 2: Configure DNS

Vercel will provide you with DNS records to add. Choose one method:

#### Option A: CNAME Record (Recommended)
- **Type**: CNAME
- **Name**: `@` or `www` (depending on your provider)
- **Value**: `cname.vercel-dns.com`

#### Option B: A Records
- **Type**: A
- **Name**: `@`
- **Value**: Vercel's IP addresses (provided in dashboard)

### Step 3: Wait for DNS Propagation

- DNS changes can take up to 48 hours to propagate
- Check status: [whatsmydns.net](https://www.whatsmydns.net)
- Vercel dashboard will show when domain is active

## Setting Up Domain Redirects

You want multiple domains to redirect to your main domain. Here are the options:

### Method 1: DNS-Level Redirect (Best for SEO)

Configure redirects at your DNS provider level:

1. **Cloudflare** (if using):
   - Go to DNS settings
   - Add a Page Rule: `http://otherdomain.com/*` → `https://maindomain.com/$1` (301 redirect)

2. **Other DNS Providers**:
   - Most providers offer URL forwarding/redirects
   - Set up a 301 redirect from `otherdomain.com` to `maindomain.com`

### Method 2: Vercel Redirects (Alternative)

If you want to host multiple domains on Vercel and redirect:

1. Add all domains in Vercel dashboard (Settings → Domains)

2. Update `vercel.json` with redirect rules:

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://semigassolutions.com/$1",
      "permanent": true,
      "has": [
        {
          "type": "host",
          "value": "olddomain.com"
        }
      ]
    },
    {
      "source": "/(.*)",
      "destination": "https://semigassolutions.com/$1",
      "permanent": true,
      "has": [
        {
          "type": "host",
          "value": "anotherdomain.com"
        }
      ]
    }
  ]
}
```

### Method 3: Separate Vercel Projects (For Different Content)

If you need different content on different domains:

1. Create separate Vercel projects
2. Deploy the same codebase to each
3. Configure each with its own domain

## Example: Multiple Domain Setup

Let's say you have:
- **Main domain**: `semigassolutions.com`
- **Redirect domains**: `semigas.com`, `semigassolutions.net`

### Setup Process:

1. **Main Domain** (`semigassolutions.com`):
   - Add to Vercel
   - Configure DNS with CNAME to `cname.vercel-dns.com`
   - This is your primary site

2. **Redirect Domains** (`semigas.com`, `semigassolutions.net`):
   - Option A: Set up DNS redirects at registrar level (301 redirect)
   - Option B: Add to Vercel and use `vercel.json` redirects

### Recommended Approach:

**Use DNS-level redirects** for redirect domains because:
- ✅ Better for SEO (proper 301 redirects)
- ✅ Faster (no extra server processing)
- ✅ Simpler configuration
- ✅ No Vercel project limits

## Testing Redirects

After setting up redirects:

1. Visit `http://otherdomain.com` (should redirect to main domain)
2. Check redirect type: Should be 301 (permanent)
3. Verify HTTPS: Ensure SSL certificates are active

## SSL Certificates

Vercel automatically provides SSL certificates for all domains:
- Free SSL via Let's Encrypt
- Automatic renewal
- HTTPS by default

## Troubleshooting

### Domain Not Redirecting
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Verify redirect rules in `vercel.json`
- Check Vercel domain status in dashboard

### SSL Certificate Issues
- Wait up to 24 hours for automatic SSL provisioning
- Ensure DNS is correctly configured
- Check Vercel dashboard for SSL status

### Multiple Domains Not Working
- Verify all domains are added in Vercel
- Check redirect rules match domain names exactly
- Ensure DNS is configured for each domain

## Quick Reference

### DNS Records for Main Domain
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### Redirect Configuration
- **DNS-level**: Configure at domain registrar
- **Vercel-level**: Use `vercel.json` redirects
- **Type**: Always use 301 (permanent) for SEO

## Need Help?

- [Vercel Domain Docs](https://vercel.com/docs/concepts/projects/domains)
- [Vercel Redirects](https://vercel.com/docs/concepts/projects/domains/redirects)
- Contact your domain registrar for DNS redirect setup

