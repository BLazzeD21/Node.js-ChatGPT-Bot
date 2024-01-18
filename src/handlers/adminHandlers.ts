import fs from "fs";
import { LEXICON_EN } from "../lexicon/lexicon_en.js";
import { getUsersArray } from "../utils/checkAccess.js";
import { menuKeyboard } from "../keyboards/keyboards.js";
import { Context } from "telegraf";

class AdminHandlers {
  addHandler = (config: Config, callback: UpdateConfigValue) => {
    return async (ctx: Context) => {
      const chat_id: string = ctx.from.id.toString();
      if (chat_id != config.SUPER_USER) {
        await ctx.reply(LEXICON_EN["super"]);
        return;
      }

      if (!(ctx.message && "text" in ctx.message)) return;
      const requestText: string = ctx.message.text.replace("/add", "").trim();

      try {
        if (!requestText) {
          await ctx.reply(LEXICON_EN["emptyAdd"], {
            parse_mode: "HTML",
            ...menuKeyboard,
          });
          return;
        }

        config.USERS_ID += `,${requestText}`;

        if (process.env.NODE_ENV === "production") {
          fs.writeFileSync(
            "config/production.json",
            JSON.stringify(config, null, 2),
            "utf8"
          );
        } else {
          fs.writeFileSync(
            "config/default.json",
            JSON.stringify(config, null, 2),
            "utf8"
          );
        }

        await callback(config);

        const output: string =
          `<b>Added ID: </b><code>${requestText}</code>\n\n` +
          `${LEXICON_EN["add"]}`;

        await ctx.reply(output, { parse_mode: "HTML", ...menuKeyboard });
      } catch (error) {
        console.log(LEXICON_EN["errorSending"], error);
      }
    };
  };

  removeHandler = (config: Config, callback: UpdateConfigValue) => {
    return async (ctx: Context) => {
      const chat_id = ctx.from.id.toString();
      if (chat_id != config.SUPER_USER) {
        await ctx.reply(LEXICON_EN["super"]);
        return;
      }

      if (!(ctx.message && "text" in ctx.message)) return;
      const requestText: string = ctx.message.text
        .replace("/remove", "")
        .trim();

      try {
        if (!requestText) {
          await ctx.reply(LEXICON_EN["removeAdd"], {
            parse_mode: "HTML",
            ...menuKeyboard,
          });
          return;
        }
        const usersID: string[] = config.USERS_ID.split(",");

        if (!usersID.includes(requestText.toString())) {
          await ctx.reply(LEXICON_EN["UserNotExists"]);
          return;
        }
        const filteredUsers = usersID
          .filter((id: string) => id !== requestText.toString())
          .join(",");

        config.USERS_ID = filteredUsers;

        if (process.env.NODE_ENV === "production") {
          fs.writeFileSync(
            "config/production.json",
            JSON.stringify(config, null, 2),
            "utf8"
          );
        } else {
          fs.writeFileSync(
            "config/default.json",
            JSON.stringify(config, null, 2),
            "utf8"
          );
        }

        await callback(config);

        const output: string =
          `<b>Removed ID: </b><code>${requestText}</code>\n\n` +
          `${LEXICON_EN["remove"]}`;

        await ctx.reply(output, { parse_mode: "HTML", ...menuKeyboard });
      } catch (error) {
        console.log(LEXICON_EN["errorSending"], error);
      }
    };
  };

  showHandler = (config: Config, callback: UpdateConfigValue) => {
    return async (ctx: Context) => {
      const chat_id = ctx.from.id.toString();
      if (chat_id != config.SUPER_USER) {
        await ctx.reply(LEXICON_EN["super"]);
        return;
      }

      const users: number[] = await getUsersArray(config);

      const uniqueIDs: number[] = [...new Set(users)];

      config.USERS_ID = uniqueIDs.join(",");

      if (process.env.NODE_ENV === "production") {
        fs.writeFileSync(
          "config/production.json",
          JSON.stringify(config, null, 2),
          "utf8"
        );
      } else {
        fs.writeFileSync(
          "config/default.json",
          JSON.stringify(config, null, 2),
          "utf8"
        );
      }

      let output: string = "🗃 <b>Bot users:</b>\n\n";

      uniqueIDs.forEach((id) => {
        output += `👤 <code>${id}</code>\n`;
      });

      await ctx.reply(output, { parse_mode: "HTML", ...menuKeyboard });

      await callback(config);
    };
  };
}

export default new AdminHandlers();
