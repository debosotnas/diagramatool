import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragListComponent } from './drag-list/drag-list.component';
import { SimpleWordComponent } from './simple-word/simple-word.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { reducers } from './state/reducers';
import { WordWidthDirective } from './directives/word-width.directive';

@NgModule({
  declarations: [
    AppComponent,
    DragListComponent,
    SimpleWordComponent,
    WordWidthDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
