import * as WordActions from '../actions/word.action';
import { AppWordState, initAppWordState } from '../app.state';
import { DragListItem } from 'src/app/types/drag-list-item.type';

export type Action = WordActions.All;

export function wordsReducer(state: AppWordState = initAppWordState, action: Action) {
  console.log (action.type, state);

  switch (action.type) {
    case WordActions.UPDATE_WORD_LIST:
      return {
        ...state,
        wordsList: action.payload
      };
    case WordActions.SAVE_WORD_WIDTH:
      return {
          ...state,
          wordWidthList: [
            {
              ...action.payload
            },
            ...state.wordWidthList.filter(w => w.id > 0)
          ]
        };
    case WordActions.CREATE_PARENT_GROUP:
      const timestampId = +new Date();
      return {
        ...state,
        wordsList: [
          ...state.wordsList.map((w: DragListItem ) => {
            if (w.id >= action.payload.id
              && w.parentLine === action.payload.currParentLine) {
              w.parentLine = timestampId;
            }
            return w;
          })
        ]
      };
    case WordActions.SET_LAST_CHILD_GROUP:
      const prevId: number = action.payload - 1;
      if (prevId > 0) {
        return {
          ...state,
          wordsList: [
            ...state.wordsList.map((w: DragListItem ) => {
              if (w.id === prevId) {
                w.isLastChild = true;
              }
              return w;
            })
          ]
        };
      }
      return state;
    case WordActions.CLEAR_LAST_CHILD_GROUP:
      const currId: number = action.payload;
      const currWord: DragListItem = state.wordsList.find(w => w.id === currId);
      const nextId: number = action.payload + 1;
      let lastWordInGroup: DragListItem;
      let nextWord: DragListItem;
      if (nextId <= state.wordsList.length) {
        nextWord = state.wordsList.find(w => w.id === nextId);
        const group: DragListItem[] = state.wordsList.filter(w => w.parentLine === nextWord.parentLine);
        lastWordInGroup = group.reduce((prev, current) => (prev.id > current.id) ? prev : current);
        return {
          ...state,
          wordsList: [
            ...state.wordsList.map((w: DragListItem) => {
              if (w.id >= nextId && w.id <= lastWordInGroup.id) {
                w.parentLine = currWord.parentLine;
              }
              if (w.id === lastWordInGroup.id && w.id !== state.wordsList.length) {
                w.isLastChild = true;
              } else if (w.id === currId) {
                w.isLastChild = false;
              }
              return w;
            })
          ]
        };
      }
      return state;
    default:
      return state;
  }
}
