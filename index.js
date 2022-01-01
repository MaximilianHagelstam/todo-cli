const fs = require('fs');
const { google } = require('googleapis');

const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.error(`Error loading client secret file: ${err}`);
  authorize(JSON.parse(content), listMyTasks);
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

const listMyTasks = (auth) => {
  const TASKLIST_ID = 'MTEyODExNzYzMDMyNzY0NTczNTg6MDow';
  const service = google.tasks({ version: 'v1', auth });

  service.tasks.list(
    {
      tasklist: TASKLIST_ID
    },
    (err, res) => {
      if (err) return console.error(`The API returned an error: ${err}`);
      const tasks = res.data.items;
      if (tasks) {
        console.log(`Tasks from ${TASKLIST_ID}:`);
        tasks.forEach((task) => {
          console.log(`${task.title} (${task.id})`);
        });
      } else {
        console.log('No tasks found.');
      }
    }
  );

  // service.tasklists.list(
  //   {
  //     maxResults: 10
  //   },
  //   (err, res) => {
  //     if (err) return console.error(`The API returned an error: ${err}`);
  //     const taskLists = res.data.items;
  //     if (taskLists) {
  //       console.log('Task lists:');
  //       taskLists.forEach((taskList) => {
  //         console.log(`${taskList.title} (${taskList.id})`);
  //       });
  //     } else {
  //       console.log('No task lists found.');
  //     }
  //   }
  // );
};
