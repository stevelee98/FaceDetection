import { ActionEvent, getActionSuccess } from './actionEvent';

export const getImageCategories = (filter) => ({
    type: ActionEvent.GET_IMAGE_CATEGORIES,
    payload: { ...filter }
})

export const getImageCategoriesSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_IMAGE_CATEGORIES),
    payload: { data }
})

export const getImages = (filter) => ({
    type: ActionEvent.GET_IMAGES,
    payload: { ...filter }
})

export const getImagesSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_IMAGES),
    payload: { data }
})