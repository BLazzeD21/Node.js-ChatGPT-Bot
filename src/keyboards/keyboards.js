import { LEXICON_EN } from '../lexicon/lexicon_en.js';
import { Markup } from 'telegraf';

export function createMenuKeyboard() {
  return Markup.keyboard([
    [LEXICON_EN['reset_btn'], LEXICON_EN['getIDs_btn']],
  ]).resize();
}