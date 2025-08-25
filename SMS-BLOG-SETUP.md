# SMS Blog Setup Guide

Your SMS-to-blog system is ready! Here's how to complete the setup:

## 🚀 1. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy your site
netlify init
netlify deploy
netlify deploy --prod
```

## 🔑 2. Environment Variables

In your **Netlify dashboard** → **Site settings** → **Environment variables**, add:

```bash
# Your phone number (with country code)
AUTHORIZED_PHONE_NUMBER=+1234567890

# GitHub credentials for auto-updating posts
GITHUB_TOKEN=ghp_your_github_personal_access_token
GITHUB_REPO=yourusername/my-personal-app

# Optional: Auto-rebuild trigger
NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/your_hook_id
```

## 🔧 3. GitHub Token Setup

1. Go to **GitHub** → **Settings** → **Developer settings** → **Personal access tokens**
2. Create **Classic token** with these permissions:
   - `repo` (Full control of private repositories)
   - `public_repo` (Access public repositories)
3. Copy the token and add to Netlify env vars

## 📱 4. Twilio Configuration

### Get Phone Number
1. **Twilio Console** → **Phone Numbers** → **Buy a Number**
2. Choose a number that supports SMS

### Set Webhook
1. **Phone Numbers** → **Manage** → **Active numbers**
2. Click your number
3. Set **Webhook URL** to:
   ```
   https://your-site-name.netlify.app/.netlify/functions/sms-webhook
   ```
4. **HTTP Method**: POST

## ✅ 5. Test the System

1. **Text your Twilio number** from your authorized phone
2. Check **Netlify Functions logs** for processing
3. Refresh your **Updates page** to see new posts

## 📝 6. Content Types Supported

- **Text**: Regular messages
- **Images**: Photo attachments  
- **Videos**: Video attachments
- **Links**: Messages containing URLs (auto-detected)

## 🎯 Example Messages

```
Text: "Just had an amazing coffee ☕"
Link: "Check this out: https://example.com"
Image: Send photo with caption "Beautiful sunset today"
```

## 🛠️ Troubleshooting

### Posts not appearing?
- Check Netlify function logs
- Verify environment variables
- Ensure GitHub token has correct permissions
- Check that branch name in webhook matches your repo

### Webhook not receiving messages?
- Verify Twilio webhook URL
- Check phone number format (+1234567890)
- Test with Twilio debugger

### Build not triggering?
- Add `NETLIFY_BUILD_HOOK` environment variable
- Get build hook from **Site settings** → **Build & deploy** → **Build hooks**

## 🎨 Customization

- Edit `src/components/Updates.css` for styling
- Modify `public/data/posts.json` structure if needed
- Add new content types in webhook function

Your SMS blog is ready! 🎉