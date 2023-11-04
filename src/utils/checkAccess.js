import { LEXICON_EN } from '../lexicon/lexicon_en.js';

export async function getUsersArray(config) {
  return config
      .USERS_ID
      .split(',')
      .map((id) => parseInt(id));
}

export async function checkAccess(config, ctx) {
  const allowedUserId = await getUsersArray(config);

  if (!allowedUserId.includes(ctx.from.id)) {
    await ctx.reply(LEXICON_EN['deniedAccess']);
    return true;
  }
  return false;
}
