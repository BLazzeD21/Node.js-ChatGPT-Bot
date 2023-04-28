import { Telegraf, session } from 'telegraf'
import { code } from 'telegraf/format'

import config from 'config'
import { openai } from './openai.js'

const sessions = {};

const bot = new Telegraf(config.get('BOT_TOKEN'))

bot.use(session())

const createInitialSession = () => {
  return {
    messages: []
  }
}

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

bot.on('message', async (ctx) => {
  const sessionId = ctx.message.chat.id;
  sessions[sessionId] ??= createInitialSession();
  try {
    await ctx.reply(code("Text accepted for processing"))
    const text = ctx.message.text
    sessions[sessionId].messages.push({
      role: openai.roles.USER,
      content: text
    })

    const response = await openai.chat(sessions[sessionId].messages)

    // Добавить задержку перед отправкой ответа
    setTimeout(async () => {
      sessions[sessionId].messages.push({
        role: openai.roles.ASSISTANT, 
        content: response.content
      })
      await ctx.reply(response.content)
    }, 5000)

  } catch(error) {
    await ctx.reply("Sorry, no response received from the server")


  }
});

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))