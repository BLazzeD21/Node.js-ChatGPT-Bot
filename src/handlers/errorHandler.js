import { LEXICON_EN } from '../lexicon/lexicon_en.js';

class ErrorHandler {
  responseError(ctx, handler) {
    return (error) => {
      console.log(`${error.name} ${handler}: ${error.message}`);
      ctx.reply(
          `${LEXICON_EN['noResponce']}\n\n${error.name}: ${error.message}`,
      );
    };
  }
}

export default new ErrorHandler();
