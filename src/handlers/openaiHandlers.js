import { code } from 'telegraf/format';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';

import { openai } from '../openai.js';
import { converter } from '../converter.js';

import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';


export const textHandler = (config, sessions) => {
  return async (ctx) => {
    if (await checkAccess(config, ctx)) return;

    const sessionId = ctx.message.chat.id;
    sessions[sessionId] ??= createInitialSession();

    const processing = await ctx.reply(code(LEXICON_EN['processingText']));
    try {
      const text = ctx.message.text;
      sessions[sessionId].messages.push({
        role: openai.roles.USER,
        content: text,
      });

      const response = await openai.chat(sessions[sessionId].messages);

      if (response=='401') {
        throw new Error('Request failed with status code 401');
      }

      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT,
          content: response.content,
        });

        await ctx.reply(response.content, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply(LEXICON_EN['responseError'], { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.log(`${error.name}: ${error.message}`);
      await ctx.reply(
          `${LEXICON_EN['noResponce']}\n\n${error.name}: ${error.message}`,
      );
    } finally {
      await ctx.deleteMessage(processing.message_id);
    }
  };
};

export const voiceHandler = (config, sessions) => {
  return async (ctx) => {
    if (await checkAccess(config, ctx)) return;

    const sessionId = ctx.message.chat.id;
    sessions[sessionId] ??= createInitialSession();

    const processing = await ctx.reply(code(LEXICON_EN['processingVoice']));
    try {
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

      if (response=='401') {
        throw new Error('Request failed with status code 401');
      }

      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT,
          content: response.content,
        });

        await ctx.reply(response.content, { parse_mode: 'Markdown' });
      } else {
        await ctx.reply(LEXICON_EN['responseError'], { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.log(`${error.name}: ${error.message}`);
      await ctx.reply(
          `${LEXICON_EN['noResponce']}\n\n${error.name}: ${error.message}`,
      );
    } finally {
      await ctx.deleteMessage(processing.message_id);
    }
  };
};

export const imageHandler = (config) => {
  return async (ctx) => {
    if (await checkAccess(config, ctx)) return;

    const processing = await ctx.reply(code(LEXICON_EN['processingImage']));

    const requestText = ctx.message.text
        .replace('/image', '')
        .trim();

    if (!requestText) {
      await ctx.reply(LEXICON_EN['empty'], { parse_mode: 'HTML' });
      return;
    }

    const size = '1024x1024';
    const count = 1;

    openai.getImage(requestText, size, count).then( async (response) => {
      if (response) {
        await ctx.replyWithPhoto({ url: response }, { caption: requestText });
        return;
      }
    }).catch(async (error) => {
      console.log(`${error.name} imageHandler: ${error.message}`);
      await ctx.reply(
          `${LEXICON_EN['noResponce']}\n\n${error.name}: ${error.message}`,
      );
    }).finally(async () => {
      await ctx.deleteMessage(processing.message_id);
    });
  };
};
