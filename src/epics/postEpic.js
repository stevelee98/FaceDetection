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
import * as postActions from 'actions/postActions';
import ApiUtil from 'utils/apiUtil';

export const getPostsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_POSTS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `post/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return postActions.getPostsSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_POSTS EPIC:", ActionEvent.GET_POSTS, error);
                    return handleConnectErrors(error)
                })
        )
    );