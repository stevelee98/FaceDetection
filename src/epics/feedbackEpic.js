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
import * as feedback from 'actions/feedbackAction';
import ApiUtil from 'utils/apiUtil';

export const sendFeedback = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEND_FEEDBACK),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/feedback`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            })
                .then((responseJson) => {
                    console.log(responseJson)
                    return feedback.sendFeedbackSuccess(responseJson)
                }).catch((error) => {
                    consoleLogEpic("SEND_FEEDBACK SEND_FEEDBACK_EPIC:", ActionEvent.SEND_FEEDBACK, error);
                    return handleConnectErrors(error)
                })
        )
    );