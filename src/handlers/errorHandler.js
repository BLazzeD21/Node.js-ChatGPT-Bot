import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { menuKeyboard } from '../keyboards/keyboards.js';

class ErrorHandler {
  responseError(ctx, handler) {
    return async (error) => {
      console.log(
          `${ctx.from.id} - ${error.name} ${handler}: ${error.message}`,
      );
      await ctx.reply(
          `${LEXICON_EN['noResponce']}\n\n${error.name}: ${error.message}`,
          { disable_web_page_preview: true, ...menuKeyboard },
      );
    };
  }
}

export default new ErrorHandler();
