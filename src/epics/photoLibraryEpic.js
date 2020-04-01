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
import * as photoLibraryActions from 'actions/photoLibraryActions';
import ApiUtil from 'utils/apiUtil';

export const getImageCategoriesEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_IMAGE_CATEGORIES),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `library/categories`, {
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
                return photoLibraryActions.getImageCategoriesSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_IMAGE_CATEGORIES EPIC:", ActionEvent.GET_IMAGE_CATEGORIES, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getImagesEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_IMAGES),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `library/images`, {
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
                return photoLibraryActions.getImagesSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_IMAGES EPIC:", ActionEvent.GET_IMAGES, error);
                    return handleConnectErrors(error)
                })
        )
    );