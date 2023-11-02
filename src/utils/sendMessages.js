import { LEXICON_EN, messageSent } from "../lexicon/lexicon_en.js";

export const sendMessages = async (bot, allowedUserId) => {
  try {
    for (const recipient of allowedUserId) {
      await bot.telegram.sendMessage(recipient, LEXICON_EN['botStarted']);
      console.log(messageSent(recipient));
    }
    } catch (error) {
    console.error('Error sending message:', error);
  }
};