# Deployment Guide for Semigas Solutions Website

This guide will help you deploy your website to Vercel with custom domain support, easy updates, API call handling, and domain redirects.

## Prerequisites

1. A GitHub account (or GitLab/Bitbucket)
2. A Vercel account (free tier available)
3. Your custom domain(s)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize git in your project folder (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect your project settings
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain

1. In your Vercel dashboard, go to your project
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your main domain (e.g., `semigassolutions.com`)
5. Follow the DNS configuration instructions:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record pointing to Vercel's IP addresses

## Step 4: Set Up Domain Redirects

To redirect other domains to your main domain:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add each additional domain you want to redirect
3. For each additional domain, you have two options:

### Option A: Redirect at DNS Level (Recommended)
Configure your DNS provider to redirect the domain to your main domain.

### Option B: Redirect via Vercel
Add a redirect rule in `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://yourmaindomain.com/$1",
      "permanent": true
    }
  ]
}
```

## Step 5: Enable Automatic Deployments

Vercel automatically deploys when you push to your main branch:

1. Every time you push to GitHub, Vercel will:
   - Build your site
   - Deploy it automatically
   - Update your live site

2. You can also set up preview deployments for pull requests

## Step 6: Handle API Calls

### Using Serverless Functions

1. Create API endpoints in the `/api` folder
2. Example: `api/contact.js` for contact form submissions
3. Access them at: `https://yourdomain.com/api/contact`

### Example: Update Contact Form

Update your contact form in `index.html` to use the API:

```javascript
// In script.js, update the form submission handler:
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: this.querySelector('input[type="text"]').value,
        email: this.querySelector('input[type="email"]').value,
        message: this.querySelector('textarea').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            alert('Message sent successfully!');
            this.reset();
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    }
});
```

### External API Calls

If you need to call external APIs, use serverless functions as a proxy to avoid CORS issues:

```javascript
// In your frontend code
fetch('/api/proxy?url=https://external-api.com/endpoint')
    .then(response => response.json())
    .then(data => console.log(data));
```

## Step 7: Environment Variables (Optional)

If you need API keys or secrets:

1. Go to **Settings** → **Environment Variables**
2. Add your variables
3. Access them in serverless functions via `process.env.VARIABLE_NAME`

## Updating Your Website

### Easy Updates via Git

1. Make changes to your files locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update website content"
   git push
   ```
3. Vercel automatically deploys the changes (usually within 1-2 minutes)

### Manual Updates via Vercel Dashboard

1. Go to your project in Vercel
2. Use the Vercel CLI or dashboard to redeploy

## Troubleshooting

### Domain Not Working
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Ensure DNS records are correctly configured
- Wait up to 48 hours for DNS propagation

### API Calls Not Working
- Check Vercel function logs in the dashboard
- Ensure CORS headers are set correctly
- Verify the API route path matches your fetch URL

### Build Errors
- Check the build logs in Vercel dashboard
- Ensure all file paths are correct
- Verify all dependencies are listed in `package.json`

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Domain Configuration](https://vercel.com/docs/concepts/projects/domains)
- [Serverless Functions Guide](https://vercel.com/docs/concepts/functions/serverless-functions)

## Support

For issues with:
- **Vercel**: Check their [documentation](https://vercel.com/docs) or [support](https://vercel.com/support)
- **Domain/DNS**: Contact your domain registrar
- **Website Code**: Review the code in this repository

