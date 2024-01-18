import { Context, SessionStore } from 'telegraf';
import fs from 'fs';
import { code } from 'telegraf/format';
import { OpenAI } from 'openai';

import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { openai } from '../openai.js';

import { converter } from '../converter.js';
import { deleteFile } from '../utils/deleteFile.js';

import { menuKeyboard } from '../keyboards/keyboards.js';
import { createInitialSession } from '../utils/createSession.js';
import { checkAccess } from '../utils/checkAccess.js';

import ErrorHandler from './errorHandler.js';

class OpenAIHandlers {
  private sendResponse = (
      ctx: Context,
      redisStorage: SessionStore<any>,
      userId: string,
  ) => {
    return async (response: OpenAI.Chat.Completions.ChatCompletionMessage) => {
      if (response && response.content) {
        redisStorage[userId].messages.push({
          role: openai.roles.ASSISTANT,
          content: response.content,
        });
      }

      await ctx
          .reply(response.content, { parse_mode: 'Markdown', ...menuKeyboard })
          .catch(async () => await ctx.reply(response.content, menuKeyboard));
    };
  };

  public textHandler = (config: Config, redisStorage: SessionStore<any>) => {
    return async (ctx: Context) => {
      if (await checkAccess(config, ctx)) return;

      const userId: string = ctx.message.chat.id.toString();
      redisStorage[userId] ??= createInitialSession();

      const processing = await ctx.reply(
          code(LEXICON_EN['processingText']),
          menuKeyboard,
      );

      await ctx.sendChatAction('typing');

      if (!(ctx.message && 'text' in ctx.message)) return;
      const content = ctx.message.text;

      redisStorage[userId].messages.push({
        role: openai.roles.USER,
        content: content,
      });

      openai
          .chat(redisStorage[userId].messages)
          .then(this.sendResponse(ctx, redisStorage, userId))
          .catch(ErrorHandler.responseError(ctx, 'textHandler'))
          .finally(async () => {
            await ctx.deleteMessage(processing.message_id);
          });
    };
  };

  public voiceHandler = (config: Config, redisStorage: SessionStore<any>) => {
    return async (ctx: Context) => {
      if (await checkAccess(config, ctx)) return;

      const userId: string = ctx.message.chat.id.toString();
      redisStorage[userId] ??= createInitialSession();

      const processingTranscription = await ctx.reply(
          code(LEXICON_EN['processingTranscription']),
          menuKeyboard,
      );

      await ctx.sendChatAction('typing');

      if (!fs.existsSync('build/voices')) {
        fs.mkdir('build/voices', (error) => {
          if (error) throw error;
          console.log(LEXICON_EN['folderCreated']);
        });
      }

      if (!(ctx.message && 'voice' in ctx.message)) return;
      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

      const oggPath = await converter.create(link.href, userId);
      const mp3Path = await converter.toMp3(oggPath.toString(), userId);

      openai
          .transcription(mp3Path.toString())
          .then(async (text) => {
            const processingVoice = await ctx.reply(
                code(LEXICON_EN['processingVoice']),
                menuKeyboard,
            );

            redisStorage[userId].messages.push({
              role: openai.roles.USER,
              content: text,
            });

            openai
                .chat(redisStorage[userId].messages)
                .then(this.sendResponse(ctx, redisStorage, userId))
                .catch(ErrorHandler.responseError(ctx, 'transcription'))
                .finally(async () => {
                  await ctx.deleteMessage(processingVoice.message_id);
                });
          })
          .catch(ErrorHandler.responseError(ctx, 'voiceHandler'))
          .finally(async () => {
            await deleteFile(mp3Path.toString());
            await ctx.deleteMessage(processingTranscription.message_id);
          });
    };
  };

  public imageHandler = (config: Config) => {
    return async (ctx: Context) => {
      if (await checkAccess(config, ctx)) return;

      const processing = await ctx.reply(
          code(LEXICON_EN['processingImage']),
          menuKeyboard,
      );
      await ctx.sendChatAction('upload_photo');

      if (!(ctx.message && 'text' in ctx.message)) return;
      const requestText = ctx.message.text.replace('/image', '').trim();

      if (!requestText) {
        await ctx.deleteMessage(processing.message_id);
        await ctx.reply(LEXICON_EN['empty'], {
          parse_mode: 'HTML',
          ...menuKeyboard,
        });
        return;
      }

      const size = '1024x1024';
      const count = 1;

      openai
          .getImage(requestText, size, count)
          .then(async (response) => {
            if (response) {
              await ctx.replyWithPhoto(
                  { url: response },
                  { caption: requestText, ...menuKeyboard },
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
