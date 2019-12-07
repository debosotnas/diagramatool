import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragListComponent } from './drag-list/drag-list.component';
import { SimpleWordComponent } from './simple-word/simple-word.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';

import { reducers } from './state/reducers';
import { WordEffects } from './state/effects/word.effects';

import { WordWidthDirective } from './directives/word-width.directive';
import { PortionSelectorComponent } from './portion-selector/portion-selector.component';
import { FormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    DragListComponent,
    SimpleWordComponent,
    WordWidthDirective,
    PortionSelectorComponent
  ],
  imports: [
    HttpClientModule,
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([WordEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
