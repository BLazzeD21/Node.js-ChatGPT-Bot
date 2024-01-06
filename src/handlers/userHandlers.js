import {
  LEXICON_EN, getIDs,
  getHelp, printPassword,
} from '../lexicon/lexicon_en.js';
import { menuKeyboard } from '../keyboards/keyboards.js';

import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';
import { generatePassword } from '../utils/generatePassword.js';

class UserHandlers {
  startHandler = (sessions) => {
    return async (ctx) => {
      const sessionId = ctx.message.chat.id;

      sessions[sessionId] = createInitialSession();

      await ctx.reply(LEXICON_EN['start'],
          { parse_mode: 'Markdown', ...menuKeyboard },
      );
    };
  };

  helpHandler = (config) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      await ctx.reply(getHelp(), menuKeyboard);
    };
  };

  chatIDHandler = () => {
    return async (ctx) => {
      const userId = ctx.from.id;
      const chatId = ctx.message.chat.id;

      await ctx.reply(
          getIDs(chatId, userId),
          { parse_mode: 'HTML', ...menuKeyboard },
      );
    };
  };

  passwordHandler = () => {
    return async (ctx) => {
      const password = await generatePassword();

      await ctx.reply(
          printPassword(password),
          { parse_mode: 'HTML', ...menuKeyboard },
      );
    };
  };

  newHandler = (config, sessions) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const sessionId = ctx.message.chat.id;
      sessions[sessionId] = createInitialSession();
      await ctx.reply(LEXICON_EN['reset'],
          menuKeyboard);
    };
  };
}

export default new UserHandlers();

