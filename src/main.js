import { Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import { code } from 'telegraf/format'

import config from 'config'
import { openai } from './openai.js'

const INITIAL_SESSION = {
    messages: [],
}
const bot = new Telegraf(config.get('BOT_TOKEN'))

bot.use(session())

bot.command('start', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply("Hello, welcome to an artificial intelligence chatbot that will help you with everything! 🤖\n\nYou can find the source code of the bot here:\nhttps://github.com/BLazzeD21/Node.js-ChatGPT-Bot");
})

bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('You have started a new dialogue with the bot. 🤖\nGood luck with your use!')
})
bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code("Text accepted for processing"))
        //const userId = String(ctx.message.from.id)
        const text = ctx.message.text

        ctx.session.messages.push({
            role: openai.roles.USER,
            content: text
        })
        const response = await openai.chat(ctx.session.messages)

        ctx.session.messages.push({
            role: openai.roles.ASSISTANT, 
            content: response.content
        })
        await ctx.reply(response.content)

        bot.telegram.deleteMessage(ctx.update.message.chat.id, ctx.update.message.message_id + 1)
        

    } catch(error) {
        await ctx.reply("Sorry, no response received from the server")
        bot.telegram.deleteMessage(ctx.update.message.chat.id, ctx.update.message.message_id + 1)
    }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))