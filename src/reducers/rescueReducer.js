import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.REQUEST_RESCUE:
        case ActionEvent.CANCEL_REQUEST_RESCUE:
        case ActionEvent.GET_ADDRESS_FROM_PLACE_ID:
        case ActionEvent.GET_MY_LOCATION_BY_LAT_LNG:
        case ActionEvent.GET_TROUBLE:
        case ActionEvent.GET_TROUBLE_FOR_EMPLOYEE:
        case ActionEvent.FIND_EMPLOYEE_RESCUE:
        case ActionEvent.ACCEPT_EMPLOYEE_RESCUE:
        case ActionEvent.RESCUE_COMPLETE:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.REQUEST_RESCUE):
        case getActionSuccess(ActionEvent.CANCEL_REQUEST_RESCUE):
        case getActionSuccess(ActionEvent.GET_TROUBLE):
        case getActionSuccess(ActionEvent.GET_TROUBLE_FOR_EMPLOYEE):
        case getActionSuccess(ActionEvent.FIND_EMPLOYEE_RESCUE):
        case getActionSuccess(ActionEvent.ACCEPT_EMPLOYEE_RESCUE):
        case getActionSuccess(ActionEvent.RESCUE_COMPLETE):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case getActionSuccess(ActionEvent.GET_ADDRESS_FROM_PLACE_ID):
        case getActionSuccess(ActionEvent.GET_MY_LOCATION_BY_LAT_LNG):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data !== undefined ? action.payload.data : null,
                errorCode: ErrorCode.ERROR_SUCCESS,
                action: action.type,
            }
        case ActionEvent.REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
                errorCode: action.payload.errorCode,
                action: action.type
            }
        default:
            return state;
    }
}