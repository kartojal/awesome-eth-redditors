FlowRouter.route('/awesome-eth-redditors', {
    name: "home",
    action: function() {
        BlazeLayout.render('layout');
    }
})

FlowRouter.notFound = {
    name: "404",
    action: function() {
        BlazeLayout.render('404');
    }
};
