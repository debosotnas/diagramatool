import { Point } from '@angular/cdk/drag-drop/typings/drag-ref';

export interface DragListItem {
  id: number;
  parentLine: number;
  word: string;
  x: number;
  y: number;
  isLastChild: boolean;
  dragPosition?: Point;
  notify?: Notifier;
}

export class Notifier {
  valueChanged: (data: DragListItem) => void = (d: DragListItem) => { };
}
