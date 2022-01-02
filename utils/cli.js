const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
  clear: {
    type: 'boolean',
    default: false,
    alias: 'c',
    desc: 'Clear the console'
  },
  debug: {
    type: 'boolean',
    default: false,
    alias: 'd',
    desc: 'Print debug info'
  },
  version: {
    type: 'boolean',
    alias: 'v',
    desc: 'Print CLI version'
  },
  title: {
    type: 'string',
    alias: 't',
    default: 'Empty todo',
    desc: 'Todo title'
  }
};

const commands = {
  help: { desc: 'Print help info' }
};

const helpText = meowHelp({
  name: 'todo-cli',
  flags,
  commands
});

const options = {
  inferType: true,
  description: false,
  hardRejection: false,
  flags
};

module.exports = meow(helpText, options);
