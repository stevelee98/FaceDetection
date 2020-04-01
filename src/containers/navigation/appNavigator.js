import React, { Component } from "react";
import {
    Easing, Animated, View, Text
} from "react-native";
import { createAppContainer, createStackNavigator } from 'react-navigation';
import LoginView from 'containers/login/loginView';
import UserProfileView from 'containers/profile/info/userProfileView';
import HomeView from 'containers/home/homeView';
import RegisterView from 'containers/register/registerView';
import SplashView from 'containers/splash/splashView';
import Main from 'containers/main/bottomTabNavigator';
import ForgotPasswordView from 'containers/forgotPassword/forgotPasswordView';
import ConfirmPasswordView from 'containers/forgotPassword/confirmPassword/confirmPasswordView';
import NotificationView from 'containers/notification/notificationView';
import QuestionAnswerView from 'containers/faq/questionAnswerView';
import Demo from 'containers/demo/demo';
import OTPView from 'containers/otp/otpView';
import ChatView from "containers/chat/chatView";
import ListChatView from "containers/chat/listChatView";
import RegisterPartnerView from "containers/register/partner/registerPartnerView";
import ChangePasswordView from "containers/profile/password/changePasswordView";
import EditProfileView from 'containers/profile/editprofile/editProfileView';
import FeedbackView from 'containers/feedback/feedbackView.js';
import FaceDetectionView from 'containers/faceDetection/faceDetectionView';
import RegisterFace from 'containers/faceDetection/registerFace';
import CreatePersonGroup from 'containers/faceDetection/createPersonGroup';
import AddPerson from 'containers/faceDetection/addPerson';
import InputGroupForRecognize from 'containers/faceDetection/inputGroupForRegonize';

const AppNavigator = createStackNavigator(
    {
        FaceDetection: FaceDetectionView,
        InputGroupForRecognize: InputGroupForRecognize,
        RegisterFace: RegisterFace,
        ForgotPassword: ForgotPasswordView,
        Splash: SplashView,
        Login: LoginView,
        Register: RegisterView,
        Profile: UserProfileView,
        EditProfile: EditProfileView,
        ChangePassword: ChangePasswordView,
        Main: Main,
        Notification: NotificationView,
        Home: HomeView,
        QuestionAnswer: QuestionAnswerView,
        Demo: Demo,
        ConfirmPassword: ConfirmPasswordView,
        OTP: OTPView,
        Chat: ChatView,
        ListChat: ListChatView,
        RegisterPartner: RegisterPartnerView,
        Feedback: FeedbackView,
        CreatePersonGroup: CreatePersonGroup,
        AddPerson: AddPerson
    }, {
    initialRouteName: 'Splash',
    headerMode: 'none',
    mode: 'modal',
    defaultNavigationOptions: {
        gesturesEnabled: false,
    },
    transitionConfig: () => ({
        transitionSpec: {
            duration: 500,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true
        },
        screenInterpolator: sceneProps => {
            const { position, layout, scene, index, scenes } = sceneProps
            const toIndex = index
            const thisSceneIndex = scene.index
            const height = layout.initHeight
            const width = layout.initWidth

            const translateX = position.interpolate({
                inputRange: [ thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1 ],
                outputRange: [ width, 0, 0 ]
            })

            // Since we want the card to take the same amount of time
            // to animate downwards no matter if it's 3rd on the stack
            // or 53rd, we interpolate over the entire range from 0 - thisSceneIndex
            const translateY = position.interpolate({
                inputRange: [ 0, thisSceneIndex ],
                outputRange: [ height, 0 ]
            })

            const slideFromRight = { transform: [ { translateX } ] }
            const slideFromBottom = { transform: [ { translateY } ] }

            const lastSceneIndex = scenes[ scenes.length - 1 ].index

            // Test whether we're skipping back more than one screen
            // and slide from bottom if true
            if (lastSceneIndex - toIndex > 1) {
                // Do not transoform the screen being navigated to
                if (scene.index === toIndex) return
                // Hide all screens in between
                if (scene.index !== lastSceneIndex) return { opacity: 0 }
                // Slide top screen down
                return slideFromBottom
            }
            // Otherwise slide from right
            return slideFromRight
        },
    }),
}
);

const BaseNavigatorContainer = createAppContainer(AppNavigator);

export { BaseNavigatorContainer as AppNavigator };
