#!/usr/bin/env node

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const fs = require('fs');
const { google } = require('googleapis');

const TOKEN_PATH = './token.json';
const CREDENTIALS_PATH = './credentials.json';
const MY_TASKS_ID = 'MTEyODExNzYzMDMyNzY0NTczNTg6MDow';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const listTasks = (auth, taskListId) => {
  const service = google.tasks({ version: 'v1', auth });
  service.tasks.list(
    {
      tasklist: taskListId
    },
    (err, res) => {
      if (err) return console.error(`The API returned an error: ${err}`);
      const tasks = res.data.items;
      if (tasks) {
        tasks.forEach((task) => {
          console.log(`- ${task.title}`);
        });
      } else {
        console.log('No tasks found');
      }
    }
  );
};

const addTask = (auth, taskListId, taskTitle) => {
  const service = google.tasks({ version: 'v1', auth });
  service.tasks.insert(
    {
      tasklist: taskListId,
      resource: {
        title: taskTitle
      }
    },
    (err) => {
      if (err) return console.error(`The API returned an error: ${err}`);
      console.log(`Added task: ${taskTitle}`);
    }
  );
};

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
    callback(oAuth2Client, MY_TASKS_ID, flags.title);
  });
};

(async () => {
  init({ clear });
  input.includes(`help`) && cli.showHelp(0);

  debug && log(flags);

  if (input.includes('list')) {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
      if (err) return console.error(`Error loading client secret file: ${err}`);
      authorize(JSON.parse(content), listTasks);
    });
  }

  if (input.includes('add')) {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
      if (err) return console.error(`Error loading client secret file: ${err}`);
      authorize(JSON.parse(content), addTask);
    });
  }
})();
