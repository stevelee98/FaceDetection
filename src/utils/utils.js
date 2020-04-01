import StringUtil from "./stringUtil";
import colorsType from "enum/colorsType";
import { Colors } from "values/colors";
import imageRatio from "enum/imageRatio";
var RNFS = require('react-native-fs');

export default class Utils {

    static chunkArray(array, size) {
        if (array == []) return [];
        return array.reduce((acc, val) => {
            if (acc.length === 0) acc.push([]);
            const last = acc[acc.length - 1];
            if (last.length < size) {
                last.push(val);
            } else {
                acc.push([val]);
            }
            return acc;
        }, []);
    }

    static hex2rgb(hex, opacity) {
        hex = hex.trim();
        hex = hex[0] === '#' ? hex.substr(1) : hex;
        var bigint = parseInt(hex, 16), h = [];
        if (hex.length === 3) {
            h.push((bigint >> 4) & 255);
            h.push((bigint >> 2) & 255);
        } else {
            h.push((bigint >> 16) & 255);
            h.push((bigint >> 8) & 255);
        }
        h.push(bigint & 255);
        if (arguments.length === 2) {
            h.push(opacity);
            return 'rgba(' + h.join() + ')';
        } else {
            return 'rgb(' + h.join() + ')';
        }
    }

    /**
     * Validate email
     * @param {*} email 
     */
    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email)
    }

    /**
     * Validate phone
     */
    static validatePhone(phone) {
        // var re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/;
        var re = /(\+84|0)([35789]\d{8}|1\d{9})$/g;
        return re.test(phone)
    }

    /**
     * Validate password
     * @param {*} passWord 
     */
    static validateSpacesPass(passWord) {
        return passWord.match(' ') == null ? false : true

    }

    static validateContainUpperPassword(passWord) {
        var re = /[A-Z]/;
        return re.test(passWord)
    }

    /**
     * Validate date of bird
     */
    static validateDate(dateOfBird) {
        var re = /^([0-3]{1})([0-9]{1})\/([0-1]{1})([0-9]{1})\/([0-9]{4})$/;
        return re.test(dateOfBird)
    }

    /**
     * Check data null
     * @param {*} data 
     */
    static isNull(data) {
        if (data == undefined || data == null || data.length == 0) {
            return true
        } else if (typeof data == "string") {
            return StringUtil.isNullOrEmpty(data)
        }
        return false
    }

    /**
     * Random String
     * @param {*} length 
     * @param {*} chars 
     */
    static randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    /**
     * Get length of number
     * Ex: 12 => func return 2
     * Ex: 1  => func return 1
     * @param {*} number
     */
    static getLength(number) {
        return (number + '').replace('.', '').length;  // for floats
    }

    /**
     * Convert color
     * @param {*} colorType 
     */
    static convertColor(colorType) {
        let codeHex = "";
        switch (colorType) {
            case colorsType.RED:
                codeHex = Colors.COLOR_RED
                break;
            case colorsType.BLACK:
                codeHex = Colors.COLOR_BLACK
                break;
            case colorsType.BLUE:
                codeHex = Colors.COLOR_BLUE
                break;
            case colorsType.BROW:
                codeHex = Colors.COLOR_BROWN
                break;
            case colorsType.GOLD:
                codeHex = Colors.COLOR_GOLD
                break;
            case colorsType.GREEN:
                codeHex = Colors.COLOR_GREEN
                break;
            case colorsType.ORANGES:
                codeHex = Colors.COLOR_ORANGE
                break;
            case colorsType.PINK:
                codeHex = Colors.COLOR_PINK
                break;
            case colorsType.VIOLET:
                codeHex = Colors.COLOR_VIOLET
                break;
            case colorsType.WHITE:
                codeHex = Colors.COLOR_WHITE
                break;
            case colorsType.YELLOW:
                codeHex = Colors.COLOR_YELLOW
                break;
        }
        return codeHex;
    }

    /**
     * Get size image
     * @param {*} ratio 
     */
    static sizeImage(ratio) {
        let ratioNumber = 1
        if (ratio == imageRatio.RATIO_16_9) {
            ratioNumber = 9 / 16
        } else if (ratio == imageRatio.RATIO_4_3) {
            ratioNumber = 3 / 4
        } else if (ratio == imageRatio.RATIO_3_2) {
            ratioNumber = 2 / 3
        } else if (ratio == imageRatio.RATIO_9_16) {
            ratioNumber = 16 / 9
        } else if (ratio == imageRatio.RATIO_3_4) {
            ratioNumber = 4 / 3
        } else if (ratio == imageRatio.RATIO_2_3) {
            ratioNumber = 3 / 2
        }
        return ratioNumber
    }

    /**
     * Get language
     * @param {*} deviceLocale 
     */
    static isEnglishLanguage(deviceLocale) {
        if (deviceLocale == 'vi' || deviceLocale == 'vi-VN') {
            return false
        } else if (deviceLocale == 'en-US' || deviceLocale == 'en' || deviceLocale == 'en-UK') {
            return true
        }
    }

    static writeFile(uri, onSuccess, onFailure, name = 'cache') {
        let randomNumber = Utils.getRandomInt(0, 100000000000);
        var path = RNFS.DocumentDirectoryPath + '/' + name + randomNumber + '.jpg';
        // var path = RNFS.ExternalCachesDirectoryPath + '/' + name + '.jpg';
        if (uri.includes('http://')) {
            RNFS.downloadFile({ fromUrl: uri, toFile: path })
                .promise
                .then(res => {
                    onSuccess(path);
                })
                .catch(err => {
                    onFailure(err)
                })
        }
        // LOCAL IMAGE => move image to sand box 
        else {
            RNFS.moveFile(uri, path)
                // RNFS.copyFile(uri, path)
                .then(() => {
                    onSuccess(path);
                })
                .catch(error => {
                    onFailure(error);
                });
        }
    }

    /**
 * Get a random integer between `min` and `max`.
 * 
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


}
