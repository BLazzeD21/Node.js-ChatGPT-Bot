import UserHandlers from './userHandlers.js';
import OpenAIHandlers from './openaiHandlers.js';
import AdminHandlers from './adminHandlers.js';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { message } from 'telegraf/filters';

export const registerHandlers = async (
    bot,
    config,
    redisStorage,
    updateConfigValue,
    requestslimit,
) => {
  bot.command('start',
      UserHandlers.startHandler(redisStorage));
  bot.command('add',
      AdminHandlers.addHandler(config, updateConfigValue));
  bot.command('remove',
      AdminHandlers.removeHandler(config, updateConfigValue));
  bot.command('show',
      AdminHandlers.showHandler(config));
  bot.command('new',
      UserHandlers.newHandler(config, redisStorage));
  bot.command('help',
      UserHandlers.helpHandler(config));
  bot.command('password',
      UserHandlers.passwordHandler());
  bot.hears(
      LEXICON_EN['getIDs_btn'],
      UserHandlers.chatIDHandler(),
  );

  bot.hears(
      LEXICON_EN['password_btn'],
      UserHandlers.passwordHandler(),
  );

  bot.hears(
      LEXICON_EN['reset_btn'],
      UserHandlers.newHandler(config, redisStorage),
  );

  bot.command(
      'image',
      requestslimit,
      OpenAIHandlers.imageHandler(config),
  );
  bot.on(
      message('text'),
      requestslimit,
      OpenAIHandlers.textHandler(config, redisStorage),
  );
  bot.on(
      message('voice'),
      requestslimit,
      OpenAIHandlers.voiceHandler(config, redisStorage),
  );

  bot.catch(async (error, ctx) => {
    if (error.name === 'TimeoutError') {
      await ctx.reply(LEXICON_EN['waiting']);
    }
  });
};
