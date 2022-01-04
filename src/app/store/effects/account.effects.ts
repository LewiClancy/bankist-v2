import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, of, switchMap } from 'rxjs';
import { AccountService } from 'src/app/core/services/account.service';
import { AppState } from '..';

import * as accountActions from '../actions/account.actions';
import { startLoading, stopLoading } from '../actions/loading.actions';

@Injectable()
export class AccountEffects {
  constructor(
    private accountService: AccountService,
    private actions$: Actions,
    private store: Store<AppState>
  ) {}

  loadAccountInfo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(accountActions.loadAccountInfo),
      switchMap(({ accountId }) => {
        return this.accountService.loadAccountInfo(accountId).pipe(
          switchMap(accountInfo => {
            this.store.dispatch(startLoading());
            return of(
              accountActions.loadAccountInfoSuccess({ accountInfo }),
              accountActions.loadRecentTransactions({ accountId })
            );
          }),
          catchError(error => {
            return of(
              accountActions.loadAccountInfoFailed({ errorCode: error.code })
            );
          })
        );
      })
    );
  });

  loadRecentTransactions$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(accountActions.loadAccountInfo),
      switchMap(({ accountId }) => {
        return this.accountService.loadRecentTransactions(accountId).pipe(
          switchMap(recentTransactions => {
            this.store.dispatch(stopLoading());
            return of(
              accountActions.loadRecentTransactionsSuccess({
                recentTransactions,
              })
            );
          })
        );
      })
    );
  });
}
