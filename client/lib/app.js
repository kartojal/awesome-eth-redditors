/*
*	Awesome Redditors JS module
*
**/

// Dependencies
import { Random } from 'meteor/random';

// Get a state required for preventing CORS.
export function getState() {
    const state = sessionStorage.getItem('stateToken');
    if (!state) {
        sessionStorage.setItem('stateToken', Random.id());
    }
    return sessionStorage.getItem('stateToken');
}

// Get the user token retrieved from Reddit Api
export function getUserToken() {
    // Manage Reddit Oauth login response
    const readUrl = readUrlHashParams();
    if (typeof readUrl === "undefined") {
        return;
    }
    const paramsLength = Object.keys(readUrl).length;
    if (paramsLength > 1) {
        let state = getState();
        if (typeof readUrl['state'] !== "undefined") {
            if (readUrl['state'] === state) {
                sessionStorage.setItem('accessToken', readUrl['access_token']);
                return sessionStorage.getItem('accessToken');
            }
        }
    } else {
        return;
    }
}

// Logout: Destroy all the session data.
export function userLogout() {
    sessionStorage.clear();
}

// Get the login url for requesting the Oauth Implicit temporary token.
export function getLoginUrl() {
    const state = getState(),
        authUrl = reddit.getAuthUrl(state);
    return authUrl;
}

// Get the form data returned from the response
export function readUrlHashParams() {
    let result, rightHash, params, paramSet;
    result = {};
    rightHash = window.location.hash.substring(1);
    params = rightHash.split("&");
    if (params != "") {
        for (let x = 0; x < params.length; x++) {
            paramSet = params[x].split("=");
            if (typeof (paramSet[1]) !== "undefined") {
                result[paramSet[0]] = decodeURIComponent(paramSet[1]);
            } else {
                result[paramSet[0]] = "";
            }
        }
    }
    return result;
}

// Create a promise and return the users friend list
export function getFriends() {
    return new Promise(function(resolve, reject) {
        let accessToken = getUserToken();
        if (typeof accessToken === "undefined") {
            resolve([]);
        }
        reddit.auth(accessToken).then(function(err) {
            reddit('/prefs/friends/').get().then(function(resp) {
                if (typeof resp[0].data['children'] === "undefined") {
                    resolve([]);
                }
                const friendsList = [].concat(resp[0].data["children"]);
                if (Array.isArray(friendsList)) {
                    resolve(friendsList);
                } else {
                    resolve([]);
                }
            }).catch(function(err) {
                console.log(err);
                resolve([]);
            })
        }).catch(function(err) {
            console.log(err);
            resolve([]);
        });
    });
}
