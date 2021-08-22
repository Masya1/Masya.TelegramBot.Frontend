import { Epic } from 'redux-observable';
import { actions, RootAction } from '..';
import { catchError, map, of } from 'rxjs';
import { switchMap, filter, mapTo } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { RootState } from '../reducers';
import { isActionOf } from 'typesafe-actions';
import { apiEndpoints } from '../../routing/endpoints';
import { Command } from '../../models/Command';

export const removeCommandEpic: Epic<RootAction, RootAction, RootState> = (action$, state) =>
  action$.pipe(
    filter(isActionOf(actions.removeCommand)),
    switchMap((action) => 
      ajax({
        url: apiEndpoints.removeCommand + action.payload,
        method: 'delete',
        crossDomain: true,
        headers: {
          Authorization: `Bearer ${state.value.account.tokens?.accessToken}`,
        },
      })
      .pipe(
        mapTo(actions.loadCommands()),
        catchError(ctx => of(ctx.xhr.response))
      )
    )
  );

export const loadCommandsEpic: Epic<RootAction, RootAction, RootState> = (
  action$,
  state,
) =>
  action$.pipe(
    filter(isActionOf(actions.loadCommands)),
    switchMap(() =>
      ajax<Command[]>({
        url: apiEndpoints.loadCommands,
        method: 'get',
        headers: {
          Authorization: `Bearer ${state.value.account.tokens?.accessToken}`,
        },
        crossDomain: true,
      }).pipe(
        map((ctx) => actions.setCommands(ctx.response)),
        catchError((err) => of(actions.errorCommands(err.xhr.response))),
      ),
    ),
  );

export const saveCommandsEpic: Epic<RootAction, RootAction, RootState> = (
  action$,
  state,
) =>
  action$.pipe(
    filter(isActionOf(actions.saveCommands)),
    switchMap(() =>
      ajax({
        url: apiEndpoints.saveCommands,
        method: 'put',
        headers: {
          Authorization: `Bearer ${state.value.account.tokens?.accessToken}`,
        },
        crossDomain: true,
        body: state.value.commands.commands,
      }).pipe(
        mapTo(actions.saveSuccess()),
        catchError((err) => of(actions.errorCommands(err.xhr.response))),
      ),
    ),
  );
