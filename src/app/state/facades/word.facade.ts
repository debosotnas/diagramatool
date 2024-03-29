import { Injectable } from '@angular/core';
import { AppWordState } from '../app.state';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as WordActions from '../actions/word.action';
import { DragListItem } from 'src/app/types/drag-list-item.type';
import { WordWidthItem, WordParentGroup } from 'src/app/types/word-width-item.type';

import { getWordWidthList, getWordsList, getShowVerses, getUpdateToPersist } from '../selectors/words-selector';

@Injectable({
  providedIn: 'root'
})
export class WordFacade {

  public currData$: Observable<DragListItem> = this.store.select('currDragItem');
  public wordsWidth$: Observable<WordWidthItem[]> = this.store.select(getWordWidthList);
  public wordsList$: Observable<DragListItem[]> = this.store.select(getWordsList);
  public timePersisted$: Observable<number> = this.store.select(getUpdateToPersist);
  public showVerses$: Observable<boolean> = this.store.select(getShowVerses);

  constructor(private store: Store<AppWordState>) { }

  saveWordWidthById(id: number, width: number): void {
    this.store.dispatch(new WordActions.SaveWordWidth({ id, width }));
  }

  createParentLineGroup(currParentLineGroup: WordParentGroup): void {
    this.store.dispatch(new WordActions.CreateParentGroup(currParentLineGroup));
  }

  updateWordList(dragListItem: DragListItem[]): void {
    this.store.dispatch(new WordActions.UpdateWordList(dragListItem));
  }

  setLastChildOfGroup(id: number): void {
    this.store.dispatch(new WordActions.SetLastChildGroup(id));
  }

  // passing ID of span with 'clear' icon.
  // reducer should change next closest group to the same parentLine
  clearLastChildOfGroup(id: number): void {
    this.store.dispatch(new WordActions.ClearLastChildGroup(id));
  }

  setShowVerses(checked: boolean) {
    this.store.dispatch(new WordActions.SetShowVerses(checked));
  }

}
