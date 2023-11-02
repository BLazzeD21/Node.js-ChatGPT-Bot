import { LEXICON_EN, getIDs, getHelp, printPassword } from "../lexicon/lexicon_en.js";
import { createMenuKeyboard } from "../keyboards/keyboards.js";
import { code } from "telegraf/format";
import { openai } from "../openai.js";

import { createInitialSession } from "../utils/createSession.js";
import { checkAccess } from "../utils/checkAccess.js";
import { generatePassword } from "../utils/generatePassword.js";

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
    await ctx.reply(await getHelp(), menuKeyboard);
  };
};

export const chatIDHandler = () => {
  return async (ctx) => {
    const userId = ctx.from.id;
    const chatId = ctx.message.chat.id;

    await ctx.reply(
      await getIDs(chatId, userId),
      { parse_mode: "HTML" },
      menuKeyboard
    );
  };
};

export const passwordHandler = () => {
  return async (ctx) => {
    const password = await generatePassword();
    await ctx.reply(await printPassword(password), { parse_mode: "HTML" });
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

    const requestText = ctx.message.text
      .replace("/image", "")
      .trim();
    if (!requestText){
      await ctx.reply(LEXICON_EN['empty'], { parse_mode: "HTML" });
      return;
    }

    const processing = await ctx.reply(code(LEXICON_EN["processing"]));

    const size = "1024x1024";
    const count = 1;

    const imageUrl = await openai.getImage(requestText, size, count);

    await ctx.deleteMessage(processing.message_id);

    if (imageUrl) {
      await ctx.replyWithPhoto({ url: imageUrl }, { caption: requestText });
      return;
    }

    await ctx.reply(LEXICON_EN["security"]);
  };
};
