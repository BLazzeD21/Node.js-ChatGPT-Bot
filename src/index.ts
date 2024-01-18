import { SessionStore } from 'telegraf';
import { Context, Telegraf, session } from 'telegraf';
import { Redis } from '@telegraf/session/redis';
import { limit } from '@grammyjs/ratelimiter';
import fs from 'fs';

import { registerHandlers } from './handlers/handlersRegistration.js';
import { sendMessages } from './utils/sendMessages.js';
import { LEXICON_EN } from './lexicon/lexicon_en.js';
import { setMenu } from './keyboards/set_menu.js';
import { deleteWebHook } from './utils/deleteWebhook.js';

interface MyContext extends Context {
  myProp?: string
  myOtherProp?: number
}

let config: Config =
  process.env.NODE_ENV === 'production' ?
    JSON.parse(fs.readFileSync('config/production.json', 'utf8')) :
    JSON.parse(fs.readFileSync('config/default.json', 'utf8'));

const redisStorage: SessionStore<any> = Redis({
  url: config.REDIS_URL,
});

const updateConfigValue: UpdateConfigValue = async (updatedConfig: Config) => {
  config = updatedConfig;
};

const requestslimit: (ctx: Context, next: Function) => Promise<void> = limit({
  timeFrame: 60000,
  limit: 3,
  onLimitExceeded: (ctx: Context) => {
    ctx.reply(LEXICON_EN['tooManyRequests']);
  },
});

const bot: Telegraf = new Telegraf<MyContext>(config.BOT_TOKEN, {
  handlerTimeout: 180_000,
});

bot.use(session({ store: redisStorage }));

registerHandlers(bot, config, redisStorage, updateConfigValue, requestslimit);

if (process.env.NODE_ENV === 'production') {
  setMenu(bot);
  deleteWebHook(bot);
}

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

bot.launch({ dropPendingUpdates: true });

bot.telegram.getMe().then(async () => {
  await sendMessages(bot, config);
});
