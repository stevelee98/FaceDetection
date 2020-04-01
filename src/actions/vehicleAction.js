import { ActionEvent, getActionSuccess } from './actionEvent';

export const getNewsSellingVehicle = filter => ({
    type: ActionEvent.GET_NEWS_SELLING_VEHICLE,
    payload: { ...filter }
})

export const getNewsSellingVehicleSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_NEWS_SELLING_VEHICLE),
    payload: { data }
})

export const postNewsSellingVehicle = filter => ({
    type: ActionEvent.POST_NEWS_SELLING_VEHICLE,
    payload: { ...filter }
})

export const postNewsSellingVehicleSuccess = data => ({
    type: getActionSuccess(ActionEvent.POST_NEWS_SELLING_VEHICLE),
    payload: { data }
})

export const getNewsSellingVehicleInterest = (filter) => ({
    type: ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST,
    payload: { ...filter }
})

export const getNewsSellingVehicleInterestSuccess = (data) => ({
    type: getActionSuccess(ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST),
    payload: { data }
})

export const getMyPostSellingVehicle = filter => ({
    type: ActionEvent.GET_MY_POST_SELLING_VEHICLE,
    payload: { ...filter }
})

export const getMyPostSellingVehicleSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MY_POST_SELLING_VEHICLE),
    payload: { data }
})

export const updateStatusSoldSellingPost = sellingPostId => ({
    type: ActionEvent.UPDATE_STATUS_SOLD_SELLING_POST,
    payload: { sellingPostId }
})

export const updateStatusSoldSellingPostSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_STATUS_SOLD_SELLING_POST),
    payload: { data }
});

export const getNewsSellingVehicleInterestDisplay = filter => ({
    type: ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_DISPLAY,
    payload: { ...filter }
})

export const getNewsSellingVehicleInterestDisplaySuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_DISPLAY),
    payload: { data }
})

export const getNewsSellingVehicleInterestHome = filter => ({
    type: ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_HOME,
    payload: { ...filter }
})

export const getNewsSellingVehicleInterestHomeSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_NEWS_SELLING_VEHICLE_INTEREST_HOME),
    payload: { data }
})

export const getSellingVehicleDetail = sellingVehicleId => ({
    type: ActionEvent.GET_SELLING_VEHICLE_DETAIL,
    payload: { sellingVehicleId }
})

export const getSellingVehicleDetailSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_SELLING_VEHICLE_DETAIL),
    payload: { data }
})

export const getSellingVehicleSeen = filter => ({
    type: ActionEvent.GET_SELLING_VEHICLE_SEEN,
    payload: { ...filter }
})

export const getSellingVehicleSeenSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_SELLING_VEHICLE_SEEN),
    payload: { data }
})

export const saveSellingVehicleSeen = filter => ({
    type: ActionEvent.SAVE_SELLING_VEHICLE_SEEN,
    payload: { ...filter }
})

export const saveSellingVehicleSeenSuccess = data => ({
    type: getActionSuccess(ActionEvent.SAVE_SELLING_VEHICLE_SEEN),
    payload: { data }
})

export const searchCarByVehicle = filter => ({
    type: ActionEvent.SEARCH_CAR_VEHICLE,
    payload: { ...filter }
})

export const searchCarByVehicleSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEARCH_CAR_VEHICLE),
    payload: { data }
})

export const getCategoryCar = filter => ({
    type: ActionEvent.GET_CATEGORY_CAR,
    payload: { ...filter }
})

export const getCategoryCarSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_CATEGORY_CAR),
    payload: { data }
})

export const updateSellingVehicle = filter => ({
    type: ActionEvent.UPDATE_SELLING_VEHICLE,
    payload: { ...filter }
})

export const updateSellingVehicleSuccess = data => ({
    type: getActionSuccess(ActionEvent.UPDATE_SELLING_VEHICLE),
    payload: { data }
})

export const deleteSellingVehicle = sellingVehicleId => ({
    type: ActionEvent.DELETE_SELLING_VEHICLE,
    payload: { sellingVehicleId }
})

export const deleteSellingVehicleSuccess = data => ({
    type: getActionSuccess(ActionEvent.DELETE_SELLING_VEHICLE),
    payload: { data }
})

export const refreshAction = data => ({
    type: ActionEvent.REFRESH_ACTION,
    payload: { data }
})