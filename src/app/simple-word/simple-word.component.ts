import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Point, DragRef } from '@angular/cdk/drag-drop/typings/drag-ref';
import { CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';

import { DragListItem, Notifier } from '../types/drag-list-item.type';
import { DragWordEvent } from '../types/events.type';
import { JUMP_X_DISTANCE, JUMP_Y_DISTANCE } from '../types/constants';
import { WordFacade } from '../state/facades/word.facade';
import { Subscription } from 'rxjs';
import { WordWidthItem } from '../types/word-width-item.type';

const mainThisComponent: any = {};

@Component({
  selector: 'app-simple-word',
  templateUrl: './simple-word.component.html',
  styleUrls: ['./simple-word.component.sass']
})
export class SimpleWordComponent implements OnInit, OnDestroy  {

  @Input() notify = new Notifier();

  @Input() parentLayoutId: string;

  @Input() id: number;
  @Input() word: string;
  @Input() parentLine: number;
  @Input() xPos: number;
  @Input() yPos: number;
  @Input() isLastChild: boolean;

  @Output() startWordDrag: EventEmitter<DragWordEvent> = new EventEmitter<DragWordEvent>();
  @Output() endWordDrag: EventEmitter<DragWordEvent> = new EventEmitter<DragWordEvent>();
  @Output() updateWordDrag: EventEmitter<DragWordEvent> = new EventEmitter<DragWordEvent>();
  @Output() updateAfterClearGroup = new EventEmitter<DragWordEvent>();

  @Input() dragPosition: Point = {x: 0, y: 0};

  subscriptions: Subscription[] = [];
  wordWidthItems: WordWidthItem[];

  rootOffsetPosition: Point = { x: 0, y: 0 };

  showVerses$ = this.wordFacade.showVerses$;

  constructor(private wordFacade: WordFacade) { }

  ngOnInit() {
    // *************** PENDING UPDATE
    // code to show/hide verses: <span *ngIf="showVerses$ | async">VV </span>

    // fix for loosing bind on 'constrainPosition' and other cdkDrag methods
    mainThisComponent[this.id] = this;

    // sets x and y from parent component
    this.notify.valueChanged = (wordDrag: DragListItem) => {
      this.dragPosition = {x: wordDrag.x + this.rootOffsetPosition.x, y: wordDrag.y + this.rootOffsetPosition.y };
      this.xPos = this.dragPosition.x;
      this.yPos = this.dragPosition.y;
    };

    this.subscriptions.push(
      this.wordFacade.wordsWidth$.subscribe((data) => {
        this.wordWidthItems = data;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  // Weird behavior / Bug: DragMoved needed to call 'valueChanged' and update
  fnDragMoved(evt: CdkDragEnd) { }

  checkUpdateCurrPos(updateXPos, updateYPos) {

    if (this.xPos !== updateXPos || this.yPos !== updateYPos) {
      console.log('>>>> !!!! checkUpdateCurrPos!');
      this.xPos = updateXPos;
      this.yPos = updateYPos;

      this.updateWordDrag.emit({
        word: this.word,
        id: this.id,
        currParentLine: this.parentLine,
        currX: this.xPos,
        currY: this.yPos,
        isLastChild: this.isLastChild
      });

    }
  }

  fnDragEnded(evt: CdkDragEnd): void {

    this.endWordDrag.emit({
      word: this.word,
      id: this.id,
      currParentLine: this.parentLine,
      currX: this.xPos,
      currY: this.yPos,
      isLastChild: this.isLastChild
    });

  }


  fnOnMouseDown(evt: any): void {
    /*
    this.startWordDrag.emit({
      word: this.word,
      id: this.id,
      currParentLine: this.parentLine,
      currX: this.xPos,
      currY: this.yPos,
      isLastChild: this.isLastChild
    });
    */
    console.log('mouse down!!!');
    this.wordFacade.createParentLineGroup({
      id: this.id,
      currParentLine: this.parentLine
    });
  }

  fnDragStarted(evt: CdkDragStart): void {
/*
    this.startWordDrag.emit({
      word: this.word,
      id: this.id,
      currParentLine: this.parentLine,
      currX: this.xPos,
      currY: this.yPos,
      isLastChild: this.isLastChild
    });
*/
  }

  constrainPosition(point: Point, dragRef: DragRef): Point {
    const thisAsAny = (this as any);
    const dragRefAsAny = (dragRef as any);

    const boundaryRect = thisAsAny._boundaryRect;

    const offsetXmouse = thisAsAny._pickupPositionOnPage.x - thisAsAny._previewRect.x;
    const offsetYmouse = thisAsAny._pickupPositionOnPage.y - thisAsAny._previewRect.y;

    const preDistX = Math.round((point.x - offsetXmouse) / JUMP_X_DISTANCE) * JUMP_X_DISTANCE;
    const preDistY = Math.round((point.y - offsetYmouse) / JUMP_Y_DISTANCE) * JUMP_Y_DISTANCE;

    const updateXPos = Math.round(preDistX + offsetXmouse);
    const updateYPos = Math.round(preDistY + offsetYmouse);

    mainThisComponent[dragRef.data.data]
      .checkUpdateCurrPos(dragRefAsAny._activeTransform.x, dragRefAsAny._activeTransform.y);

    return {
      x: updateXPos,
      y: updateYPos
    };
  }

  removeNextGroup(): void {
    this.wordFacade.clearLastChildOfGroup(this.id);

    setTimeout(() => {
      this.updateAfterClearGroup.emit({
        word: this.word,
        id: this.id,
        currParentLine: this.parentLine,
        currX: this.dragPosition.x || this.xPos,
        currY: this.dragPosition.y || this.yPos,
        isLastChild: this.isLastChild
      });
    }, 10);

  }

}
