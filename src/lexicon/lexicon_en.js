export const commands = [
  { command: 'start', description: 'Update the bot' },
  { command: 'new', description: 'Open a new session' },
  { command: 'help', description: "Find out the bot's capabilities" },
  { command: 'chatid', description: 'Find the chat ID and your ID' },
];

export const LEXICON_EN = {
  start:
    'Hello, welcome to an artificial intelligence chatbot that will help you with everything! 🤖\n\nYou can find the source code of the bot here:\nhttps://github.com/BLazzeD21/Node.js-ChatGPT-Bot',
  deniedAccess: 'This functionality is not available to you ⛔️',
  processing: 'Text accepted for processing',
  manyRequests:
    'You are sending too many requests, the server is not able to process your messages in time ⚠️',
  noResponce: 'Sorry, no response received from the server ⛔️',
  reset: 'The context has been reset.',
  reset_btn: 'Reset context 🗑',
  getIDs_btn: 'Get IDs 🗃',
};

export const getIDs = (chatId, userId) => {
  return `Your ID: <code>${userId}</code>\nThis chat ID: <code>${chatId}</code>`;
};

export const getHelp = () => {
  let helpMessage = 'Commands available in the bot:\n';

  for (let key in commands) {
    helpMessage += `/${commands[key]['command']} - ${commands[key]['description']}\n`;
  }

  return helpMessage;
};

export const printError = (error) => {
  return `${error.name}: ${error.message}`;
};
