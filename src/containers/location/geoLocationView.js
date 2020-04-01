
import React, {Component} from "react";
import {View, Platform, PermissionsAndroid, Alert} from "react-native";
import BaseView from "containers/base/baseView";
import StorageUtil from "utils/storageUtil";
import Utils from "utils/utils";
import userType from "enum/userType";
import {configConstants} from 'values/configConstants';
// import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {Colors} from "values/colors";
import ServerPath from "config/Server";
import ApiUtil from "utils/apiUtil";
export default class GeoLocationView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            region: null,
            locations: [],
            stationeries: [],
            isRunning: false,
            error: null
        };
        this.TIMEOUT_START_POSITION = 30000; //30s
        this.TIMEOUT_CURRENT_POSITION = 20000; //20s
        this.TIMEOUT_CACHE_OLD_POSITION = 10000; //10s
        this.DISTANCE_LOCATION = 0; //Distance value return location(m) 30
        this.STATIONARY_LOCATION = 0; //Stationary value return location(m) 50
        this.INTERVAL = 5000;
        this.FASTEST_INTERVAL = 5000;
        this.ACTIVITIES_INTERVAL = 5000;
    }

    /**
     * Get geo location
     */
    getGeoLocation () {
        setInterval(() => {
            this.getLocation();
        }, this.TIMEOUT_START_POSITION);
    }

    /**
     * Get location
     */
    getLocation = async () => {
        const hasLocationPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (!hasLocationPermission) return;

        // BackgroundGeolocation.getCurrentLocation(lastLocation => {
        //     let region = this.state.region;
        //     const latitudeDelta = 0.01;
        //     const longitudeDelta = 0.01;
        //     region = Object.assign({}, lastLocation, {
        //         latitudeDelta,
        //         longitudeDelta
        //     });
        //     console.log("lastLocation", [lastLocation])
        //     console.log("region", region)
        //     this.setState({ locations: [lastLocation], region });
        // }, (error) => {
        //     this.setState({ error: error });
        //     console.log(error);
        // }, {
        //     enableHighAccuracy: true,
        //     timeout: this.TIMEOUT_CURRENT_POSITION,
        //     maximumAge: this.TIMEOUT_CACHE_OLD_POSITION
        // });
    }

    /**
     * Toggle tracking
     */
    toggleTracking = async () => {
        const hasLocationPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        // if (!hasLocationPermission) return;

        // BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
        //     if (isRunning) {
        //         BackgroundGeolocation.stop();
        //         return false;
        //     }

        //     if (!locationServicesEnabled) {
        //         Alert.alert(
        //             'Dịch vụ định vị đang tắt',
        //             'Bạn có muốn mở cài đặt vị trí không?',
        //             [
        //                 {
        //                     text: 'No',
        //                     onPress: () => console.log('No Pressed'),
        //                     style: 'cancel'
        //                 },
        //                 {
        //                     text: 'Yes',
        //                     onPress: () => BackgroundGeolocation.showLocationSettings()
        //                 },
        //             ]
        //         );
        //         return false;
        //     }

        // if (authorization == 99) {
        //     // authorization yet to be determined
        //     this.locationOnStart();
        // } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
        //     // calling start will also ask user for permission if needed
        //     // permission error will be handled in permission_denied event
        //     this.locationOnStart();
        // } else {
        //     Alert.alert(
        //         'Ứng dụng yêu cầu theo dõi vị trí',
        //         'Cho phép truy cập vào vị trí của thiết bị này?',
        //         [
        //             {
        //                 text: 'OK',
        //                 onPress: () => this.locationOnStart()
        //             }
        //         ]
        //     );
        // }
        // });
    }

    /**
     * Get my location
     */
    getMyLocation () {

    }

    async componentDidMount () {
        super.componentDidMount();
        this.toggleTracking();
        // // this.getGeoLocation();
        // BackgroundGeolocation.configure({
        //     desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        //     stationaryRadius: this.STATIONARY_LOCATION,
        //     distanceFilter: this.DISTANCE_LOCATION,
        //     notificationTitle: 'Thiết lập vị trí bằng GPS',
        //     notificationText: 'NPV Logistics đang theo dõi vị trí của bạn',
        //     notificationIconColor: Colors.COLOR_PRIMARY,
        //     debug: false,
        //     startOnBoot: false,
        //     stopOnTerminate: true,
        //     locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
        //     interval: this.INTERVAL,
        //     fastestInterval: this.FASTEST_INTERVAL,
        //     activitiesInterval: this.ACTIVITIES_INTERVAL,
        //     stopOnStillActivity: false,
        //     startForeground: false,
        //     postTemplate: null
        // });

        // BackgroundGeolocation.on('location', location => {
        //     console.log('[DEBUG] BackgroundGeolocation location', location);
        //     const longitudeDelta = 0.01;
        //     const latitudeDelta = 0.01;
        //     const region = Object.assign({}, location, {
        //         latitudeDelta,
        //         longitudeDelta
        //     });
        //     const locations = [];
        //     locations.push(location);
        //     this.setState({ locations, region }, () => this.getMyLocation());
        //     BackgroundGeolocation.startTask(taskKey => {
        //         requestAnimationFrame(() => {
        //             // execute long running task
        //             // eg. ajax post location
        //             // IMPORTANT: task has to be ended by endTask
        //             BackgroundGeolocation.endTask(taskKey);
        //         });
        //     });
        // });

        // BackgroundGeolocation.on('stationary', (location) => {
        //     console.log('[DEBUG] BackgroundGeolocation stationary', location);
        //     BackgroundGeolocation.startTask(taskKey => {
        //         requestAnimationFrame(() => {
        //             if (location.radius) {
        //                 const longitudeDelta = 0.01;
        //                 const latitudeDelta = 0.01;
        //                 const region = Object.assign({}, location, {
        //                     latitudeDelta,
        //                     longitudeDelta
        //                 });
        //                 const stationeries = [];
        //                 stationeries.push(location);
        //                 this.setState({ stationeries, region });
        //             }
        //             BackgroundGeolocation.endTask(taskKey);
        //         });
        //     });
        // });

        // BackgroundGeolocation.on('start', () => {
        //     // service started successfully
        //     // you should adjust your app UI for example change switch element to indicate
        //     // that service is running
        //     console.log('[DEBUG] BackgroundGeolocation has been started');
        //     this.setState({ isRunning: true });
        // });

        // BackgroundGeolocation.on('stop', () => {
        //     console.log('[DEBUG] BackgroundGeolocation has been stopped');
        //     this.setState({ isRunning: false });
        //     this.locationOnStart();
        // });

        // BackgroundGeolocation.on('foreground', () => {
        //     console.log('[INFO] App is in foreground');
        // });

        // BackgroundGeolocation.on('background', () => {
        //     console.log('[INFO] App is in background');
        // });

        // BackgroundGeolocation.on('error', ({ message }) => {
        //     Alert.alert('BackgroundGeolocation error', message);
        // });

        // BackgroundGeolocation.on('authorization', status => {
        //     console.log(
        //         '[INFO] BackgroundGeolocation authorization status: ' + status
        //     );
        //     if (status !== BackgroundGeolocation.AUTHORIZED) {
        //         // we need to set delay after permission prompt or otherwise alert will not be shown
        //         setTimeout(() =>
        //             Alert.alert(
        //                 'Ứng dụng yêu cầu theo dõi vị trí',
        //                 'Bạn có muốn mở cài đặt ứng dụng không?',
        //                 [
        //                     {
        //                         text: 'Không',
        //                         onPress: () => console.log('No Pressed'),
        //                         style: 'cancel'
        //                     },
        //                     {
        //                         text: 'Có',
        //                         onPress: () => BackgroundGeolocation.showAppSettings()
        //                     }
        //                 ]
        //             ), 1000);
        //     }
        // });

        // BackgroundGeolocation.checkStatus(({ isRunning }) => {
        //     this.setState({ isRunning });
        //     if (isRunning) {
        //         this.locationOnStart();
        //     }
        // });
    }

    /**
     * Location on start
     */
    locationOnStart = () => {
        // BackgroundGeolocation.start();
    }

    componentWillUnmount () {
        super.componentWillUnmount();
        // BackgroundGeolocation.events.forEach(event =>
        //     BackgroundGeolocation.removeAllListeners(event)
        // );
    }

    render () {
        return (<View></View>)
    }
}