import { Component, OnInit, Input } from '@angular/core';
import { Point, DragRef } from '@angular/cdk/drag-drop/typings/drag-ref';
import { CdkDragStart, CdkDragEnd, CdkDragRelease } from '@angular/cdk/drag-drop';

const JUMP_DISTANCE = 30;

@Component({
  selector: 'app-simple-word',
  templateUrl: './simple-word.component.html',
  styleUrls: ['./simple-word.component.sass']
})
export class SimpleWordComponent implements OnInit {

  @Input() word: string;

  constructor() { }

  ngOnInit() {
  }

  fnReleased(evt: CdkDragRelease): void {
    // evt.source._dragRef.setFreeDragPosition({ x: 100, y: 100});
  }

  fnDragEnded(evt: CdkDragEnd): void {
    // evt.source._dragRef.setFreeDragPosition(tmpPlusPoint);
  }

  fnDragStarted(evt: CdkDragStart): void {
    // evt.source._dragRef.setFreeDragPosition({ x: 100, y: 100});
  }

  constrainPosition(point: Point, dragRef: DragRef): Point {
    const thisAsAny = (this as any);

    const offsetXmouse = thisAsAny._pickupPositionOnPage.x - thisAsAny._previewRect.x;
    const offsetYmouse = thisAsAny._pickupPositionOnPage.y - thisAsAny._previewRect.y;

    // console.log(`offsetX: ${offsetXmouse} - offsetY: ${offsetYmouse}`);

    const baseCalcX = point.x - offsetXmouse;
    const baseCalcY = point.y - offsetYmouse;

    const preDistX = Math.round(baseCalcX / JUMP_DISTANCE) * JUMP_DISTANCE;
    const preDistY = Math.round(baseCalcY / JUMP_DISTANCE) * JUMP_DISTANCE;

    const distX = preDistX + offsetXmouse;
    const distY = preDistY + offsetYmouse;

    return {
      x: distX,
      y: distY
    };
  }

}
