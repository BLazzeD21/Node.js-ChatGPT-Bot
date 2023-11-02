import { code } from 'telegraf/format';
import { LEXICON_EN, printError } from '../lexicon/lexicon_en.js';

import { openai } from '../openai.js';
import { converter } from '../converter.js';

import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';

export const textHandler = (allowedUserId, sessions) => {
  return async (ctx) => {
    if (await checkAccess(allowedUserId, ctx)) return;

    const sessionId = ctx.message.chat.id;
    sessions[sessionId] ??= createInitialSession();
    try {
      const processing = await ctx.reply(code(LEXICON_EN['processing']));
      const text = ctx.message.text;
      sessions[sessionId].messages.push({
        role: openai.roles.USER,
        content: text,
      });

      const response = await openai.chat(sessions[sessionId].messages);
      
      await ctx.deleteMessage(processing.message_id);

      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT,
          content: response.content,
        });
        await ctx.reply(response.content);
      } else {
        await ctx.reply(LEXICON_EN['manyRequests']);
      }
    } catch (error) {
      console.log(await printError(error));
      await ctx.reply(LEXICON_EN['noResponce']);
    }
  };
};

export const voiceHandler = (allowedUserId, sessions) => {
  return async (ctx) => {
    if (await checkAccess(allowedUserId, ctx)) return;

    const sessionId = ctx.message.chat.id;
    sessions[sessionId] ??= createInitialSession();
    try {
      const processing = await ctx.reply(code(LEXICON_EN['processing']));
      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      const userId = String(ctx.message.from.id);
      const oggPath = await converter.create(link.href, userId);
      const mp3Path = await converter.toMp3(oggPath, userId);
      const text = await openai.transcription(mp3Path);
      sessions[sessionId].messages.push({
        role: openai.roles.USER,
        content: text,
      });

      const response = await openai.chat(sessions[sessionId].messages);

      await ctx.deleteMessage(processing.message_id);
      
      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT,
          content: response.content,
        });
        await ctx.reply(response.content);
      } else {
        await ctx.reply(LEXICON_EN['manyRequests']);
      }
    } catch (error) {
      console.log(printError(error));
      await ctx.reply(LEXICON_EN['noResponce']);
    }
  };
};
