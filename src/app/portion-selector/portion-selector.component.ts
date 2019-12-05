import { Component, OnInit, Renderer2, Input, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BooksWithChapters, versesByChaptersBook } from './portion-selector-constants';
import { PassageSelection, TextPortionSelected } from '../common/verse';

const DEFAULT_BOOK_TO_LOAD = 470;
const DEFAULT_LABEL_BUTTON = 'Cargar Pasaje';

@Component({
  selector: 'app-portion-selector',
  templateUrl: './portion-selector.component.html',
  styleUrls: ['./portion-selector.component.scss']
})
export class PortionSelectorComponent implements OnInit {
  // renderer: Renderer2;

  @Output() passageSelected = new EventEmitter<TextPortionSelected>();
  @Output() removePassage = new EventEmitter<any>();

  @Input() passageSelection: PassageSelection;
  @Input() txtLabel: string;
  @Input() isMainSelector = false;

  listBooks = BooksWithChapters;
  listVersesByChapter = versesByChaptersBook;

  capselected: string = null;
  verseIniSelected: string = null;
  verseEndSelected: string = null;

  bookselected: number;
  titlePortion: string;
  versionPortion: string;

  currentBookVersesSelection = {};
  currentVerses: any = null;
  // -------- details for portion selection modal
  currentChapterHighlight: number = null;
  currentVerseHighlight: any = null;
  currentMinHighlight: any = null;
  currentMaxHighlight: any = null;
  dragVersesInProgress = false;

  currentPortionToBeLoaded: string = null;
  isEmptyPortion: boolean = null;
  // --------

  objectKeys = Object.keys;

  prevLabelBookVersesButton: string;
  currentLabelBookVersesButton: string;
  showVersesOnLoad = false;

  constructor(private modalService: NgbModal, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderer.listen('document', 'mouseup', (event: MouseEvent) => {
      if (this.dragVersesInProgress) {
        this.dragVersesInProgress = false;
        this.updateCurrentPortionToBeLoaded();
      }
    });

    // has this.passageSelection just if is been loaded from app.component
    if (this.passageSelection) {
      this.bookselected = this.passageSelection.book;
      this.currentChapterHighlight = this.passageSelection.chapter;

      this.setCurrentPortionWithMinMax(this.currentChapterHighlight,
        this.passageSelection.verseIni,
        this.passageSelection.verseEnd);

      this.updateAndLoadPortion(false);
    } else { // just set the by defalut value in button/label
      this.currentLabelBookVersesButton = DEFAULT_LABEL_BUTTON;
      this.resetSelector();
    }
  }

  resetSelector() {
    this.bookselected = DEFAULT_BOOK_TO_LOAD;
    this.onChangeBook();
  }

  updateCurrentPortionToBeLoaded(): void {
    const currentObj =  this.objectKeys(this.currentVerseHighlight);
    if (!currentObj.length) {
      this.currentPortionToBeLoaded = null;
      return;
    }
    const arr = currentObj.map( (key, val) => currentObj[val]);
    const min = Math.min.apply( null, arr );
    const max = Math.max.apply( null, arr );

    this.setCurrentPortionWithMinMax(this.currentChapterHighlight, min, max);
  }

  setCurrentPortionWithMinMax(chap: number, mMin: number, mMax: number): void {
    this.currentPortionToBeLoaded =
        `${chap}:${mMin}` + (mMax != null && mMin !== mMax ? `-${mMax}` : '');
  }

  onChangeBook(): void {
    this.getNumberOfVerses();
  }

  onChangeCap(): void {
    this.showVersesOfChapter(this.currentBookVersesSelection[this.capselected], this.capselected);

    this.verseIniSelected = '1';
    this.verseEndSelected = '1';
    this.setCurrentPortionWithMinMax(+this.capselected, 1, 1);

    // this.dragVersesInProgress = true;
    // this.currentMinHighlight = 1;
    // this.selectEndVerses(1);

    /*
    console.log('1) this.currentPortionToBeLoaded: ', this.currentPortionToBeLoaded);
    this.currentVerseHighlight = {};
    setTimeout( () => {
      this.currentVerseHighlight[1] = true;
      console.log('1) this.currentPortionToBeLoaded: ', this.currentPortionToBeLoaded);
    }, 100);
    */
  }

