export const commands: Command[] = [
  { command: "start", description: "Update the bot" },
  { command: "new", description: "Open a new session" },
  { command: "help", description: "Find out the bot's capabilities" },
  { command: "image", description: "Creating an image based on a text query" },
];

const date: Date = new Date();

export const LEXICON_EN = {
  botStarted: `Bot has been started! 🤖\n\n${date}`,
  commands: "Custom commands set successfully",
  webhook: "Webhook deleted successfully",
  folderCreated: "Folder created successfully",
  start:
    "Hello, welcome to an artificial intelligence chatbot " +
    "that will help you with everything! 🤖\n\nYou can find " +
    "the source code of the bot here: [click](https://github.com/BLazzeD21/Node.js-ChatGPT-Bot)\n" +
    "Developer: @blazzed21\n",
  deniedAccess: "This functionality is not available to you ⛔️",
  processingText: "Text accepted for processing",
  processingTranscription: "Voice message accepted for translation into text",
  processingVoice: "Voice message accepted for processing",
  processingImage:
    "The request to generate an" + "image was accepted for processing",
  responseError:
    "Your request could not be processed or " +
    "the number of requests has been exceeded, please try again.  " +
    "\n\nIf the problem is not solved, " +
    "create a new session via /new or wait a little. ⚠️",
  noResponce: "Sorry, no response received from the server ⛔️",
  empty:
    "Make the right request\n\nWrite the command like this:\
  /image <i>request text</i>",
  emptyAdd:
    "Make the right request\n\nWrite the command like this:\
  /add <i>id</i>",
  removeAdd:
    "Make the right request\n\nWrite the command like this:\
  /remove <i>id</i>",
  reset: "The context has been reset.",
  reset_btn: "Reset context 🗑",
  getIDs_btn: "Get IDs 🗃",
  password_btn: "Generate password 🎲",
  add: "New user ID added successfully ⏬",
  remove: "user ID deleted ⏫",
  super: "You are not a super user 🔒",
  errorSending: "Error sending message to: ",
  waiting: "The server timed out waiting for a response ⚠️",
  noUser: "There is no user with this ID ⚠️",
  tooManyRequests:
    "API requests are only available 3 times every 60 seconds 🔔",
  UserNotExists: "User ID does not exist 🔒",
};

export const getIDs = (chatId: number, userId: number) => {
  return (
    `Your ID: <code>${userId.toString()}</code>\n` +
    `This chat ID: <code>${chatId.toString()}</code>`
  );
};

export const getHelp = () => {
  let helpMessage: string = "Commands available in the bot:\n";

  for (const key in commands) {
    helpMessage +=
      `/${commands[key]["command"]}` +
      " - " +
      `${commands[key]["description"]}\n`;
  }

  return helpMessage;
};

export const printPassword = (password: string) => {
  return `<b>Generated password</b>:\n<code>${password}</code>`;
};
