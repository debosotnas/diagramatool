import { Action } from '@ngrx/store';
import { DragListItem } from 'src/app/types/drag-list-item.type';
import { WordWidthItem, WordParentGroup } from 'src/app/types/word-width-item.type';

export const UPDATE_WORD_LIST = '[Word] Update list';
export const SAVE_WORD_WIDTH = '[Word] Save width';
export const CREATE_PARENT_GROUP = '[Word] Create parent group';
export const SET_LAST_CHILD_GROUP = '[Word] Set last child in group';
export const CLEAR_LAST_CHILD_GROUP = '[Word] Clear last child in group';
export const SET_SHOW_VERSES = '[Word] Set Show verses';

export class UpdateWordList implements Action {
  readonly type = UPDATE_WORD_LIST;

  constructor(public payload: DragListItem[]) {}
}

export class SaveWordWidth implements Action {
  readonly type = SAVE_WORD_WIDTH;

  constructor(public payload: WordWidthItem) {}
}

export class CreateParentGroup implements Action {
  readonly type = CREATE_PARENT_GROUP;

  constructor(public payload: WordParentGroup) {}
}

export class SetLastChildGroup implements Action {
  readonly type = SET_LAST_CHILD_GROUP;

  constructor(public payload: number) {}
}

export class ClearLastChildGroup implements Action {
  readonly type = CLEAR_LAST_CHILD_GROUP;

  constructor(public payload: number) {}
}

export class SetShowVerses implements Action {
  readonly type = SET_SHOW_VERSES;

  constructor(public payload: boolean) {}
}

export type All =
UpdateWordList
| SaveWordWidth
| CreateParentGroup
| SetLastChildGroup
| ClearLastChildGroup
| SetShowVerses;
