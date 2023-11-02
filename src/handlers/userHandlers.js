import { LEXICON_EN, getIDs, getHelp } from "../lexicon/lexicon_en.js";
import { createMenuKeyboard } from "../keyboards/keyboards.js";
import { code } from "telegraf/format";
import { openai } from "../openai.js";

import { createInitialSession } from "../utils/createSession.js";
import { checkAccess } from "../utils/checkAccess.js";

const menuKeyboard = createMenuKeyboard();

export const startHandler = (sessions) => {
  return async (ctx) => {
    const sessionId = ctx.message.chat.id;
    sessions[sessionId] = createInitialSession();
    await ctx.reply(LEXICON_EN["start"], menuKeyboard);
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
      { parse_mode: "HTML" },
      menuKeyboard
    );
  };
};

export const newHandler = (allowedUserId, sessions) => {
  return async (ctx) => {
    if (await checkAccess(allowedUserId, ctx)) return;

    const sessionId = ctx.message.chat.id;
    sessions[sessionId] = createInitialSession();
    await ctx.reply(LEXICON_EN["reset"], menuKeyboard);
  };
};

export const imageHandler = (allowedUserId) => {
  return async (ctx) => {
    if (await checkAccess(allowedUserId, ctx)) return;

    const processing = await ctx.reply(code(LEXICON_EN["processing"]));

    const size = "1024x1024";
    const count = 1;
    const requestText = ctx.message.text.replace("/image", "").trim();

    const imageUrl = await openai.getImage(requestText, size, count);

    await ctx.deleteMessage(processing.message_id);

    if (imageUrl) {
      await ctx.replyWithPhoto({ url: imageUrl }, { caption: requestText });
      return;
    }

    await ctx.reply(LEXICON_EN["security"]);
  };
};
