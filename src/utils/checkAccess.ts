import { LEXICON_EN } from "../lexicon/lexicon_en.js";
import { Context } from "telegraf";

export async function getUsersArray(config: Config) {
  let usersArray = config.USERS_ID.split(",").map((id: string) => parseInt(id));

  if (usersArray.includes(NaN)) {
    usersArray = [parseInt(config.SUPER_USER)];
  }

  return usersArray;
}

export async function checkAccess(config: Config, ctx: Context) {
  const allowedUserId = await getUsersArray(config);

  if (!allowedUserId.includes(ctx.from.id)) {
    await ctx.reply(LEXICON_EN["deniedAccess"]);
    return true;
  }
  return false;
}
