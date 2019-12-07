import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextPortionSelected, Portion, Verse } from './common/verse';
import { ConfigService } from './services/config.service';
import { DragListComponent } from './drag-list/drag-list.component';
import { SimpleWordComponent } from './simple-word/simple-word.component';
import { WordFacade } from './state/facades/word.facade';
import { DragListItem } from './types/drag-list-item.type';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  isVerseTextLoaded = false;
  isLoadingView = false;
  currPassage: string;

  dragListWords: DragListItem[];

  @ViewChildren(DragListComponent)
  portionList: QueryList<DragListComponent>;
  currBook: number;
  currTextPortion: string;

  currPortionId: number;
  currShowVerses: boolean;

  constructor(private modalService: NgbModal,
              private configService: ConfigService,
              private wordFacade: WordFacade) { }

  ngOnInit(): void {
    this.wordFacade.wordsList$.subscribe((data) => {
      this.dragListWords = data;
    });

    this.wordFacade.timePersisted$.subscribe((data) => {
      this.persistCurrentWordList();
    });

    // this.verifyAndLoadFromStorage(); // not implementing load portion on start since it present position issues
  }

  onSelectedPassage(evt: TextPortionSelected): void {
    this.loadPortion(evt);
  }

  loadPortion(textPortion: TextPortionSelected, fromSelector: boolean = false) {
    this.isLoadingView = true;

    this.isVerseTextLoaded = true;

    this.configService.getVerses(textPortion)
      .subscribe((data: Portion) => {
        this.currPassage = data.passage;
        this.currBook = data.passageSelection.book;
        this.currTextPortion = textPortion.textPortion;
        this.currPortionId = textPortion.id;
        this.currShowVerses = textPortion.showVerses;

        const tmpFullText = this.configService.processVerses(data.verses, textPortion.showVerses);
        this.portionList.forEach(portion => portion.processNewText(tmpFullText));

        this.isLoadingView = false;
      });
  }

  loadPortionFromDisk(textPortion: TextPortionSelected, positionData: any) {
    this.isLoadingView = true;

    this.isVerseTextLoaded = true;

    this.configService.getVerses(textPortion)
      .subscribe((data: Portion) => {
        this.currPassage = data.passage;
        this.currBook = data.passageSelection.book;
        this.currTextPortion = textPortion.textPortion;
        this.currPortionId = textPortion.id;

        const tmpFullText = this.configService.processVerses(data.verses, textPortion.showVerses);
        this.portionList.forEach(portion => portion.processNewText(tmpFullText));

        setTimeout(() => {
          this.loadFileWordList(positionData);
        }, 1000);

        this.isLoadingView = false;
      });
  }

  persistCurrentWordList() {
    if (!this.portionList || this.dragListWords.length === 0) {
      return;
    }
    const wordsPosXY = [];

    this.portionList.forEach(portion => {
      portion.getAllWordsDragComponent().forEach(word => {
        wordsPosXY.push({ xPos: word.xPos, yPos: word.yPos});
      });
    });

    const allSpans = document.querySelectorAll('span.drag-word');
    const allpositions = [];
    allSpans.forEach((itemSpan: HTMLElement ) => {
      allpositions.push(itemSpan.style.transform);
    });

    let iPos = 0;

    const saveObj = {
      portionId: this.currPortionId,
      textPortion: this.currTextPortion,
      book: this.currBook,
      showVerses: this.currShowVerses,
      cssPositions: allpositions,
      dragListItem: [...this.dragListWords.map(item => {
        const ret = {
          ...item,
          dragPosition: {
            x: wordsPosXY[iPos].xPos,
            y: wordsPosXY[iPos].yPos
          }
        };
        iPos++;
        return ret;
      })]
    };

    localStorage.setItem('portionDiagram', JSON.stringify(saveObj));
    // console.log('>>persisted!');
  }

  loadFileWordList(savedPosWords) {
    // const fromFile = JSON.parse(savedPosWords);

    const cssPos: string[] = savedPosWords.cssPositions;
    const dragListItem: DragListItem[] = savedPosWords.dragListItem;
    let iPos = 0;

    const allSpans = document.querySelectorAll('span.drag-word');
    allSpans.forEach((itemSpan: HTMLElement ) => {
      itemSpan.style.transform = cssPos[iPos];
      iPos++;
    });

    this.wordFacade.updateWordList(dragListItem);

    // console.log('configured!! >>', fromFile);
  }

  downloadPortion(): void {
    const blob = new Blob([localStorage.getItem('portionDiagram')], { type: 'text/plain' });
    saveAs(blob, 'Diagram-' + Math.ceil(Math.random() * 500) + '.txt');
  }

  openIOTFile($event): void {
    const input: any = $event.target;
    const reader = new FileReader();
    reader.onload = () => {
        this.isLoadingView = true;
        this.loadPortionsFromSource(reader.result as string);
        this.modalService.dismissAll();
    };
    reader.readAsText(input.files[0]);
  }

  loadPortionsFromSource(loadDiagramData: any, isParsed: boolean = false) {
    try {
      if (!isParsed) {
        loadDiagramData = JSON.parse(loadDiagramData);
      }
      const txtPortion: TextPortionSelected = {
        id: loadDiagramData.portionId,
        book: loadDiagramData.book,
        textPortion: loadDiagramData.textPortion,
        showVerses: loadDiagramData.showVerses
      };
      this.loadPortionFromDisk(txtPortion, loadDiagramData);
    } catch (e) {
      console.log('Error: ', e);
      alert('Oups! algo ha salido mal al intentar cargar la sesión');
    }
  }

  verifyAndLoadFromStorage() {
    if (localStorage.getItem('portionDiagram')) {
      const sessionParsed = JSON.parse(localStorage.getItem('portionDiagram'));
      if (sessionParsed.portionId &&
        sessionParsed.book &&
        sessionParsed.textPortion &&
        sessionParsed.cssPositions &&
        sessionParsed.dragListItem) {
          this.loadPortionsFromSource(sessionParsed, true);
        }
    }
  }

  open(content): void {
    this.modalService.open(content, { size: 'lg' });
  }

}