  onChangeVerseIni(): void {
    const cap = +this.capselected;
    const vIni = +this.verseIniSelected;
    let vEnd = +this.verseEndSelected;
    if (vIni > -1 && vEnd > -1 && vIni > vEnd) {
      vEnd = vIni;
      setTimeout( () => {
        this.verseEndSelected = this.verseIniSelected;
      }, 100);
    }
    this.setCurrentPortionForMobile(cap, vIni, vEnd);
  }

  onChangeVerseEnd(): void {
    const cap = +this.capselected;
    let vIni = +this.verseIniSelected;
    const vEnd = +this.verseEndSelected;
    if (vIni > -1 && vEnd > -1 && vIni > vEnd) {
      vIni = vEnd;
      setTimeout( () => {
        this.verseIniSelected = this.verseEndSelected;
      }, 100);
    }
    this.setCurrentPortionForMobile(cap, vIni, vEnd);
  }

  setCurrentPortionForMobile(cap, vIni, vEnd) {
    if (cap > 0 && vIni > 0 && vEnd > 0) {
      this.setCurrentPortionWithMinMax(cap, vIni, vEnd);
    }
  }

  openSelection(content): void {
    this.prevLabelBookVersesButton = this.currentLabelBookVersesButton;
    this.currentVerses = null;
    this.currentVerseHighlight = {};
    this.currentChapterHighlight = null;
    this.currentPortionToBeLoaded = null;

    this.getNumberOfVerses();
    this.open(content);
  }

  open(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

  getNumberOfVerses(): any {
    this.currentBookVersesSelection = this.listVersesByChapter[this.bookselected];

    this.capselected = '1';
    this.onChangeCap(); // for select controls
  }

  getBookName(): string {
    const currentBook = this.listBooks.filter( b => b.val === +this.bookselected);
    return currentBook[0].name;
  }

  showVersesOfChapter(versesToShow: number, chapterSelected: any): void {
    this.resetVersesOfChapter();
    this.currentChapterHighlight = chapterSelected;
    this.currentVerses = versesToShow;

    this.currentVerseHighlight = {};
    this.currentVerseHighlight[1] = true;
  }

  resetVersesOfChapter(): void {
    this.currentMinHighlight = this.currentMaxHighlight = null;
    this.currentVerseHighlight = {};
  }

  arrayOne(i: number): any[] {
    return Array(i);
  }

  selectIniVerses(verse: number): void {
    this.dragVersesInProgress = true;
    this.currentMinHighlight = verse;
  }

  showDragButtons(verse: number): void {
    if (verse === this.currentMinHighlight || !this.dragVersesInProgress) {
      return;
    }
    let minv: number;
    let maxv: number;
    if (verse < this.currentMinHighlight) {
      minv = verse;
      maxv = this.currentMinHighlight;
    } else {
      maxv = verse;
      minv = this.currentMinHighlight;
    }
    this.currentVerseHighlight = {};
    for (let i: number = minv; i <= maxv; i++) {
      this.currentVerseHighlight[i] = true;
    }
  }

  selectEndVerses(verse: number): void {
    if (this.dragVersesInProgress) {
      this.currentMaxHighlight = verse;
      if (this.currentMaxHighlight === this.currentMinHighlight) {
        this.currentVerseHighlight = {};
        this.currentVerseHighlight[verse] = true;
      }
    }
  }

  updateAndLoadPortion(load: boolean = true): void {
    this.titlePortion = this.currentPortionToBeLoaded;
    if (this.isMainSelector) {
      this.currentLabelBookVersesButton = DEFAULT_LABEL_BUTTON;
    } else {
      this.currentLabelBookVersesButton = `${this.getBookName()} ${this.titlePortion}`;
    }

    // console.log('>>> this.currentLabelBookVersesButton: ', this.currentLabelBookVersesButton);

    if (load) {
      this.loadSimplePortion();
    }
  }

  cancelLoadPortion(): void {
    this.currentLabelBookVersesButton = this.prevLabelBookVersesButton;
  }

  loadSimplePortion(): void {
    this.passageSelected.emit({
      id: +new Date() + Math.round(Math.random() * 500),
      book: this.bookselected,
      textPortion: this.titlePortion,
      showVerses: this.showVersesOnLoad
    });
    if (this.isMainSelector) {
      this.resetSelector();
    }
  }

  onRemovePassage(): void {
    this.removePassage.emit();
  }

  checkUncheckShowVerses(evt: any) {
    this.showVersesOnLoad = evt.srcElement.checked;
  }

}
