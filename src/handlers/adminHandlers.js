import fs from 'fs';
import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { getUsersArray } from '../utils/checkAccess.js';

class AdminHandlers {
  addHandler = (config, callback) => {
    return async (ctx) => {
      if (ctx.from.id == config.SUPER_USER) {
        try {
          const requestText = parseInt(ctx.message.text
              .replace('/add', '')
              .trim());

          if (!requestText) {
            await ctx.reply(LEXICON_EN['emptyAdd'], { parse_mode: 'HTML' });
            return;
          }

          config.USERS_ID += `,${requestText}`;

          if (process.env.NODE_ENV === 'production') {
            fs.writeFileSync('config/production.json',
                JSON.stringify(config, null, 2), 'utf8');
          } else {
            fs.writeFileSync('config/default.json',
                JSON.stringify(config, null, 2), 'utf8');
          }

          await callback(config);

          const output =`<b>Added ID: </b><code>${requestText}</code>\n\n` +
          `${LEXICON_EN['add']}`;

          await ctx.reply(output, { parse_mode: 'HTML' });
        } catch (e) {
          console.log(LEXICON_EN['errorSending'], requestText);
        }
      } else {
        await ctx.reply(LEXICON_EN['super']);
      }
    };
  };

  removeHandler = (config, callback) => {
    return async (ctx) => {
      if (ctx.from.id == config.SUPER_USER) {
        try {
          const requestText = parseInt(ctx.message.text
              .replace('/remove', '')
              .trim());

          if (!requestText) {
            await ctx.reply(LEXICON_EN['removeAdd'], { parse_mode: 'HTML' });
            return;
          }
          const usersID = config.USERS_ID.split(',');

          if (!usersID.includes(requestText.toString())) {
            await ctx.reply(LEXICON_EN['UserNotExists']);
            return;
          }
          const filteredUsers = usersID
              .filter((id) => id !== requestText.toString())
              .join(',');

          config.USERS_ID = filteredUsers;

          if (process.env.NODE_ENV === 'production') {
            fs.writeFileSync('config/production.json',
                JSON.stringify(config, null, 2), 'utf8');
          } else {
            fs.writeFileSync('config/default.json',
                JSON.stringify(config, null, 2), 'utf8');
          }

          await callback(config);

          const output =`<b>Removed ID: </b><code>${requestText}</code>\n\n` +
          `${LEXICON_EN['remove']}`;

          await ctx.reply(output, { parse_mode: 'HTML' });
        } catch (e) {
          console.log(LEXICON_EN['errorSending'], requestText);
        }
      } else {
        await ctx.reply(LEXICON_EN['super']);
      }
    };
  };

  showHandler = (config) => {
    return async (ctx) => {
      if (ctx.from.id == config.SUPER_USER) {
        const users = await getUsersArray(config);

        const uniqueIDs = [...new Set(users)];

        config.USERS_ID = uniqueIDs.join(',');

        if (process.env.NODE_ENV === 'production') {
          fs.writeFileSync('config/production.json',
              JSON.stringify(config, null, 2), 'utf8');
        } else {
          fs.writeFileSync('config/default.json',
              JSON.stringify(config, null, 2), 'utf8');
        }

        let output = '🗃 <b>Bot users:</b>\n\n';

        uniqueIDs.forEach(
            (id) => {
              output += `👤 <code>${id}</code>\n`;
            });

        await ctx.reply(output, { parse_mode: 'HTML' });

        await callback(config);
      } else {
        await ctx.reply(LEXICON_EN['super']);
      }
    };
  };
}

export default new AdminHandlers();
