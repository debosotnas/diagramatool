import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextPortionSelected, Portion, Verse } from './common/verse';
import { ConfigService } from './services/config.service';
import { DragListComponent } from './drag-list/drag-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  isVerseTextLoaded = false;
  isLoadingView = false;
  currPassage: string;

  @ViewChildren(DragListComponent)
  portionList: QueryList<DragListComponent>;

  constructor(private modalService: NgbModal, private configService: ConfigService) { }

  ngOnInit(): void {
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

        const tmpFullText = this.configService.processVerses(data.verses, textPortion.showVerses);
        this.portionList.forEach(portion => portion.processNewText(tmpFullText));

        this.isLoadingView = false;
      });
  }


}
