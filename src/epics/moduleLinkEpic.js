import { ActionEvent } from 'actions/actionEvent'
import { Observable } from 'rxjs';
import {
    map,
    filter,
    catchError,
    mergeMap
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { delay, mapTo, switchMap } from 'rxjs/operators';
import { dispatch } from 'rxjs/internal/observable/range';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import { ServerPath } from 'config/Server';
import * as moduleLink from 'actions/moduleLinkActions';
import ApiUtil from 'utils/apiUtil';

export const getModuleLinkEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MODULE_LINK),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `module/link`, {
                method: 'GET',
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return moduleLink.getModuleLinkSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_MODULE_LINK EPIC:", ActionEvent.GET_MODULE_LINK, error)
                    return handleConnectErrors(error)
                })
        )
    );