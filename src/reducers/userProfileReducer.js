import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.GET_USER_INFO:
        case ActionEvent.EDIT_PROFILE:
        case ActionEvent.CHANGE_TARGET_POINT:
        case ActionEvent.LOGIN_FB:
        case ActionEvent.LOGIN_GOOGLE:
        case ActionEvent.CHANGE_PASS:
        case ActionEvent.GET_STAFFS:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type,
                screen: action.screen
            }
        case ActionEvent.GET_ALL_CART:
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_SUCCESS,
                data: action.payload !== undefined ? action.payload : null,
                action: action.type
            }
            break;
        case getActionSuccess(ActionEvent.GET_USER_INFO):
        case getActionSuccess(ActionEvent.EDIT_PROFILE):
        case getActionSuccess(ActionEvent.CHANGE_TARGET_POINT):
        case getActionSuccess(ActionEvent.LOGIN_FB):
        case getActionSuccess(ActionEvent.LOGIN_GOOGLE):
        case getActionSuccess(ActionEvent.CHANGE_PASS):
        case getActionSuccess(ActionEvent.GET_STAFFS):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
            break;
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