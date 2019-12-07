import { DragListItem } from '../types/drag-list-item.type';
import { WordWidthItem } from '../types/word-width-item.type';

export interface AppWordState {
  currDragItem: DragListItem;
  wordWidthList: WordWidthItem[];
  showVerses: boolean;
  wordsList?: DragListItem[];
  timePersisted: number;
}

export const initAppWordState: AppWordState = {
  currDragItem: null,
  wordWidthList: [{ id: 0, width: 0 }],
  showVerses: true,
  wordsList: [],
  timePersisted: 0
};
