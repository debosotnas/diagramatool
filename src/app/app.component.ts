import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  public text: string;

  ngOnInit(): void {
    this.text =  'this is the first word of a common declaration. Here you can put some content to show in main screen.';
    this.text += ' this is the first word of a common declaration. Here you can put some content to show in main screen';
  }

}
