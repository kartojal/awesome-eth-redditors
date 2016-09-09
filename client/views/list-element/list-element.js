Template.element.onCreated(async function(){
    this.loading = new ReactiveVar(false);
});
Template.element.events({
    'click .add-new-friend'(event, template) {
        let nick, fullname, accessToken;
        event.preventDefault();
        nick = template.data.nick;
        fullname = template.data.fullname;
        if (typeof nick === "undefined" || nick == null) {
            Modal.show('unkErrorModal');
        }
        template.loading.set(true);
        accessToken = sessionStorage.getItem('accessToken');
        reddit.auth(accessToken).then(function() {
            return reddit('/api/v1/me/friends/' + nick).put({"note": "Added with Awesome Eth Redditors"});
        }).then(function(data) {
            awesomeUsers.update({"nick" : nick}, { $set : { "friend" : true } });
            template.loading.set(false);
            msg = "<span class='valid-response'>"+fullname+" added as a friend. Check their awesome posts in <a href='https://reddit.com/r/friends'>r/friends</a> now!</span>";
            sAlert.success(msg);
        }).catch(function(err){
            template.loading.set(false);
            let status = err.status;
            console.log(err);
            if (status == 401 || status == 403) {
                Modal.show('badTokenModal');
            } else {
                Modal.show('unkErrorModal');
            }
        });
    },
    'click .friend'(event, template) {
        let nick, fullname, msg, accessToken;
        event.preventDefault();
        nick = template.data.nick;
        fullname = template.data.fullname;
        if (typeof nick === "undefined" || nick == null) {
            Modal.show('unkErrorModal');
        }
        if (typeof fullname === "undefined" || nick == null) {
            Modal.show('unkErrorModal');
        }
        template.loading.set(true);
        accessToken = sessionStorage.getItem('accessToken');
        reddit.auth(accessToken).then(function() {
            return reddit('/api/v1/me/friends/' + nick).delete();
        }).then(function(data) {
            awesomeUsers.update({"nick" : nick}, { $set : { "friend" : false} });
            template.loading.set(false);
            msg = "<span class='valid-response'>You just unfriend "+fullname+". <\\3. </span>";
            sAlert.error(msg);
        }).catch(function(err){
            template.loading.set(false);
            let status = err.status;
            console.log(err);
            if (status == 401 || status == 403) {
                Modal.show('badTokenModal');
            } else {
                Modal.show('unkErrorModal');
            }
        });
    },
});

Template.element.helpers({
    "loading" : function() {
        return Template.instance().loading.get();
    }
})
