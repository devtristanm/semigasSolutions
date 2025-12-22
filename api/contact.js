// Contact form API endpoint
// Handles form submissions from the contact section

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        success: false 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        success: false 
      });
    }

    // TODO: Add your email service integration here
    // Options:
    // 1. SendGrid: https://sendgrid.com
    // 2. Mailgun: https://mailgun.com
    // 3. Resend: https://resend.com
    // 4. Nodemailer with SMTP
    // 5. Save to database (MongoDB, PostgreSQL, etc.)
    // 6. Send to CRM (Salesforce, HubSpot, etc.)

    // Example: Log the submission (replace with actual email/database logic)
    console.log('Contact form submission received:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

    // Example email service integration (using Resend as example):
    /*
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'contact@yourdomain.com',
        to: 'your-email@yourdomain.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });
    */

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      success: false 
    });
  }
}

