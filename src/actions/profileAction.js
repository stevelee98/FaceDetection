import {ActionEvent} from './actionEvent';

export const actGetCommissionRequest=()=>{
    return{
        type:ActionEvent.GET_COMMISSION
    }
}
export const actGetCommmissionSuccess=(commission)=>{
    return{
        type:ActionEvent.GET_COMMISSION_SUCCESS,
        commission
    }
}

export const actChangeQuantityCombo=(quantity)=>{
    return{
        type:ActionEvent.CHANGE_QUANTITYCOMBO,
        quantity
    }
}
