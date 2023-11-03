export const commands = [
  { command: 'start', description: 'Update the bot' },
  { command: 'new', description: 'Open a new session' },
  { command: 'help', description: "Find out the bot's capabilities" },
  { command: 'image', description: 'Creating an image based on a text query' },
  { command: 'chatid', description: 'Find the chat ID and your ID' },
  { command: 'add', description: 'Adding new users' },
  { command: 'remove', description: 'Removing users' },
  {command: 'show', description: 'List of all elevated users'},
];

let date = new Date();

export const LEXICON_EN = {
  botStarted: `Bot has been started! 🤖\n\n${date}`,
  commands: 'Custom commands set successfully',
  commandsError: 'Error setting custom commands: ',
  webhook: 'Webhook deleted successfully',
  webhookError: 'Error deleting webhook: ',
  start:
    'Hello, welcome to an artificial intelligence chatbot that will help you with everything! 🤖\n\nYou can find the source code of the bot here:\nhttps://github.com/BLazzeD21/Node.js-ChatGPT-Bot',
  deniedAccess: 'This functionality is not available to you ⛔️',
  processing: 'Text accepted for processing',
  manyRequests:
    'You are sending too many requests, the server is not able to process your messages in time ⚠️',
  noResponce: 'Sorry, no response received from the server ⛔️',
  security: 'Your request was rejected by openai\'s security system 🚔',
  empty: 'Make the right request\n\nWrite the command like this: /image <i>request text</i>',
  emptyAdd: 'Make the right request\n\nWrite the command like this: /add <i>id</i>',
  reset: 'The context has been reset.',
  reset_btn: 'Reset context 🗑',
  getIDs_btn: 'Get IDs 🗃',
  password_btn: 'Generate password 🎲',
  add: 'New user ID added successfully ⏬',
  added: 'You have been successfully added to the system. Welcome! ❤️',
  remove: 'user ID deleted ⏫',
  super: 'You are not a super user 🔒',
  errorSending: 'Error sending message to: ',
  waiting: 'The server timed out waiting for a response ⚠️',
  noUser: 'There is no user with this ID ⚠️',
};

export const getIDs = async (chatId, userId) => {
  return `Your ID: <code>${userId}</code>\nThis chat ID: <code>${chatId}</code>`;
};

export const getHelp = async () => {
  let helpMessage = 'Commands available in the bot:\n';

  for (let key in commands) {
    helpMessage += `/${commands[key]['command']} - ${commands[key]['description']}\n`;
  }

  return helpMessage;
};

export const printError = async (error) => {
  return `${error.name}: ${error.message}`;
};

export const messageSent = async (recipient_id) => {
  return `Message sent to user ID: ${recipient_id}`;
};

export const errorWhileSending = async (error) => {
  return `Error sending message:: ${error}`;
};

export const printPassword = async (password) => {
  return `<b>Generated password</b>:\n<code>${password}</code>`
}
