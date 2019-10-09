import { DragListItem } from '../types/drag-list-item.type';
import { WordWidthItem } from '../types/word-width-item.type';

export interface AppWordState {
  currDragItem: DragListItem;
  wordWidthList: WordWidthItem[];
  wordsList?: DragListItem[];
}

export const initAppWordState: AppWordState = {
  currDragItem: null,
  wordWidthList: [{ id: 0, width: 0 }],
  wordsList: []
};
