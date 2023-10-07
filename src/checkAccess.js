import { LEXICON_EN } from './lexicon/lexicon_en.js'

export async function checkAccess(allowedUserId, ctx) {
  if (!allowedUserId.includes(ctx.from.id)) {
    await ctx.reply(LEXICON_EN['deniedAccess']);
    return true;
  }
  return false;
}