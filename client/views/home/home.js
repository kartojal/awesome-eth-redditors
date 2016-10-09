import { Template } from 'meteor/templating';
import * as AwEthRedditors from '/client/lib/app.js';

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
