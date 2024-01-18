import { Telegraf } from 'telegraf';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { getUsersArray } from './checkAccess.js';

export const sendMessages = async (bot: Telegraf, config: Config) => {
  if(process.env.NODE_ENV === 'production') {
    const allowedUserId = await getUsersArray(config);

    for (const recipient of allowedUserId) {
      try {
        await bot.telegram.sendMessage(recipient, LEXICON_EN['botStarted']);
        console.log(`Message sent to user: ${recipient}`)
      } catch (error) {
        console.error(LEXICON_EN['errorSending'], recipient.toString());
      }
    }
  }
};
