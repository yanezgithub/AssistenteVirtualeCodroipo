const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Generate auth URL
router.get('/url', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar']
  });
  res.json({ url });
});

// OAuth callback
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    res.send(`
      <h1>Authentication Successful!</h1>
      <p>Your refresh token: <code>${tokens.refresh_token}</code></p>
      <p>Add this to your .env file as GOOGLE_REFRESH_TOKEN</p>
      <p>You can close this window now.</p>
    `);
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).send('Error during authentication');
  }
});

module.exports = router;
