import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DragListItem, Notifier } from '../types/drag-list-item.type';
import { DragWordEvent } from '../types/events.type';
import { WordFacade } from '../state/facades/word.facade';
import { Subscription } from 'rxjs';
import { WordWidthItem } from '../types/word-width-item.type';
import { JUMP_X_DISTANCE, JUMP_Y_DISTANCE } from '../types/constants';
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
    this.updateChildsPositionLimit(evt);
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

    // this.updateChildsPositionLimit(evt);
  }

  localToOtherWordPos(pFrom: Point, pTo: Point): Point {
    return {
      x: pFrom.x - pTo.x,
      y: pFrom.y - pTo.y
    };
  }

  /*
  globalToLocalWordPos(pFrom: Point, pTo: Point): Point {
    return {
      x: pFrom.x - pTo.x,
      y: pFrom.y - pTo.y
    };
  }
  */
  updateChildsPositionLimit(evt: DragWordEvent): void {
    const id = evt.id;
    const parentLine = evt.currParentLine;

    const firstWordBound: any = document.querySelector(`#${this.layoutId}-${id}`).getBoundingClientRect();
    const containerBound: any = document.querySelector(`#${this.layoutId}`).getBoundingClientRect();
    const parentContainerLimitX = containerBound.x + containerBound.width;
    const childGroup: DragListItem[] = this.getWordsFromGroup(id, parentLine);

    let prevWordPos: any = firstWordBound;
    // prevWordPos.localX = 0; // evt.currX;
    // prevWordPos.localY = 0; // evt.currY;
    prevWordPos.localX = evt.currX;
    prevWordPos.localY = evt.currY;

    let currentXLimitPos; // = prevWordPos.x + prevWordPos.width;
    // let currentYLimitPos = prevWordPos.y; // firstWordBound.y;
    let nextXLimitPos = 0;

    childGroup.forEach((item: DragListItem, index: number, arr: DragListItem[]) => {
      let setXPosition;
      let setYPosition;

      currentXLimitPos = prevWordPos.x + prevWordPos.width;
      const currWordBound: any = document.querySelector(`#${this.layoutId}-${item.id}`).getBoundingClientRect();
      currWordBound.word = item.word;
      nextXLimitPos = currentXLimitPos + JUMP_X_DISTANCE + currWordBound.width;
      if (nextXLimitPos > parentContainerLimitX) {

        /*
        const arrFiltered = arr.filter( (subItem: DragListItem) => {

        });*/

        const parentDragItem = this.dragListWords.find(itt => itt.id === evt.id);
/*
        const itemReduced = arr.reduce((prev, curr): DragListItem => {
          const subBoundPrev: any = document.querySelector(`#${this.layoutId}-${prev.id}`).getBoundingClientRect();
          const subBoundCurr: any = document.querySelector(`#${this.layoutId}-${curr.id}`).getBoundingClientRect();
          if (subBoundCurr.y > subBoundPrev.y) {
            return curr;
          } else {
            return prev;
          }
        }, parentDragItem);

        const maxWordBound: any = document.querySelector(`#${this.layoutId}-${itemReduced.id}`).getBoundingClientRect();

        const maxIdInLineGroup = arr.filter((itt) => {
          const subBound: any = document.querySelector(`#${this.layoutId}-${itt.id}`).getBoundingClientRect();
          return subBound.y === maxWordBound.y;
        });

        / *
        const lastIdInLine = maxIdInLineGroup
          .reduce((prev: DragListItem, curr: DragListItem) =>
          (prev.id > curr.id && prev.id < item.id && curr.id < item.id) ? prev : curr, parentDragItem);
          * /

        const lastIdInLine = maxIdInLineGroup
          .filter( itt => itt.id < item.id)
          .reduce((prev: DragListItem, curr: DragListItem) =>
          (prev.id > curr.id) ? prev : curr, parentDragItem);

        const maxWordLineBound: any = document.querySelector(`#${this.layoutId}-${lastIdInLine.id}`).getBoundingClientRect();
*/
        const maxWordLineBound = prevWordPos;

        const subNextXLimitPos = maxWordLineBound.x + maxWordLineBound.width + JUMP_X_DISTANCE + currWordBound.width;

        let xPosition;
        let yPosition;
        if (subNextXLimitPos > parentContainerLimitX) {

          setXPosition = evt.currX - (Math.abs(currWordBound.x - firstWordBound.x));
          // setYPosition = evt.currY + Math.abs(maxWordLineBound.y - firstWordBound.y) + JUMP_Y_DISTANCE;
          // setXPosition = prevWordPos.localX - Math.abs(currWordBound.x - prevWordPos.x);
          setYPosition = prevWordPos.localY + Math.abs(maxWordLineBound.y - prevWordPos.y) + JUMP_Y_DISTANCE;

          xPosition = Math.abs(firstWordBound.x - currWordBound.x);
          yPosition = Math.abs(firstWordBound.y - currWordBound.y);

        } else {
          /*
          setXPosition = prevWordPos.localX + prevWordPos.width + JUMP_X_DISTANCE; // (Math.abs(currWordBound.x - firstWordBound.x);
          setYPosition = prevWordPos.localY;

          xPosition = setXPosition;
          yPosition = setYPosition;
          */
        }

        currWordBound.localX = setXPosition;
        currWordBound.localY = setYPosition;

        currWordBound.x = currWordBound.x - Math.abs(xPosition); // setXPosition
        currWordBound.y = currWordBound.y + Math.abs(maxWordLineBound.y - prevWordPos.y); // setYPosition

        // setXPosition = prevWordPos.x;
        // setXPosition = prevWordPos.localX; // + JUMP_X_DISTANCE;
//        setXPosition = evt.currX - (Math.abs(currWordBound.x - firstWordBound.x)); // + JUMP_X_DISTANCE;
//        setYPosition = evt.currY + JUMP_Y_DISTANCE;

        /*
        const tmpVerify = prevWordPos.x + prevWordPos.width + JUMP_X_DISTANCE;
        if (tmpVerify > parentContainerLimitX) {
          setYPosition = prevWordPos.currY + JUMP_Y_DISTANCE;
        } else {
          setYPosition = prevWordPos.currY;
        }
        */

        // nextXLimitPos = 0;
        // currentYLimitPos = 0;
        console.log('IF - entering!! - ID: ', item.id);

      } else {

        // setXPosition = evt.currX;
        // setYPosition = evt.currY;

        setXPosition = prevWordPos.localX;
        setYPosition = prevWordPos.localY;

        currWordBound.localX = setXPosition;
        currWordBound.localY = setYPosition;

        // currWordBound.x = prevWordPos.x + currWordBound.x;
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

      // currWordBound.localX += currWordBound.width + JUMP_X_DISTANCE;

      prevWordPos = currWordBound;
    });
  }

  updateChildsPositionLimit2(evt: DragWordEvent): void {
    const id = evt.id;
    const parentLine = evt.currParentLine;

    const firstWordBound: any = document.querySelector(`#${this.layoutId}-${id}`).getBoundingClientRect();
    const containerBound: any = document.querySelector(`#${this.layoutId}`).getBoundingClientRect();
    const parentContainerLimitX = containerBound.x + containerBound.width;
    const childGroup: DragListItem[] = this.getWordsFromGroup(id, parentLine);
    let prevWordPos = firstWordBound;
    let currentXLimitPos; // = prevWordPos.x + prevWordPos.width;
    let currentYLimitPos = prevWordPos.y; // firstWordBound.y;
    let nextXLimitPos = 0;

    childGroup.forEach((item: DragListItem) => {
      currentXLimitPos = prevWordPos.x + prevWordPos.width;
      const currWordBound: any = document.querySelector(`#${this.layoutId}-${item.id}`).getBoundingClientRect();
      nextXLimitPos = currentXLimitPos + JUMP_X_DISTANCE + currWordBound.width;
      if (nextXLimitPos > parentContainerLimitX) {
        // currentXLimitPos = firstWordBound.x;
        currentXLimitPos = prevWordPos.x;
        currentYLimitPos = evt.currY + JUMP_Y_DISTANCE;
        // currentYLimitPos += JUMP_Y_DISTANCE;

        // const newRootPos: Point = this.localToOtherWordPos({ x: currWordBound.x, y: currWordBound.y },
        //                                                 { x: firstWordBound.x , y: firstWordBound.y });
        // const localCeroPointY = newRootPos.y + JUMP_Y_DISTANCE; // + currentYLimitPos;
        // currentYLimitPos + newRootPos.y + JUMP_Y_DISTANCE; // + currentYLimitPos;
      } else {
        // currentXLimitPos = currentXLimitPos - JUMP_X_DISTANCE;
        // currentXLimitPos = currentXLimitPos + JUMP_X_DISTANCE; // <----- last
        currentYLimitPos = evt.currY;
      }
      prevWordPos = currWordBound;

      /*
      const newRootPos: Point = this.localToOtherWordPos({ x: currWordBound.x, y: currWordBound.y },
        { x: currentXLimitPos , y: currentYLimitPos });
      */

      // currWordBound.x --> local 0
      // currentXLimitPos = firstWordBound.x + firstWordBound.width + JUMP_X_DISTANCE --> local 0

      // currWordBound.y --> local 0 // 200
      // currentYLimitPos --> // 200

      // currentYLimitPos = firstWordBound.y + JUMP_Y_DISTANCE --> local 0
      // currentYLimitPos = currentYLimitPos

      // y: 37

      const newRootPos = {
        x: currWordBound.x - (currentXLimitPos + JUMP_X_DISTANCE),
//        y: currentYLimitPos - currWordBound.y
        y: currentYLimitPos
      };

      const localCeroPointX = newRootPos.x;
      const localCeroPointY = newRootPos.y;

      item.notify.valueChanged({
        word: item.word,
        id: item.id,
        parentLine: item.parentLine,
        x: localCeroPointX,
        y: localCeroPointY,
        isLastChild: item.isLastChild
      });

    });

    // JUMP_X_DISTANCE;

  }

}
