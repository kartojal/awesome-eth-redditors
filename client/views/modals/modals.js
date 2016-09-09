import { Template } from 'meteor/templating';
Template.badTokenModal.helpers({
    'authUrl' : function() {
        return AwEthRedditors.getLoginUrl();
    }
});
