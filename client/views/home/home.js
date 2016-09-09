import { Template } from 'meteor/templating';

Template.home.onRendered(async function(){
});

Template.home.helpers({
    'authUrl' : function() {
        return AwEthRedditors.getLoginUrl();
    },
    "conected" : function() {
        // TODO!
    }
});
