import { Template } from 'meteor/templating';
import { Random } from 'meteor/random';
var Snoocore = require('/imports/client/snoocore.min.js');


awesomeUsers = new Mongo.Collection(null);
// Global functions
AwEthRedditors = {
    // Get a state required for preventing CORS.
    "getState": function() {
        let state;
        state = sessionStorage.getItem('stateToken');
        if (!state) {
            sessionStorage.setItem('stateToken', Random.id());
        }
        return sessionStorage.getItem('stateToken');
    },
    // Get the user token retrieved from Reddit Api
    "getUserToken": function() {
        // Manage Reddit Oauth login response
        let readUrl = readUrlHashParams();
        if (typeof readUrl === "undefined") {
            return;
        }
        let paramsLength = Object.keys(readUrl).length;
        if (paramsLength > 1) {
            let state = AwEthRedditors.getState();
            if (typeof readUrl['state'] !== "undefined") {
                if (readUrl['state'] === state) {
                    sessionStorage.setItem('accessToken',readUrl['access_token']);
                    return sessionStorage.getItem('accessToken');
                }
            }
        } else {
            return;
        }
    },
    // Logout: Destroy all the session data.
    "userLogout": function() {
        sessionStorage.clear();
    },
    // Get the login url for requesting the Oauth Implicit temporary token.
    "getLoginUrl": function() {
        let state, authUrl;
        state = AwEthRedditors.getState();
        authUrl = reddit.getAuthUrl(state);
        return authUrl;
    },
    "getFriends" : function() {
        return new Promise(function(resolve, reject) {
            let accessToken = AwEthRedditors.getUserToken();
            if (typeof accessToken === "undefined") {
                resolve([]);
            }
            reddit.auth(accessToken).then(function(err){
                reddit('/prefs/friends/').get().then(function(resp){
                    if (typeof resp[0].data['children'] === "undefined") {
                        resolve([]);
                    }
                    let friendsList = [].concat(resp[0].data["children"]);
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
    },
}

// Snoocore config - Using Oath2 in "Implicit Flow" mode (1 hour token for installed/client side apps in Reddit API)
reddit = new Snoocore({
  userAgent: 'EtherFavs',
  oauth: {
    type: 'implicit',
    mobile: false, // Could be determined by js fn at init.
    key: 'GX_nT3A1az-bfg',
    redirectUri: 'https://kartojal.github.io/awesome-eth-redditors/',
    scope: [ 'subscribe', 'read']
  }
});

Meteor.startup(function() {
    Meteor.disconnect();
    // Get JSON list of curated redditors
    inputJSON = 'https://kartojal.github.io/awesome-eth-redditors/awesome-eth-redditors.json';
    reddit.on('access_token_expired', function(responseError) {
        console.log("access-token-expired");
    });
    // sAlert animations config
    sAlert.config({
        effect: 'bouncyflip',
        position: 'top-right',
        timeout: 12000,
        html: true,
        onRouteClose: true,
        stack: true,
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
    });
});

// Get the form data returned from the response
function readUrlHashParams() {
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
