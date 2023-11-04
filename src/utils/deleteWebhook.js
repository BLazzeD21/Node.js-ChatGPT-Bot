import { LEXICON_EN } from '../lexicon/lexicon_en.js';

export const deleteWebHook = async (bot) => {
  bot.telegram
      .deleteWebhook()
      .then(() => {
        console.log(LEXICON_EN['webhook']);
      })
      .catch((error) => {
        console.log(`${error.name} webhook: ${error.message}`);
      });
};
