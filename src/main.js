import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'

import config from 'config'
import { openai } from './openai.js'

const INITIAL_SESSION = {
    messages: [],
}

const sessions = {};

const bot = new Telegraf(config.get('BOT_TOKEN'))

bot.use(session())

bot.command('start', async (ctx) => {
    const sessionId = ctx.message.chat.id;
    sessions[sessionId] = INITIAL_SESSION;
    await ctx.reply("Hello, welcome to an artificial intelligence chatbot that will help you with everything! 🤖\n\nYou can find the source code of the bot here:\nhttps://github.com/BLazzeD21/Node.js-ChatGPT-Bot");
});

bot.command('chatid', async (ctx) => {
    const chatId = ctx.message.chat.id;
    await ctx.reply(`This chat ID: ${chatId}`);
});

bot.command('new', async (ctx) => {
    const sessionId = ctx.message.chat.id;
    sessions[sessionId] = INITIAL_SESSION;
    await ctx.reply('The context has been reset.');
});

bot.on('message', async (ctx) => {
    const sessionId = ctx.message.chat.id;
    sessions[sessionId] ??= INITIAL_SESSION;

    try {
        await ctx.reply(code("Text accepted for processing"))
        const text = ctx.message.text
        sessions[sessionId].messages.push({
            role: openai.roles.USER,
            content: text
        })

        const response = await openai.chat(sessions[sessionId].messages)

        sessions[sessionId].messages.push({
            role: openai.roles.ASSISTANT, 
            content: response.content
        })
        await ctx.reply(response.content)

    } catch(error) {
        sessions[sessionId].lastMessageId = ctx.message.message_id;
        await ctx.reply("Sorry, no response received from the server")
    }
});

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))