import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";

import { LEXICON_EN } from "./lexicon/lexicon_en.js";
import { setMenu } from "./keyboards/set_menu.js";
import { deleteWebHook } from "./utils/deleteWebhook.js";
import { sendMessages } from "./utils/sendMessages.js";

import {
  startHandler,
  helpHandler,
  chatIDHandler,
  newHandler,
  imageHandler,
  passwordHandler,
} from "./handlers/userHandlers.js";
import { textHandler, voiceHandler } from "./handlers/otherHandlers.js";

const sessions = {};

const bot = new Telegraf(config.get("BOT_TOKEN"));

const allowedUserId = config
  .get("USERS_ID")
  .split(",")
  .map((id) => parseInt(id));

bot.use(session());

bot.command("start", startHandler(sessions));
bot.command("new", newHandler(allowedUserId, sessions));
bot.command("help", helpHandler(allowedUserId));
bot.command("image", imageHandler(allowedUserId));
bot.command("chatid", chatIDHandler());
bot.command("password", passwordHandler());

bot.hears(LEXICON_EN["getIDs_btn"], chatIDHandler());
bot.hears(LEXICON_EN["password_btn"], passwordHandler());
bot.hears(LEXICON_EN["reset_btn"], newHandler(allowedUserId, sessions));

bot.on(message("text"), textHandler(allowedUserId, sessions));
bot.on(message("voice"), voiceHandler(allowedUserId, sessions));

setMenu(bot);
deleteWebHook(bot);

bot.launch({ dropPendingUpdates: true })
  .then(sendMessages(bot, allowedUserId));

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
