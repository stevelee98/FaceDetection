import { ActionEvent, getActionSuccess } from './actionEvent';

export const getModuleLink = () => ({
    type: ActionEvent.GET_MODULE_LINK
})

export const getModuleLinkSuccess = data => ({
    type: getActionSuccess(ActionEvent.GET_MODULE_LINK),
    payload: { data }
})