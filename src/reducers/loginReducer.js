import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    switch (action.type) {
        case ActionEvent.LOGIN:
        case ActionEvent.GET_USER_INFO:
        case ActionEvent.GET_CONFIG:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type
            }
        case getActionSuccess(ActionEvent.RELOAD_LOGIN_SUCCESS):
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: undefined,
                action: action.type,
            }
        case getActionSuccess(ActionEvent.LOGIN):
        case getActionSuccess(ActionEvent.GET_CONFIG):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.LOGIN_GOOGLE:
        case ActionEvent.LOGIN_FB:
        case ActionEvent.LOGIN_ZALO:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: undefined,
                action: action.type,
            }
        case getActionSuccess(ActionEvent.LOGIN_GOOGLE):
        case getActionSuccess(ActionEvent.LOGIN_FB):
        case getActionSuccess(ActionEvent.LOGIN_ZALO):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case getActionSuccess(ActionEvent.GET_USER_INFO):
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
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