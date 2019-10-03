import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-drag-list',
  templateUrl: './drag-list.component.html',
  styleUrls: ['./drag-list.component.sass']
})
export class DragListComponent implements OnInit {

  @Input() text: string;
  allWords: string[];
  dragPhrase = true;

  constructor() { }

  ngOnInit() {
    this.allWords = this.text.split(' ');
  }

}
