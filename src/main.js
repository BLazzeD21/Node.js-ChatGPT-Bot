import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'

import { converter } from './converter.js'
import config from 'config'
import { openai } from './openai.js'

const sessions = {};

const bot = new Telegraf(config.get('BOT_TOKEN'))

bot.use(session())

const createInitialSession = () => {
  return {
    messages: []
  }
};

bot.command('start', async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] = createInitialSession();
  await ctx.reply("Hello, welcome to an artificial intelligence chatbot that will help you with everything! 🤖\n\nYou can find the source code of the bot here:\nhttps://github.com/BLazzeD21/Node.js-ChatGPT-Bot");
});

bot.command('chatid', async (ctx) => {
  const chatId = ctx.message.chat.id;
  await ctx.reply(`This chat ID: ${chatId}`);
});

bot.command('new', async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] = createInitialSession();
  await ctx.reply('The context has been reset.');
});

bot.on(message('voice'), async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] ??= createInitialSession();
  try {
    await ctx.reply(code("Text accepted for processing"))
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
        await ctx.reply('⚠️ You are sending too many requests, the server is not able to process your messages in time');
      }
    }, 5000)

  } catch (error) {
    console.log("Voice error " + error.message)
  }
});

bot.on(message('text'), async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] ??= createInitialSession();
  try {
    await ctx.reply(code("Text accepted for processing"))
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
        await ctx.reply('⚠️ You are sending too many requests, the server is not able to process your messages in time');
      }
    }, 5000)

  } catch(error) {
    console.log("Text error " + error.message)
    await ctx.reply("⛔️ Sorry, no response received from the server")
  }
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))