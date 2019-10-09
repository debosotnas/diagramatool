export interface DragWordEvent {
  word: string;
  id: number;
  currParentLine: number;
  currX: number;
  currY: number;
  isLastChild: boolean;
}
