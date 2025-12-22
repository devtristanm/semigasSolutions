// Example serverless function for handling API calls
// This file demonstrates how to create API endpoints in Vercel

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Example: Handle contact form submissions
  if (req.method === 'POST' && req.url === '/api/contact') {
    try {
      const { name, email, message } = req.body;

      // Validate input
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Here you would typically:
      // 1. Send an email using a service like SendGrid, Mailgun, or Resend
      // 2. Save to a database
      // 3. Send to a CRM system

      // Example: Log the submission (replace with actual email/database logic)
      console.log('Contact form submission:', { name, email, message });

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message. We will get back to you soon!'
      });
    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Example: Handle external API calls (proxy)
  if (req.method === 'GET' && req.url.startsWith('/api/proxy')) {
    try {
      const targetUrl = req.query.url;
      
      if (!targetUrl) {
        return res.status(400).json({ error: 'Missing URL parameter' });
      }

      // Fetch from external API
      const response = await fetch(targetUrl);
      const data = await response.json();

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error proxying request:', error);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
  }

  // Default response
  return res.status(404).json({ error: 'Not found' });
}

