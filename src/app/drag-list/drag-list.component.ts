import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DragListItem, Notifier } from '../types/drag-list-item.type';
import { DragWordEvent } from '../types/events.type';
import { WordFacade } from '../state/facades/word.facade';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drag-list',
  templateUrl: './drag-list.component.html',
  styleUrls: ['./drag-list.component.sass']
})
export class DragListComponent implements OnInit, OnDestroy {

  @Input() text: string;

  subscriptions: Subscription[] = [];

  allWords: string[];
  dragListWords: DragListItem[];
  dragPhrase = true;

  constructor(private wordFacade: WordFacade) { }

  ngOnInit() {
    this.allWords = this.text.split(' ');
    let localId = 1;

    const initListWords: DragListItem[] = this.allWords.map(w => {
      return {
        id: localId++,
        word: w,
        parentLine: 1,
        x: 0,
        y: 0,
        dragPosition: { x: 0, y: 0 },
        notify: new Notifier(),
        isLastChild: false
      };
    });

    this.subscriptions.push(
      this.wordFacade.wordsList$.subscribe((data) => {
        this.dragListWords = data;
      })
    );


    this.wordFacade.updateWordList(initListWords);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  startWordDragging(evt: DragWordEvent): void {
    this.wordFacade.createParentLineGroup({
      id: evt.id,
      currParentLine: evt.currParentLine
    });
  }

  endWordDragging(evt: DragWordEvent): void {
    this.wordFacade.setLastChildOfGroup(evt.id);
  }

  updateOnClearGroup(evt: DragWordEvent): void {
    this.updateWordDragging(evt, true);
  }

  getWordsFromGroup(id: number, parentLine: number): DragListItem[] {
    return this.dragListWords.filter( (item) => {
      return item.id > id && item.parentLine === parentLine;
    });
  }

  updateWordDragging(evt: DragWordEvent, isClearGroup: boolean = false): void {
    if (!evt.currX && !evt.currY && !isClearGroup) {
      return;
    }
    const dliFilter: DragListItem[] = this.getWordsFromGroup(evt.id, evt.currParentLine);

    dliFilter.map((item) => {
      item.notify.valueChanged({
        word: evt.word,
        id: evt.id,
        parentLine: evt.currParentLine,
        x: evt.currX,
        y: evt.currY,
        isLastChild: evt.isLastChild
      });
    });
  }

}
