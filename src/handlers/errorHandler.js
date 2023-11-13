import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { menuKeyboard } from '../keyboards/keyboards.js';

class ErrorHandler {
  responseError(ctx, handler) {
    return (error) => {
      console.log(`${error.name} ${handler}: ${error.message}`,
          menuKeyboard);
      ctx.reply(
          `${LEXICON_EN['noResponce']}\n\n${error.name}: ${error.message}`,
      );
    };
  }
}

export default new ErrorHandler();
