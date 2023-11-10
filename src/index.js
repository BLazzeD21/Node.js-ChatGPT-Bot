import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';
import fs from 'fs';

import { getUsersArray } from './utils/checkAccess.js';
import { sendMessages } from './utils/sendMessages.js';
import { LEXICON_EN } from './lexicon/lexicon_en.js';
import { setMenu } from './keyboards/set_menu.js';
import { deleteWebHook } from './utils/deleteWebhook.js';

import UserHandlers from './handlers/userHandlers.js';
import OpenAIHandlers from './handlers/openaiHandlers.js';
import AdminHandlers from './handlers/adminHandlers.js';

import { Redis } from '@telegraf/session/redis';
import { limit } from '@grammyjs/ratelimiter';

let config;

if (process.env.NODE_ENV === 'production') {
  config = JSON.parse(fs.readFileSync('config/production.json', 'utf8'));
} else {
  config = JSON.parse(fs.readFileSync('config/default.json', 'utf8'));
}

const store = Redis({
  store: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

const updateConfigValue = async (updatedConfig) => {
  config = updatedConfig;
};

const requestslimit = limit({
  timeFrame: 5000,
  limit: 2,
  onLimitExceeded: (ctx) => {
    ctx?.reply(LEXICON_EN['tooManyRequests']);
  },
});

const bot = new Telegraf(config.BOT_TOKEN, { handlerTimeout: 180_000 });

bot.use(session({ store }));
bot.use(requestslimit);

bot.command('start', UserHandlers.startHandler(store));

bot.command('add', AdminHandlers.addHandler(config, updateConfigValue));
bot.command('remove', AdminHandlers.removeHandler(config, updateConfigValue));
bot.command('show', AdminHandlers.showHandler(config));

bot.command('new', UserHandlers.newHandler(config, store));
bot.command('help', UserHandlers.helpHandler(config));
bot.command('chatid', UserHandlers.chatIDHandler());
bot.command('password', UserHandlers.passwordHandler());
bot.command('image', OpenAIHandlers.imageHandler(config));

bot.hears(LEXICON_EN['getIDs_btn'], UserHandlers.chatIDHandler());
bot.hears(LEXICON_EN['password_btn'], UserHandlers.passwordHandler());
bot.hears(LEXICON_EN['reset_btn'], UserHandlers.newHandler(config, store));

bot.on(message('text'), OpenAIHandlers.textHandler(config, store));
bot.on(message('voice'), OpenAIHandlers.voiceHandler(config, store));

bot.catch(async (error, ctx) => {
  if (error.name === 'TimeoutError') {
    return ctx.reply(LEXICON_EN['waiting']);
  }
});

setMenu(bot);
deleteWebHook(bot);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch({ dropPendingUpdates: true })
    .then(sendMessages(bot, await getUsersArray(config)));
