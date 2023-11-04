import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import fs from 'fs';

import { getUsersArray } from './utils/checkAccess.js';
import { sendMessages } from './utils/sendMessages.js';
import { LEXICON_EN } from './lexicon/lexicon_en.js';
import { setMenu } from './keyboards/set_menu.js';
import { deleteWebHook } from './utils/deleteWebhook.js';

import {
  startHandler, helpHandler, chatIDHandler,
  newHandler, passwordHandler,
} from './handlers/userHandlers.js';
import { textHandler, voiceHandler, imageHandler,
} from './handlers/openaiHandlers.js';
import { addHandler, showHandler,
} from './handlers/adminHandlers.js';

const sessions = {};

let config;

if (process.env.NODE_ENV === 'production') {
  config = JSON.parse(fs.readFileSync('config/production.json', 'utf8'));
} else {
  config = JSON.parse(fs.readFileSync('config/default.json', 'utf8'));
}

const bot = new Telegraf(config.BOT_TOKEN, { handlerTimeout: 12_000_000 });

const updateConfigValue = async (updatedConfig) => {
  config = updatedConfig;
};

bot.use(session());

bot.command('start', startHandler(sessions));

bot.command('add', addHandler(config, updateConfigValue));

bot.command('show', showHandler(config));

bot.command('new', newHandler(config, sessions));
bot.command('help', helpHandler(config));
bot.command('image', imageHandler(config));
bot.command('chatid', chatIDHandler());
bot.command('password', passwordHandler());

bot.hears(LEXICON_EN['getIDs_btn'], chatIDHandler());
bot.hears(LEXICON_EN['password_btn'], passwordHandler());
bot.hears(LEXICON_EN['reset_btn'], newHandler(config, sessions));

bot.on(message('text'), textHandler(config, sessions));
bot.on(message('voice'), voiceHandler(config, sessions));

bot.catch(async (error, ctx) => {
  if (error.name === 'TimeoutError') {
    return ctx.reply(LEXICON_EN['waiting']);
  }
});

// setMenu(bot);
// deleteWebHook(bot);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch({ dropPendingUpdates: true });
//  .then(sendMessages(bot, await getUsersArray(config)));
