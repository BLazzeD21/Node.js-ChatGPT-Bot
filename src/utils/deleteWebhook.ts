import { Telegraf } from 'telegraf';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';

export const deleteWebHook = async (bot: Telegraf) => {
  if(process.env.NODE_ENV === 'production') {
    bot.telegram
    .deleteWebhook()
    .then(() => {
      console.log(LEXICON_EN['webhook']);
    })
    .catch((error: Error) => {
      console.log(`${error.name} webhook: ${error.message}`);
    });
  }
};
