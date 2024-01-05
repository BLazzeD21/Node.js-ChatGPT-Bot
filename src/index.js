import { Telegraf, session } from 'telegraf';
import fs from 'fs';

import { getUsersArray } from './utils/checkAccess.js';
import { sendMessages } from './utils/sendMessages.js';
import { LEXICON_EN } from './lexicon/lexicon_en.js';
import { setMenu } from './keyboards/set_menu.js';
import { deleteWebHook } from './utils/deleteWebhook.js';

import { Redis } from '@telegraf/session/redis';
import { limit } from '@grammyjs/ratelimiter';
import { registerHandlers } from './handlers/handlersRegistration.js';

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

registerHandlers(
    bot,
    config,
    redisStorage,
    updateConfigValue,
    requestslimit,
);

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
