import { Epic } from 'redux-observable';
import { isActionOf } from 'typesafe-actions';
import { RootAction } from '..';
import { RootState } from '../reducers';
import * as actions from '../actions';
import { filter, switchMap, catchError, map, mapTo } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';
import { Agency } from '../../models/Agency';
import { apiEndpoints } from '../../routing/endpoints';
import { Log } from '../../models/Log';

export const loadImportsLogsEpic: Epic<RootAction, RootAction, RootState> = (
  action$,
  state,
) =>
  action$.pipe(
    filter(isActionOf(actions.loadImportsLogs)),
    switchMap(() =>
      ajax<Log[]>({
        url:
          apiEndpoints.loadAgencyImportsLogs +
          '?agencyId=' +
          state.value.agency.agency?.id,
        crossDomain: true,
        method: 'get',
        headers: {
          Authorization: `Bearer ${state.value.account.tokens?.accessToken}`,
        },
      }).pipe(
        map((ctx) => actions.loadImportsLogsSuccess(ctx.response)),
        catchError((ctx) => of(actions.loadImportsLogsError(ctx.xhr.response))),
      ),
    ),
  );

export const loadAgencyEpic: Epic<RootAction, RootAction, RootState> = (
  action$,
  state,
) =>
  action$.pipe(
    filter(isActionOf(actions.loadAgency)),
    switchMap(() =>
      ajax<Agency>({
        url: apiEndpoints.loadAgency,
        crossDomain: true,
        method: 'get',
        headers: {
          Authorization: `Bearer ${state.value.account.tokens?.accessToken}`,
        },
      }).pipe(
        map((ctx) => actions.setAgency(ctx.response)),
        catchError((ctx) => of(actions.loadAgencyError(ctx.xhr.response))),
      ),
    ),
  );

export const saveAgencyEpic: Epic<RootAction, RootAction, RootState> = (
  action$,
  state,
) =>
  action$.pipe(
    filter(isActionOf(actions.saveAgency)),
    switchMap(() =>
      ajax({
        url: apiEndpoints.saveAgency,
        crossDomain: true,
        method: 'post',
        body: {
          ...state.value.agency.agencyToUpdate,
          agents: state?.value?.agency?.agencyToUpdate?.agents?.filter(
            (a) => !a?.willBeDeleted,
          ),
        },
        headers: {
          Authorization: `Bearer ${state.value.account.tokens?.accessToken}`,
        },
      }).pipe(
        mapTo(actions.saveAgencySuccess()),
        catchError((ctx) => of(actions.saveAgencyError(ctx.xhr.response))),
      ),
    ),
  );
