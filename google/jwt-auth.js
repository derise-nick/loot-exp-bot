require("dotenv").config();
const { google } = require("googleapis");

module.exports = {
  /**
   * Initializes authentication and authorization for the Google APIs
   */
  init() {
    // configure a JWT auth client and store it in the module for future use
    let jwtClient = new google.auth.JWT(
      process.env.DISCORD_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    jwtClient.authorize(logAuth);
    this.authRecord = jwtClient;
  },
  authRecord: null,
};
function logAuth(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected to Google Sheets!");
  }
}
