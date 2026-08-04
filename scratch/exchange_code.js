const axios = require('axios');

async function exchange() {
  const code = process.env.MIRO_CODE;
  const clientId = "3458764679937095261";
  const clientSecret = "2Uci2HJVKRiV77WklNBMPz2ZRWS616rD";
  const redirectUri = "http://localhost:3000"; // Or the redirect URI configured in Miro

  if (!code) {
    console.error("Error: MIRO_CODE environment variable is not set.");
    console.error("Please run the script with: MIRO_CODE=your_code node exchange_code.js");
    process.exit(1);
  }

  try {
    console.log("Exchanging Miro authorization code for access token...");
    const res = await axios.post('https://api.miro.com/v1/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri
      }
    });

    console.log("Token exchange successful!");
    console.log("Access Token:", res.data.access_token);
    console.log("Refresh Token:", res.data.refresh_token);
    console.log("\nYou can now run the Miro board creator with:");
    console.log(`MIRO_ACCESS_TOKEN=${res.data.access_token} node create_miro_board.js`);
  } catch (error) {
    console.error("Token Exchange Error:", error.response ? error.response.data : error.message);
  }
}

exchange();
