import { code } from 'telegraf/format';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';

import { openai } from '../openai.js';
import { converter } from '../converter.js';
import { deleteFile } from '../utils/deleteFile.js';

import { menuKeyboard } from '../keyboards/keyboards.js';
import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';

import ErrorHandler from './errorHandler.js';

class OpenAIHandlers {
  sendResponse = (ctx, sessions, sessionId) => {
    return async (response) => {
      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT,
          content: response.content,
        });
      }

      await ctx.reply(
          response.content, { parse_mode: 'Markdown' }, menuKeyboard,
      ).catch(
          async () => await ctx.reply(response.content, menuKeyboard),
      );
    };
  };

  textHandler = (config, sessions) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const sessionId = ctx.message.chat.id;
      sessions[sessionId] ??= createInitialSession();

      const processing = await ctx.reply(
          code(LEXICON_EN['processingText']),
          menuKeyboard);

      ctx.sendChatAction('typing');

      const content = ctx.message.text;

      sessions[sessionId].messages.push({
        role: openai.roles.USER,
        content: content,
      });

      openai
          .chat(sessions[sessionId].messages)
          .then(this.sendResponse(ctx, sessions, sessionId),
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

      const processingTranscription = await ctx.reply(
          code(LEXICON_EN['processingTranscription']),
          menuKeyboard);

      ctx.sendChatAction('typing');

      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      const userId = String(ctx.message.from.id);

      const oggPath = await converter.create(link.href, userId);
      const mp3Path = await converter.toMp3(oggPath, userId);

      openai
          .transcription(mp3Path)
          .then(async (text) => {
            const processingVoice = await ctx.reply(
                code(LEXICON_EN['processingVoice']),
                menuKeyboard);

            sessions[sessionId].messages.push({
              role: openai.roles.USER,
              content: text,
            });

            openai
                .chat(sessions[sessionId].messages)
                .then(this.sendResponse(ctx, sessions, sessionId))
                .catch(ErrorHandler.responseError(ctx, 'transcription'))
                .finally(async () => {
                  await ctx.deleteMessage(processingVoice.message_id);
                });
          })
          .catch(ErrorHandler.responseError(ctx, 'voiceHandler'))
          .finally(async () => {
            await deleteFile(mp3Path);
            await ctx.deleteMessage(processingTranscription.message_id);
          });
    };
  };

  imageHandler = (config) => {
    return async (ctx) => {
      if (await checkAccess(config, ctx)) return;

      const processing = await ctx.reply(
          code(LEXICON_EN['processingImage']),
          menuKeyboard);
      ctx.sendChatAction('upload_photo');

      const requestText = ctx.message.text.replace('/image', '').trim();

      if (!requestText) {
        await ctx.deleteMessage(processing.message_id);
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
