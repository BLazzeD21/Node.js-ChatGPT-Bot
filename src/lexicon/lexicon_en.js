export const commands = [
  { command: 'start', description: 'Update the bot' },
  { command: 'new', description: 'Open a new session' },
  { command: 'help', description: 'Find out the bot\'s capabilities' },
  { command: 'image', description: 'Creating an image based on a text query' },
  { command: 'chatid', description: 'Find the chat ID and your ID' },
  { command: 'add', description: 'Adding new users' },
  { command: 'remove', description: 'Removing users' },
  { command: 'show', description: 'List of all elevated users' },
];

const date = new Date();

export const LEXICON_EN = {
  botStarted: `Bot has been started! 🤖\n\n${date}`,
  commands: 'Custom commands set successfully',
  webhook: 'Webhook deleted successfully',
  start:
  'Hello, welcome to an artificial intelligence chatbot ' +
  'that will help you with everything! 🤖\n\nYou can find ' +
  'the source code of the bot here:\nhttps://github.com/BLazzeD21/Node.js-ChatGPT-Bot',
  deniedAccess: 'This functionality is not available to you ⛔️',
  processingText: 'Text accepted for processing',
  processingVoice: 'Voice message accepted for processing',
  processingImage: 'The request to generate an'+
  'image was accepted for processing',
  responseError: 'Your request could not be processed or ' +
  'the number of requests has been exceeded, please try again.  ' +
  '\n\nIf the problem is not solved, ' +
  'create a new session via /new or wait a little. ⚠️',
  noResponce: 'Sorry, no response received from the server ⛔️',
  empty: 'Make the right request\n\nWrite the command like this:\
  /image <i>request text</i>',
  emptyAdd: 'Make the right request\n\nWrite the command like this:\
  /add <i>id</i>',
  removeAdd: 'Make the right request\n\nWrite the command like this:\
  /remove <i>id</i>',
  reset: 'The context has been reset.',
  reset_btn: 'Reset context 🗑',
  getIDs_btn: 'Get IDs 🗃',
  password_btn: 'Generate password 🎲',
  add: 'New user ID added successfully ⏬',
  remove: 'user ID deleted ⏫',
  super: 'You are not a super user 🔒',
  errorSending: 'Error sending message to: ',
  waiting: 'The server timed out waiting for a response ⚠️',
  noUser: 'There is no user with this ID ⚠️',
  tooManyRequests: 'Please refrain from sending too many requests 🔔',
  UserNotExists: 'User ID does not exist 🔒',
};

export const getIDs = async (chatId, userId) => {
  return `Your ID: <code>${userId}</code>\n`+
  `This chat ID: <code>${chatId}</code>`;
};

export const getHelp = async () => {
  let helpMessage = 'Commands available in the bot:\n';

  for (const key in commands) {
    helpMessage += `/${commands[key]['command']}` +
    ' - ' +
    `${commands[key]['description']}\n`;
  }

  return helpMessage;
};

export const messageSent = async (recipientId) => {
  return `Message sent to user ID: ${recipientId}`;
};

export const errorWhileSending = async (error) => {
  return `Error sending message: ${error}`;
};

export const printPassword = async (password) => {
  return `<b>Generated password</b>:\n<code>${password}</code>`;
};
