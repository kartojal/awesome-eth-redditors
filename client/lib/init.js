import { Template } from 'meteor/templating';

var Snoocore = require('/imports/client/snoocore.min.js');


awesomeUsers = new Mongo.Collection(null);
// Global functions


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
    inputJSON = 'https://rawgit.com/kartojal/awesome-eth-redditors/master/public/curated_list.json';
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
