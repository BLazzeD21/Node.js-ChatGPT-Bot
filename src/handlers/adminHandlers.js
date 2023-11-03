import fs from 'fs';
import { LEXICON_EN } from "../lexicon/lexicon_en.js";
import { getUsersArray } from '../utils/checkAccess.js';
import { existUser, getExistsUsers } from '../utils/usersCheck.js';

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

        const userExistence = await existUser(requestText, ctx);

        if (!userExistence){
          await ctx.reply(LEXICON_EN['noUser'], { parse_mode: "HTML" });
          return;
        }

        config.USERS_ID += `,${requestText}`;

        if (process.env.NODE_ENV === "production") {
          fs.writeFileSync('config/production.json', JSON.stringify(config, null, 2), 'utf8');
        } else {
          fs.writeFileSync('config/default.json', JSON.stringify(config, null, 2), 'utf8');
        }

        await callback(config);

        await ctx.reply(LEXICON_EN['add']);
        await ctx.telegram.sendMessage(requestText, LEXICON_EN['added']);

      } catch(e) {
        console.log(LEXICON_EN['errorSending'], requestText);
      }
    } else {
        await ctx.reply(LEXICON_EN['super']);
    }
  }
};

export const showHandler = (config) => {
  return async (ctx) => {
    if (ctx.from.id == config.SUPER_USER) {
      const users = await getUsersArray(config);
      let usersExists = await getExistsUsers(users, ctx);
      usersExists = usersExists.slice(0, -1);

      config.USERS_ID = usersExists;
      console.log(config);
    } else {
      await ctx.reply(LEXICON_EN['super']);
    }
  }
}