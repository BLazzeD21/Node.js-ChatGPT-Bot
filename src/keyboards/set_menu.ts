import { Telegraf } from 'telegraf';
import { commands } from '../lexicon/lexicon_en.js';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';

export const setMenu = async (bot: Telegraf) => {
  if (process.env.NODE_ENV === 'production') {
    bot.telegram
    .setMyCommands(commands)
    .then(() => {
      console.log(LEXICON_EN['commands']);
    })
    .catch((error: Error) => {
      console.log(`${error.name} setmenu: ${error.message}`);
    });
  }
};
