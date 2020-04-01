import { ActionEvent, getActionSuccess } from './actionEvent';

export const getPosts = filter => ({
    type: ActionEvent.GET_POSTS,
    payload: { ...filter }
})

export const getPostsSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_POSTS),
    payload: { data }
})