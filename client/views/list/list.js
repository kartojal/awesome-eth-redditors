import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Mongo} from 'meteor/mongo';


Template.list.onRendered(async function() {
    let listElements, userList, jsonFile, request, totalUsers;
    actualFriends = await AwEthRedditors.getFriends();
    request = new XMLHttpRequest();
    request.open("GET", inputJSON, true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            jsonFile = JSON.parse(request.responseText);
            usersList = jsonFile.awesome_users;
            for (let index = 0; index < usersList.length ; index++) {
                friendObj = usersList[index];
                friendObj["friend"] = false;
                if (typeof actualFriends !== "undefined") {
                    for (let x = 0; x < actualFriends.length; x++) {
                        f = actualFriends[x];
                        if ( f["name"] == friendObj.nick) {
                            friendObj["friend"] = true;
                            break;
                        }
                    }
                }
                awesomeUsers.insert(friendObj);
            }
        }
    }


});
Template.list.helpers({
    awesomeList: function() {
        return awesomeUsers.find().fetch();
    }
});
