import { commands } from '../lexicon/lexicon_en.js';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';

export const setMenu = async (bot) => {
  bot.telegram
      .setMyCommands(commands)
      .then(() => {
        console.log(LEXICON_EN['commands']);
      })
      .catch((error) => {
        console.log(`${error.name} setmenu: ${error.message}`);
      });
};
