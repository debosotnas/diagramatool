import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppWordState } from '../app.state';

export const getWordsStore = createFeatureSelector<AppWordState>('appWordState');

export const getWordWidthList = createSelector(
  getWordsStore,
  (store: AppWordState) => store.wordWidthList
);

export const getCurrDragItem = createSelector(
  getWordsStore,
  (store: AppWordState) => store.currDragItem
);

export const getWordsList = createSelector(
  getWordsStore,
  (store: AppWordState) => store.wordsList
);

export const getShowVerses = createSelector(
  getWordsStore,
  (store: AppWordState) => store.showVerses
);
