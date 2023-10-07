import { Telegraf, session, Markup } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'

import config from 'config'
import { LEXICON_EN, getIDs, getHelp } from './lexicon/lexicon_en.js'
import { createMenuKeyboard } from './keyboards/keyboards.js'
import { setMenu } from './keyboards/set_menu.js'
import { deleteWebHook } from './deleteWebhook.js'
import { openai } from './openai.js'
import { converter } from './converter.js'
import { checkAccess } from './checkAccess.js'

const sessions = {};
const menuKeyboard = createMenuKeyboard();

const bot = new Telegraf(config.get('BOT_TOKEN'));

const allowedUserId = config.get('USERS_ID')
  .split(',')
  .map((id) => parseInt(id));

bot.use(session())

const createInitialSession = () => {
  return {
    messages: []
  }
};

const resetContext = async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] = createInitialSession();
  await ctx.reply(LEXICON_EN['reset'], menuKeyboard);
};

const printIDs = async (ctx) => {
  const userId = ctx.from.id;
  const chatId = ctx.message.chat.id;

  await ctx.reply(getIDs(chatId, userId), {parse_mode: 'HTML'}, menuKeyboard);
}

bot.command('start', async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] = createInitialSession();
  await ctx.reply(LEXICON_EN['start'], menuKeyboard);
});

bot.command('help', async (ctx) => {
  if (await checkAccess(allowedUserId, ctx)) return;
  ctx.reply(getHelp(), menuKeyboard);
});

bot.command('chatid', async (ctx) => {
  printIDs(ctx);
});

bot.command('new', async (ctx) => {
  if (await checkAccess(allowedUserId, ctx)) return;

  resetContext(ctx);
});

bot.hears(LEXICON_EN['reset_btn'], async (ctx) => {
  if (await checkAccess(allowedUserId, ctx)) return;

  resetContext(ctx);
})

bot.hears(LEXICON_EN['getIDs_btn'], async (ctx) => {
  printIDs(ctx);
})

bot.on(message('voice'), async (ctx) => {
  if (await checkAccess(allowedUserId, ctx)) return;

  const sessionId = ctx.message.chat.id;
  sessions[sessionId] ??= createInitialSession();
  try {
    await ctx.reply(code(LEXICON_EN['processing']))
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const oggPath = await converter.create(link.href, userId)
    const mp3Path = await converter.toMp3(oggPath, userId)
    const text = await openai.transcription(mp3Path)
    sessions[sessionId].messages.push({
      role: openai.roles.USER,
      content: text
    })

    const response = await openai.chat(sessions[sessionId].messages)

    setTimeout(async () => {
      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT, 
          content: response.content
        });
        await ctx.reply(response.content);
      } else {
        await ctx.reply(LEXICON_EN['manyRequests']);
      }
    }, 2000)

  } catch (error) {
    console.log("Voice error " + error.message)
  }
});

bot.on(message('text'), async (ctx) => {
  if (await checkAccess(allowedUserId, ctx)) return;

  const sessionId = ctx.message.chat.id;
  sessions[sessionId] ??= createInitialSession();
  try {
    await ctx.reply(code(LEXICON_EN['processing']))
    const text = ctx.message.text
    sessions[sessionId].messages.push({
      role: openai.roles.USER,
      content: text
    })

    await new Promise(resolve => setTimeout(resolve, 5000));
    const response = await openai.chat(sessions[sessionId].messages)

    setTimeout(async () => {
      if (response && response.content) {
        sessions[sessionId].messages.push({
          role: openai.roles.ASSISTANT, 
          content: response.content
        });
        await ctx.reply(response.content);
      } else {
        await ctx.reply(LEXICON_EN['manyRequests']);
      }
    }, 5000)

  } catch(error) {
    console.log("Text error " + error.message)
    await ctx.reply(LEXICON_EN['noResponce'])
  }
});

setMenu(bot);
deleteWebHook(bot);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))