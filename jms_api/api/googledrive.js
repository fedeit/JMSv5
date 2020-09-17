const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const firebase = require('./../api/firebase.js');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}


module.exports = {
  uploadFile: function(id, mime, filepath, req, res) {
    // Load client secrets from a local file.
    fs.readFile('./credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorize(JSON.parse(content), function(auth) {
        const drive = google.drive({version: 'v3', auth});
        var folderId = '1f2yIGRB_LCzR1GaOgxoDQJcCTKAhsE3L';
        const fileMetadata = {
          'name': id,
          parents: [folderId]
        };

        const media = {
          mimeType: mime,
          body: fs.createReadStream(filepath)
        };

        drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id'
        }, (err, file) => {
          if (err) {
            console.error(err);
          } else {
            req.body.imageId = file.data.id;
            firebase.saveSocialmediaPost(req, res);
          }
        });
      });
    });
  }
};
