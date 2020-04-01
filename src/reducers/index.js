import { combineReducers } from 'redux';
import userReducer from 'reducers/userReducer';
import examReducer from 'reducers/examReducer';
import loginReducer from 'reducers/loginReducer';
import signUpReducer from 'reducers/signUpReducer';
import homeReducer from 'reducers/homeReducer';
import { ErrorCode } from 'config/errorCode';
import testListReducer from 'reducers/testListReducer';
import listeningReducer from 'reducers/listeningReducer';
import examinationListReducer from 'reducers/examinationListReducer';
import forgetPassReducer from 'reducers/forgetPassReducer';
import changePassReducer from 'reducers/changePassReducer';
import listeningOfficialAnswerReducer from 'reducers/listeningOfficialAnswerReducer';
import addCreditReducer from 'reducers/creditReducer';
import commissionReducer from 'reducers/commissionReducer'
import writingReducer from 'reducers/writingReducer';
import registerTestingReducer from 'reducers/registerTestingReducer';
import userProfileReducer from 'reducers/userProfileReducer';
import detailTestingReducer from 'reducers/detailTestingReducer';
import registerSpeakingScheduleReducer from 'reducers/registerSpeakingScheduleReducer';
import registrationWritingReducer from 'reducers/registrationWritingReducer';
import packageReducer from 'reducers/packageReducer';
import notificationsReducer from 'reducers/notificationsReducer';
import makeSuggestionsReducer from 'reducers/makeSuggestionsReducer';
import typeExamReducer from 'reducers/typeExamReducer';
import engStarReducer from 'reducers/engStarReducer';
import speakingReducer from 'reducers/speakingReducer';
import listMarkTeacherReducer from 'reducers/listMarkTeacherReducer';
import mainReducer from 'reducers/mainReducer';
import serviceReducer from 'reducers/serviceReducer';
import laundryReducer from 'reducers/laundryReducer';
import listPriceReducer from 'reducers/listPriceReducer';
import introduceReducer from './introduceReducer';
import otpReducer from './otpReducer';
import registerMembershipReducer from './registerMembershipReducer';
import rescueReducer from './rescueReducer';
import recentBranchReducer from './recentBranchReducer';
import transactionHistoryReducer from './transactionHistoryReducer';
import addressReducer from './addressReducer';
import sellingVehiclePostReducer from './sellingVehiclePostReducer';
import sellingVehicleReducer from './sellingVehicleReducer';
import sellingVehicleGeneralReducer from './sellingVehicleGeneralReducer';
import productDetailReducer from './productDetailReducer';
import appointmentReducer from './appointmentReducer';
import autocompleteReducer from './autocompleteReducer';
import sellingVehicleDetailReducer from './sellingVehicleDetailReducer';
import listChatReducer from './listChatReducer';
import chatReducer from './chatReducer';
import orderDetailReducer from './orderDetailReducer';
import partnerReducer from './partnerReducer';
import listInterestReducer from './listInterestReducer';
import productCategoryReducer from './productCategoryReducer';
import productReducer from './productReducer';
import searchProductReducer from './searchProductReducer';
import sendReviewReducer from './sendReviewReducer';
import reviewsReducer from './reviewsReducer';
import filterProductReducer from './filterProductReducer';
import ordersReducer from './ordersReducer';
import cartReducer from './cartReducer';
import orderProductReducer from './orderProductReducer';
import searchBranchReducer from './searchBranchReducer';
import registerAppointmentReducer from './registerAppointmentReducer';
import payooPaymentReducer from './payooPaymentReducer';
import newProductReducer from './newProductReducer';
import hotProductReducer from './hotProductReducer';
import feedbackReducer from './feedbackReducer';
import photoLibraryReducer from './photoLibraryReducer';
import postReducer from './postReducer';

export const initialState = {
    data: null,
    isLoading: false,
    error: null,
    errorCode: ErrorCode.ERROR_INIT,
    action: null
}

export default combineReducers({
    user: userReducer,
    exam: examReducer,
    login: loginReducer,
    home: homeReducer,
    signUp: signUpReducer,
    testList: testListReducer,
    listening: listeningReducer,
    examinationList: examinationListReducer,
    forgetPass: forgetPassReducer,
    changePass: changePassReducer,
    listeningOfficialAnswer: listeningOfficialAnswerReducer,
    examinationList: examinationListReducer,
    changePass: changePassReducer,
    addCredit: addCreditReducer,
    commission: commissionReducer,
    writing: writingReducer,
    registerTesting: registerTestingReducer,
    userProfile: userProfileReducer,
    detailTesting: detailTestingReducer,
    package: packageReducer,
    registerSpeakingSchedule: registerSpeakingScheduleReducer,
    registrationWriting: registrationWritingReducer,
    notifications: notificationsReducer,
    makeSuggestions: makeSuggestionsReducer,
    typeExam: typeExamReducer,
    engStar: engStarReducer,
    speaking: speakingReducer,
    listMarkTeacher: listMarkTeacherReducer,
    main: mainReducer,
    service: serviceReducer,
    laundry: laundryReducer,
    listPrice: listPriceReducer,
    introduce: introduceReducer,
    otp: otpReducer,
    registerMembership: registerMembershipReducer,
    rescue: rescueReducer,
    recentBranch: recentBranchReducer,
    transactionHistory: transactionHistoryReducer,
    address: addressReducer,
    sellingVehiclePost: sellingVehiclePostReducer,
    sellingVehicle: sellingVehicleReducer,
    sellingVehicleGeneral: sellingVehicleGeneralReducer,
    productDetail: productDetailReducer,
    appointment: appointmentReducer,
    autocomplete: autocompleteReducer,
    sellingVehicleDetail: sellingVehicleDetailReducer,
    listChat: listChatReducer,
    chat: chatReducer,
    orderDetail: orderDetailReducer,
    partner: partnerReducer,
    listInterest: listInterestReducer,
    productCategory: productCategoryReducer,
    product: productReducer,
    searchProduct: searchProductReducer,
    sendReview: sendReviewReducer,
    reviews: reviewsReducer,
    filterProduct: filterProductReducer,
    orders: ordersReducer,
    cart: cartReducer,
    orderProduct: orderProductReducer,
    searchBranch: searchBranchReducer,
    registerAppointment: registerAppointmentReducer,
    payooPayment: payooPaymentReducer,
    newProduct: newProductReducer,
    hotProduct: hotProductReducer,
    feedback: feedbackReducer,
    photoLibrary: photoLibraryReducer,
    post: postReducer
});

