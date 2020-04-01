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
import * as vehicle from 'actions/vehicleAction';
import ApiUtil from 'utils/apiUtil';


export const getNewsSellingVehicleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NEWS_SELLING_VEHICLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/news`, {
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
                return vehicle.getNewsSellingVehicleSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_NEWS_SELLING_VEHICLE_EPIC:", ActionEvent.GET_NEWS_SELLING_VEHICLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const postNewsSellingVehicleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.POST_NEWS_SELLING_VEHICLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/news/post`, {
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
                return vehicle.postNewsSellingVehicleSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("POST_NEWS_SELLING_VEHICLE_EPIC:", ActionEvent.POST_NEWS_SELLING_VEHICLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getNewsSellingVehicleInterestEpic = (action$) =>
    action$.pipe(
        ofType(ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/news`, {
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
                return vehicle.getNewsSellingVehicleInterestSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_NEWS_SELLING_VEHICLE_INTEREST_EPIC", ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getMyPostSellingVehicleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_MY_POST_SELLING_VEHICLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/news`, {
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
                return vehicle.getMyPostSellingVehicleSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_MY_POST_SELLING_VEHICLE_EPIC:", ActionEvent.GET_MY_POST_SELLING_VEHICLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getNewsSellingVehicleInterestDisplayEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_DISPLAY),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/news/interest`, {
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
                return vehicle.getNewsSellingVehicleInterestDisplaySuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_NEWS_SELLING_VEHICLE_INTEREST_DISPLAY_EPIC", ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_DISPLAY, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getNewsSellingVehicleInterestHomeEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_HOME),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/news/interest`, {
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
                return vehicle.getNewsSellingVehicleInterestHomeSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_NEWS_SELLING_VEHICLE_INTEREST_HOME_EPIC", ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_HOME, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateStatusSoldSellingPostEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_STATUS_SOLD_SELLING_POST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/${action.payload.sellingPostId}/status/update`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
                // body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return vehicle.updateStatusSoldSellingPostSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_NEWS_SELLING_VEHICLE_INTEREST_EPIC:", ActionEvent.UPDATE_STATUS_SOLD_SELLING_POST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const searchCarByVehicleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SEARCH_CAR_VEHICLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/search`, {
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
                return vehicle.searchCarByVehicleSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("SEARCH_CAR_VEHICLE:", ActionEvent.SEARCH_CAR_VEHICLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getCategoryCarEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CATEGORY_CAR),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/category`, {
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
                return vehicle.getCategoryCarSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_CATEGORY_CAR REGISTER_MEMBERSHIP_EPIC:", ActionEvent.GET_CATEGORY_CAR, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getSellingVehicleSeenEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_SELLING_VEHICLE_SEEN),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/seen`, {
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
                return vehicle.getSellingVehicleSeenSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_SELLING_VEHICLE_SEEN_EPIC:", ActionEvent.GET_SELLING_VEHICLE_SEEN, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const saveSellingVehicleSeenEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.SAVE_SELLING_VEHICLE_SEEN),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/seen/save`, {
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
                return vehicle.saveSellingVehicleSeenSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("SAVE_SELLING_VEHICLE_SEEN_EPIC:", ActionEvent.SAVE_SELLING_VEHICLE_SEEN, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getVehicleDetailEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_SELLING_VEHICLE_DETAIL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/${action.payload.sellingVehicleId}/detail`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return vehicle.getSellingVehicleDetailSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_SELLING_VEHICLE_DETAIL:", ActionEvent.GET_SELLING_VEHICLE_DETAIL, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const updateSellingVehicleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.UPDATE_SELLING_VEHICLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/update`, {
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
                return vehicle.updateSellingVehicleSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("UPDATE_SELLING_VEHICLE:", ActionEvent.UPDATE_SELLING_VEHICLE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deleteSellingVehicleEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_SELLING_VEHICLE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `vehicle/selling/${action.payload.sellingVehicleId}/delete`, {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return vehicle.deleteSellingVehicleSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("DELETE_SELLING_VEHICLE:", ActionEvent.DELETE_SELLING_VEHICLE, error);
                    return handleConnectErrors(error)
                })
        )
    );