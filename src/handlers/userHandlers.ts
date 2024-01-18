import {
  LEXICON_EN, getIDs,
  getHelp, printPassword,
} from '../lexicon/lexicon_en.js';
import { menuKeyboard } from '../keyboards/keyboards.js';

import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';
import { generatePassword } from '../utils/generatePassword.js';
import { Context, SessionStore } from 'telegraf';

class UserHandlers {
  public startHandler = (redisStorage: SessionStore<any>) => {
    return async (ctx: Context) => {
      const sessionId: number = ctx.message.chat.id;

      redisStorage[sessionId] = createInitialSession();

      await ctx.reply(LEXICON_EN['start'],
          { parse_mode: 'Markdown', ...menuKeyboard },
      );
    };
  };

  public helpHandler = (config: Config) => {
    return async (ctx: Context) => {
      if (await checkAccess(config, ctx)) return;

      await ctx.reply(getHelp(), menuKeyboard);
    };
  };

  public chatIDHandler = () => {
    return async (ctx: Context) => {
      const userId: number = ctx.from.id;
      const chatId: number = ctx.chat.id;

      await ctx.reply(
          getIDs(chatId, userId),
          { parse_mode: 'HTML', ...menuKeyboard },
      );
    };
  };

  public passwordHandler = () => {
    return async (ctx: Context) => {
      const password = await generatePassword();

      await ctx.reply(
          printPassword(password),
          { parse_mode: 'HTML', ...menuKeyboard },
      );
    };
  };

  public newHandler = (config: Config, redisStorage: SessionStore<any>) => {
    return async (ctx: Context) => {
      if (await checkAccess(config, ctx)) return;

      const sessionId: number = ctx.message.chat.id;

      redisStorage[sessionId] = createInitialSession();
      await ctx.reply(LEXICON_EN['reset'],
          menuKeyboard);
    };
  };
}

export default new UserHandlers();

