import fs from 'fs';
import { LEXICON_EN } from "../lexicon/lexicon_en.js";

export const addHandler = (config, callback) => {
  return async (ctx) => {
    if (ctx.from.id == config.SUPER_USER) {
      try {
        const requestText = ctx.message.text
          .replace("/add", "")
          .trim();
        
        if (!requestText){
          await ctx.reply(LEXICON_EN['emptyAdd'], { parse_mode: "HTML" });
          return;
        }

        config.USERS_ID += `,${requestText}`;
        if (process.env.NODE_ENV === "production") {
          fs.writeFileSync('config/production.json', JSON.stringify(config), 'utf8');
        } else {
          fs.writeFileSync('config/default.json', JSON.stringify(config), 'utf8');
        }
        
        callback(config);

        ctx.reply(LEXICON_EN['add']);
        ctx.telegram.sendMessage(requestText, LEXICON_EN['added']);
      } catch(e) {
        console.log(LEXICON_EN['errorSending'], requestText);
      }
    } else {
        ctx.reply(LEXICON_EN['super']);
    }
  }
};

export const showHandler = (config) => {
  return async (ctx) => {
    if (ctx.from.id == config.SUPER_USER) {
      await ctx.reply(config.USERS_ID);
    } else {
      ctx.reply(LEXICON_EN['super']);
    }
  }
}