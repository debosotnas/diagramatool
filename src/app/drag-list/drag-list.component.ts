import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DragListItem, Notifier } from '../types/drag-list-item.type';
import { DragWordEvent } from '../types/events.type';
import { WordFacade } from '../state/facades/word.facade';
import { Subscription } from 'rxjs';
import { WordWidthItem } from '../types/word-width-item.type';
import { JUMP_X_DISTANCE, JUMP_Y_DISTANCE, MAX_WIDTH_SUB_WORD_CONTAINER } from '../types/constants';
import { Point } from '@angular/cdk/drag-drop/typings/drag-ref';

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
  wordsWidthList: WordWidthItem[];
  dragPhrase = true;

  layoutId = `parent-${(+new Date())}`;
  layoutIdWords = `${this.layoutId}-words`;
  widthWordsContainer = null;

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
      }),
      this.wordFacade.wordsWidth$.subscribe((data) => {
        this.wordsWidthList = data;
        if (this.wordsWidthList.length === this.allWords.length) {
          const sumWidths = this.wordsWidthList.reduce((prev, next, index) => {
              return prev +
                  ((index === this.wordsWidthList.length - 1) ?
                  ((JUMP_X_DISTANCE + next.width) * 2) : JUMP_X_DISTANCE + next.width);
            }, 0);
          const spp = JUMP_X_DISTANCE * this.allWords.length;
          setTimeout( () => {
            this.widthWordsContainer = { width: `${sumWidths + spp}px` };

            setTimeout( () => {
              const firstWord = this.dragListWords[0];
              this.updateChildsPositionLimit({
                word: firstWord.word,
                id: firstWord.id,
                currParentLine: firstWord.parentLine,
                currX: firstWord.x,
                currY: firstWord.y,
                isLastChild: firstWord.isLastChild
              }, true);
            }, 0);

          }, 0);
        }
      })
    );


    this.wordFacade.updateWordList(initListWords);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  startWordDragging(evt: DragWordEvent): void {
    /*
    this.wordFacade.createParentLineGroup({
      id: evt.id,
      currParentLine: evt.currParentLine
    });
    */
  }

  endWordDragging(evt: DragWordEvent): void {
    this.wordFacade.setLastChildOfGroup(evt.id);
    this.updateChildsPositionLimit(evt);
  }

  updateOnClearGroup(evt: DragWordEvent): void {
    this.updateWordDragging(evt, true);
    this.updateChildsPositionLimit(evt);
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

  // adjust words in every line to avoid leave a word out of parent container
  updateChildsPositionLimit(evt: DragWordEvent, isFirstLoad: boolean = true): void {
    const id = evt.id;
    const parentLine = evt.currParentLine;

    const firstWordBound: any = document.querySelector(`#${this.layoutId}-${id}`).getBoundingClientRect();
    let parentContainerLimitX;
    if (isFirstLoad) {
      const containerBound: any = document.querySelector(`#${this.layoutId}`).getBoundingClientRect();
      parentContainerLimitX = containerBound.x + containerBound.width;
    } else {
      parentContainerLimitX = firstWordBound.x + firstWordBound.width + MAX_WIDTH_SUB_WORD_CONTAINER;
    }
    const childGroup: DragListItem[] = this.getWordsFromGroup(id, parentLine);

    let prevWordPos: any = firstWordBound;
    prevWordPos.localX = evt.currX;
    prevWordPos.localY = evt.currY;

    let currentXLimitPos;
    let nextXLimitPos = 0;

    childGroup.forEach((item: DragListItem, index: number, arr: DragListItem[]) => {
      let setXPosition;
      let setYPosition;

      currentXLimitPos = prevWordPos.x + prevWordPos.width;
      const currWordBound: any = document.querySelector(`#${this.layoutId}-${item.id}`).getBoundingClientRect();
      currWordBound.word = item.word;
      nextXLimitPos = currentXLimitPos + JUMP_X_DISTANCE + currWordBound.width;
      if (nextXLimitPos > parentContainerLimitX) {
        const maxWordLineBound = prevWordPos;

        const subNextXLimitPos = maxWordLineBound.x + maxWordLineBound.width + JUMP_X_DISTANCE + currWordBound.width;

        let xPosition;
        let yPosition;
        if (subNextXLimitPos > parentContainerLimitX) {

          setXPosition = evt.currX - (Math.abs(currWordBound.x - firstWordBound.x));
          setYPosition = prevWordPos.localY + Math.abs(maxWordLineBound.y - prevWordPos.y) + JUMP_Y_DISTANCE;

          xPosition = Math.abs(firstWordBound.x - currWordBound.x);
          yPosition = Math.abs(firstWordBound.y - currWordBound.y);

        }

        currWordBound.localX = setXPosition;
        currWordBound.localY = setYPosition;

        currWordBound.x = currWordBound.x - Math.abs(xPosition);
        currWordBound.y = currWordBound.y + Math.abs(maxWordLineBound.y - prevWordPos.y);

      } else {

        setXPosition = prevWordPos.localX;
        setYPosition = prevWordPos.localY;

        currWordBound.localX = setXPosition;
        currWordBound.localY = setYPosition;

        currWordBound.x = prevWordPos.x + JUMP_X_DISTANCE + prevWordPos.width;
        currWordBound.y = prevWordPos.y + currWordBound.y;
      }

      item.notify.valueChanged({
        word: item.word,
        id: item.id,
        parentLine: item.parentLine,
        x: setXPosition,
        y: setYPosition,
        isLastChild: item.isLastChild
      });

      prevWordPos = currWordBound;
    });
  }

}
