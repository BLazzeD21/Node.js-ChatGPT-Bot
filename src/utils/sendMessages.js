import { LEXICON_EN, messageSent } from "../lexicon/lexicon_en.js";

export const sendMessages = async (bot, allowedUserId) => {
  for (const recipient of allowedUserId) {
    try {
      await bot.telegram.sendMessage(recipient, LEXICON_EN["botStarted"]);
      console.log(await messageSent(recipient));
    } catch (error) {
      console.error(LEXICON_EN['errorSending'], recipient.toString());
    }
  }
};
