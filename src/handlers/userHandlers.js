import { LEXICON_EN, getIDs, getHelp } from '../lexicon/lexicon_en.js';
import { createMenuKeyboard } from '../keyboards/keyboards.js';

import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';

const menuKeyboard = createMenuKeyboard();

export const startHandler = (sessions) => {
  return async (ctx) => {
    const sessionId = ctx.message.chat.id;
    sessions[sessionId] = createInitialSession();
    await ctx.reply(LEXICON_EN['start'], menuKeyboard);
  };
};

export const helpHandler = (allowedUserId) => {
  return async (ctx) => {
    if (await checkAccess(allowedUserId, ctx)) return;
    ctx.reply(getHelp(), menuKeyboard);
  };
};

export const chatIDHandler = () => {
  return async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.message.chat.id;

    await ctx.reply(
      getIDs(chatId, userId),
      { parse_mode: 'HTML' },
      menuKeyboard
    );
  };
};

export const newHandler = (allowedUserId, sessions) => {
  return async (ctx) => {
    if (await checkAccess(allowedUserId, ctx)) return;

    const sessionId = ctx.message.chat.id;
    sessions[sessionId] = createInitialSession();
    await ctx.reply(LEXICON_EN['reset'], menuKeyboard);
  };
};