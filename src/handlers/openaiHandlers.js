import { code } from 'telegraf/format';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';

import { openai } from '../openai.js';
import { converter } from '../converter.js';

import { menuKeyboard } from '../keyboards/keyboards.js';
import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';

import ErrorHandler from './errorHandler.js';

class OpenAIHandlers {
  textHandler = (config, sessions) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const sessionId = ctx.message.chat.id;
      sessions[sessionId] ??= createInitialSession();

      const processing = await ctx.reply(
          code(LEXICON_EN['processingText']),
          menuKeyboard);

      const text = ctx.message.text;

      sessions[sessionId].messages.push({
        role: openai.roles.USER,
        content: text,
      });

      openai
          .chat(sessions[sessionId].messages)
          .then(async (response) => {
            if (response && response.content) {
              sessions[sessionId].messages.push({
                role: openai.roles.ASSISTANT,
                content: response.content,
              });
            }

            await ctx
                .reply(
                    response.content,
                    { parse_mode: 'Markdown' },
                    menuKeyboard);
          },
          ).catch(ErrorHandler.responseError(ctx, 'textHandler'),
          ).finally(async () => {
            await ctx.deleteMessage(processing.message_id);
          });
    };
  };

  voiceHandler = (config, sessions) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const sessionId = ctx.message.chat.id;
      sessions[sessionId] ??= createInitialSession();

      const processing = await ctx.reply(
          code(LEXICON_EN['processingVoice']),
          menuKeyboard);

      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      const userId = String(ctx.message.from.id);

      const oggPath = await converter.create(link.href, userId);
      const mp3Path = await converter.toMp3(oggPath, userId);

      openai
          .transcription(mp3Path)
          .then(async (text) => {
            sessions[sessionId].messages.push({
              role: openai.roles.USER,
              content: text,
            });

            openai
                .chat(sessions[sessionId].messages)
                .then(async (response) => {
                  sessions[sessionId].messages.push({
                    role: openai.roles.ASSISTANT,
                    content: response.content,
                  });

                  await ctx.reply(response.content, { parse_mode: 'Markdown' });
                })
                .catch(ErrorHandler.responseError(ctx, 'transcription'));
          })
          .catch(ErrorHandler.responseError(ctx, 'voiceHandler'))
          .finally(async () => {
            await ctx.deleteMessage(processing.message_id);
          });
    };
  };

  imageHandler = (config) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const processing = await ctx.reply(
          code(LEXICON_EN['processingImage']),
          menuKeyboard);

      const requestText = ctx.message.text.replace('/image', '').trim();

      if (!requestText) {
        await ctx.reply(LEXICON_EN['empty'], { parse_mode: 'HTML' });
        return;
      }

      const size = '1024x1024';
      const count = 1;

      openai
          .getImage(requestText, size, count)
          .then(async (response) => {
            if (response) {
              await ctx.replyWithPhoto(
                  { url: response }, { caption: requestText },
                  menuKeyboard,
              );
              return;
            }
          })
          .catch(ErrorHandler.responseError(ctx, 'textHandler'))
          .finally(async () => {
            await ctx.deleteMessage(processing.message_id);
          });
    };
  };
}

export default new OpenAIHandlers();
