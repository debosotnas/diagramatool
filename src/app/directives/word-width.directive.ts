import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { WordFacade } from '../state/facades/word.facade';

@Directive({
  selector: '[appWordWidth]'
})
export class WordWidthDirective implements AfterViewInit  {

  @Input() wordWidthId: number;

  constructor(private el: ElementRef, private wordFacade: WordFacade) { }

  storeWordWidth() {
    // console.log(this.wordWidthId + ' - ' + this.el.nativeElement.offsetWidth);
    this.wordFacade.saveWordWidthById(this.wordWidthId, this.el.nativeElement.offsetWidth);
  }

  ngAfterViewInit() {
    this.storeWordWidth();
  }

}
