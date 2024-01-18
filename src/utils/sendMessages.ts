import { Telegraf } from "telegraf";
import { LEXICON_EN } from "../lexicon/lexicon_en.js";

export const sendMessages = async (bot: Telegraf, allowedUserId: number[]) => {
  for (const recipient of allowedUserId) {
    try {
      await bot.telegram.sendMessage(recipient, LEXICON_EN["botStarted"]);
    } catch (error) {
      console.error(LEXICON_EN["errorSending"], recipient.toString());
    }
  }
};
