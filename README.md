# Semigas Solutions Website

A modern, responsive website for Semigas Solutions featuring animated backgrounds, smooth transitions, and a comprehensive service showcase.

## Features

- 🎨 Modern, animated UI with molecular-themed backgrounds
- 📱 Fully responsive design
- ⚡ Fast loading with optimized assets
- 🔄 Smooth section transitions
- 📧 Contact form with API integration
- 🎯 SEO-friendly structure

## Quick Start

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser

## Deployment

This website is configured for deployment on **Vercel** with support for:
- ✅ Custom domains
- ✅ Easy updates via Git
- ✅ API endpoints (serverless functions)
- ✅ Domain redirects

### Quick Deploy

1. Push your code to GitHub
2. Import to Vercel: [vercel.com/new](https://vercel.com/new)
3. Add your custom domain in Vercel settings
4. Done! Your site is live

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # JavaScript functionality
├── assets/             # Images, videos, logos
├── api/                # Serverless functions
│   ├── contact.js      # Contact form handler
│   └── example.js      # Example API endpoint
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies

```

## API Endpoints

### Contact Form
- **Endpoint**: `/api/contact`
- **Method**: POST
- **Body**: `{ name, email, message }`
- **Response**: `{ success: true, message: "..." }`

To enable email notifications, update `api/contact.js` with your email service credentials.

## Customization

### Update Content
- Edit `index.html` for page content
- Modify `styles.css` for styling
- Adjust `script.js` for functionality

### Add API Endpoints
Create new files in the `/api` folder following the pattern in `api/example.js`

### Domain Redirects
Configure redirects in `vercel.json` or via Vercel dashboard.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For deployment help, see [DEPLOYMENT.md](./DEPLOYMENT.md)

