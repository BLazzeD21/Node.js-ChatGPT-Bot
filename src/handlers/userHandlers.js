import {
  LEXICON_EN, getIDs,
  getHelp, printPassword,
} from '../lexicon/lexicon_en.js';
import { createMenuKeyboard } from '../keyboards/keyboards.js';

import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';
import { generatePassword } from '../utils/generatePassword.js';

const menuKeyboard = createMenuKeyboard();

class UserHandlers {
  startHandler = (sessions) => {
    return async (ctx) => {
      const sessionId = ctx.message.chat.id;
      sessions[sessionId] = createInitialSession();
      await ctx.reply(LEXICON_EN['start'], menuKeyboard);
    };
  };

  helpHandler = (config) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;
      await ctx.reply(await getHelp(), menuKeyboard);
    };
  };

  chatIDHandler = () => {
    return async (ctx) => {
      const userId = ctx.from.id;
      const chatId = ctx.message.chat.id;

      await ctx.reply(
          await getIDs(chatId, userId),
          { parse_mode: 'HTML' },
          menuKeyboard,
      );
    };
  };

  passwordHandler = () => {
    return async (ctx) => {
      const password = await generatePassword();
      await ctx.reply(await printPassword(password), { parse_mode: 'HTML' });
    };
  };

  newHandler = (config, sessions) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const sessionId = ctx.message.chat.id;
      sessions[sessionId] = createInitialSession();
      await ctx.reply(LEXICON_EN['reset'], menuKeyboard);
    };
  };
}

export default new UserHandlers();

