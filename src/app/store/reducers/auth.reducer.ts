import { createReducer, on } from '@ngrx/store';
import { AccountOwner } from 'src/app/core/models';
import * as authActions from '../actions/auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: AccountOwner | undefined;
}

export const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
};

export const reducer = createReducer(
  initialState,

  on(authActions.loadUserInfoSuccess, (state, { user }) => {
    return {
      ...state,
      user,
    };
  }),
  on(authActions.setAuthentication, state => ({
    ...state,
    isAuthenticated: true,
  })),
  on(authActions.resetAuthentication, state => ({
    // Logout
    ...state,
    isAuthenticated: false,
    user: undefined,
  }))
);
