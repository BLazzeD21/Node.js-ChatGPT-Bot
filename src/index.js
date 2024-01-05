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

let config =
  process.env.NODE_ENV === 'production' ?
    JSON.parse(fs.readFileSync('config/production.json', 'utf8')) :
    JSON.parse(fs.readFileSync('config/default.json', 'utf8'));

const redisStorage = new Redis({
  store: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

const updateConfigValue = async (updatedConfig) => {
  config = updatedConfig;
};

const requestslimit = limit({
  timeFrame: 60000,
  limit: 3,
  onLimitExceeded: (ctx) => {
    ctx.reply(LEXICON_EN['tooManyRequests']);
  },
});

const bot = new Telegraf(config.BOT_TOKEN, { handlerTimeout: 180_000 });

bot.use(session({ redisStorage }));

bot.command('start', UserHandlers.startHandler(redisStorage));

bot.command('add', AdminHandlers.addHandler(config, updateConfigValue));
bot.command('remove', AdminHandlers.removeHandler(config, updateConfigValue));
bot.command('show', AdminHandlers.showHandler(config));

bot.command('new', UserHandlers.newHandler(config, redisStorage));
bot.command('help', UserHandlers.helpHandler(config));
bot.command('password', UserHandlers.passwordHandler());

bot.hears(LEXICON_EN['getIDs_btn'], UserHandlers.chatIDHandler());
bot.hears(LEXICON_EN['password_btn'], UserHandlers.passwordHandler());
bot.hears(LEXICON_EN['reset_btn'],
    UserHandlers.newHandler(config, redisStorage));

bot.command('image',
    requestslimit,
    OpenAIHandlers.imageHandler(config),
);
bot.on(message('text'),
    requestslimit,
    OpenAIHandlers.textHandler(config, redisStorage),
);
bot.on(message('voice'),
    requestslimit,
    OpenAIHandlers.voiceHandler(config, redisStorage),
);

bot.catch(async (error, ctx) => {
  if (error.name === 'TimeoutError') {
    return ctx.reply(LEXICON_EN['waiting']);
  }
});

if (process.env.NODE_ENV === 'production') {
  setMenu(bot);
  deleteWebHook(bot);
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot
    .launch({ dropPendingUpdates: true })
    .then(
    process.env.NODE_ENV === 'production' ?
      sendMessages(bot, await getUsersArray(config)) :
      0,
    );
