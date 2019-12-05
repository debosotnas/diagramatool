import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Portion, TextPortionSelected, Verse } from '../common/verse';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // versesURL = 'assets/verse-demo.json';
  versesURL = 'svc/getverses.php';

  constructor(private http: HttpClient) { }

  getVerses(textPortion: TextPortionSelected) {
    // return this.http.get<Portion>(this.versesURL);
    return this.http.get<Portion>(`${this.versesURL}?look=${textPortion.book}&portion=${textPortion.textPortion}`);
  }



  // *************************************************************************
  // utilities to parse text and verses in app.component

  processVerses(verses: Verse[], showVerses: boolean = true): string {
    let text = '';
    verses.forEach(item => {
      const fulltext = this.parseFullVerse(item.full).join(' ');
      if (showVerses) {
        text += `${item.verse} ${fulltext} `;
      } else {
        text += `${fulltext} `;
      }
    });
    return text.trim();
  }

  parseFullVerse(text: string): string[] {
    const withoutTags = this.removeForeignTags(text);
    const words = withoutTags.split(' ').filter(val => val.trim() !== '');
    // Example: abc def , adee sdf ojojoe sdsdf . Sdfsf sdfs sdsdsasdfa ssdfsdf .
    const newWords: string[] = [];
    words.forEach( (val, index, arr) => {
        if (index < arr.length - 1) {
          if (arr[index + 1] === '.' ||
              arr[index + 1] === '."' ||
              arr[index + 1] === ':' ||
              arr[index + 1] === '...' ||
              arr[index + 1] === ',' ||
              arr[index + 1] === ';') {
            val = val + arr[index + 1];
            newWords.push(val);
          } else if (val !== '.' && val !== '."' && val !== ':' && val !== '...' && val !== ',' && val !== ';') {
            newWords.push(val);
          }
        } else {
          if (val !== '.' && val !== '."' && val !== ':' && val !== '...' && val !== ',' && val !== ';') {
            newWords.push(val);
          }
        }
      });
    return newWords;
  }

  removeForeignTags(text: string): string {

    // to do: fix: remove space before , or .
    const virtualItem = document.createElement('div');
    virtualItem.innerHTML = text;
    const allItems = virtualItem.querySelectorAll('f');

    allItems.forEach( vItem => {
      vItem.parentNode.removeChild(vItem);
    });

    return virtualItem.innerText.trim();
  }

}
