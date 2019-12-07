import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { tap, withLatestFrom, switchMap } from 'rxjs/operators';

import * as WordActions from '../actions/word.action';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable()
export class WordEffects {

  @Effect({ dispatch: true})
  updateWordPortions$ = this.actions$.pipe(
    ofType(WordActions.SET_LAST_CHILD_GROUP, WordActions.CLEAR_LAST_CHILD_GROUP),
    withLatestFrom(this.store$),
    switchMap(_ =>
      of(new WordActions.UpdateTimestampPersist(+new Date()))
    )
  );

/*
  @Effect({ dispatch: false})
  updateWordPortions$ = this.actions$.pipe(
    ofType(WordActions.SET_LAST_CHILD_GROUP, WordActions.CLEAR_LAST_CHILD_GROUP),
    tap( res => 
      this.store$
      )
  );

  /*
  @Effect({ dispatch: false})
  updateWordPortions$ = this.actions$.pipe(
    ofType(WordActions.SET_LAST_CHILD_GROUP, WordActions.CLEAR_LAST_CHILD_GROUP),
    withLatestFrom(this.store$),
    tap(([action, state]) => {
      // localStorage.setItem('portions', JSON.stringify(state.portionRaw.portions));
      // this.store$.dispatch(new WordActions.CreateParentGroup(currParentLineGroup));
      // state.dispatch(new WordActions.UpdateTimestampPersist(+new Date()));
      // of(new WordActions.UpdateTimestampPersist(+new Date()));
    })
  );
  */
  constructor(private actions$: Actions, private store$: Store<any>) {}
}

