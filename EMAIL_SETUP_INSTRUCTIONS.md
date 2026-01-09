# Email Setup Instructions

## Current Status
The contact form is currently set up to send emails to **contactus@semigassolutions.com**, but it requires configuration.

## Option 1: EmailJS (Recommended - Free Tier Available)

### Setup Steps:
1. Go to https://www.emailjs.com/ and create a free account
2. Create an Email Service:
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your email account
3. Create an Email Template:
   - Click "Create New Template"
   - Use this template structure:
     ```
     Subject: {{subject}}
     
     New {{contact_type}} from {{from_name}}
     
     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     Referral Source: {{referral_source}}
     
     Message:
     {{message}}
     ```
4. Get your credentials:
   - Public Key (from Account > General)
   - Service ID (from your Email Service)
   - Template ID (from your Email Template)
5. Update `script.js`:
   - Find `EMAILJS_CONFIG` (around line 600)
   - Replace:
     - `YOUR_PUBLIC_KEY` with your Public Key
     - `YOUR_SERVICE_ID` with your Service ID
     - `YOUR_TEMPLATE_ID` with your Template ID

## Option 2: Formspree (Easiest - No Setup Required)

1. Go to https://formspree.io/ and create a free account
2. Create a new form
3. Get your form endpoint (e.g., `https://formspree.io/f/YOUR_FORM_ID`)
4. Update the form submission in `script.js` to use Formspree

## Option 3: Backend API

If you have a backend server, you can send the form data to your API endpoint.

## Option 4: Webhook (Zapier, Make.com)

Set up a webhook that receives form data and sends emails automatically.

---

**Note:** Currently, if EmailJS is not configured, the form will fall back to opening the user's email client (mailto link) as a backup method.



