import { commands } from '../lexicon/lexicon_en.js';

export const setMenu = async (bot) => {
  bot.telegram
    .setMyCommands(commands)
    .then(() => {
      console.log('Custom commands set successfully');
    })
    .catch((error) => {
      console.error('Error setting custom commands:', error);
    });
};
