const fs = require('fs');
const { google } = require('googleapis');

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.error(`Error loading client secret file: ${err}`);
  authorize(JSON.parse(content), listTaskLists);
});

const authorize = (credentials, callback) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return console.error(`Error authorizing token: ${err}`);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};

const listTaskLists = (auth) => {
  const service = google.tasks({ version: 'v1', auth });
  service.tasklists.list(
    {
      maxResults: 10
    },
    (err, res) => {
      if (err) return console.error(`The API returned an error: ${err}`);
      const taskLists = res.data.items;
      if (taskLists) {
        console.log('Task lists:');
        taskLists.forEach((taskList) => {
          console.log(`${taskList.title} (${taskList.id})`);
        });
      } else {
        console.log('No task lists found.');
      }
    }
  );
};
