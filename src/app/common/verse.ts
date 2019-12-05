export const DEFAULT_HIGHLIGHT_TYPE = -1;
export const MAX_KEY_CODE_USED = 72;
export const SHIFT_KEY = 16;
// -------------------

export interface Portion {
  passage: string;
  passageSelection: PassageSelection;
  verses: Verse[];
}

export interface Verse {
  verse: string;
  full: string;
}

export interface PassageSelection {
  book: number;
  chapter: number;
  verseIni: number;
  verseEnd: number;
}

export interface TextPortionSelected {
  id: number;
  book: number;
  textPortion: string;
  showVerses?: boolean;
}

export interface WordWrapper {
  id: number;
  verse: number;
  word: string;
  noteDescription: string;
}
export interface WordTreeWrapper {
  id: number;
  globalId: string;
  verse: number;
  word: string;
  noteDescription: string;
  type: number | string;
  childs: WordTreeWrapper[];
}

export interface RawWord {
  id: string;
  verse: number;
  word: string;
  highlightType: number | string;
  highlightGroup: number;
  noteDescription: string;
}

// actions - ngrx ----------------------------------

export interface PortionRaw {
  id: number;
  rawListWords: RawWord[];
  textPortion: string;
  passage: string;
  passageSelection: string;
}

export interface HighlightPortionGroup {
  portionRawId: number;
  type: number | string;
  words: number[];
}

export interface WordNoteDescription {
  portionId: number;
  wordId: number;
  description: string;
}
// ------------------------------------------------
