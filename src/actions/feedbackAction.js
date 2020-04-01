import { ActionEvent, getActionSuccess } from './actionEvent'
import { filter } from 'rxjs/operators';

export const sendFeedback = filter => ({
    type: ActionEvent.SEND_FEEDBACK,
    payload: { ...filter }
})

export const sendFeedbackSuccess = data => ({
    type: getActionSuccess(ActionEvent.SEND_FEEDBACK),
    payload: { data }
})