var mockSignalRHub = function () {

    this.mockHub = {};

    var chat = {};

    //definitions
    this.mockHub.connection = {};
    this.mockHub.connection.hub = {};


    chat.server = {};
    chat.client = {};

    //data
    var users = [{ name: 'user1' }, { name: 'user2' }];

    this.mockHub.connection.hub.start = function () {
        return {
            done: function (callback) {
                callback();
            }
        };
    };


    this.mockHub.connection.chatHub = chat;



    chat.server.newClient = function () {


        chat.client.allUsers(users);
    };


    chat.server.registerUser = function (userName) {
        var user = { name: userName };
        var logMsg = "User '" + userName + "' added";
        var duplicate = false;

        for (var i = 0; i < users.length; i++) {
            if (users[i].name == userName) {
                logMsg = "User '" + userName + "' already exists";
                duplicate = true;
                break;
            };
        };

        if (!duplicate) {
            chat.client.userRegistered(user);
            chat.client.newUser(user);
            chat.client.chatMessage("SYSTEM", "User '" + userName + "' has joined the chat");

        }

        chat.client.logMessage(logMsg);

    };


    chat.server.send = function (name, message) {
        chat.client.chatMessage(name, message);
    };

    chat.server.logOut = function (userName) {
        var index = -1;
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == userName) {
               
                index = i;
                break;
            };
        };

        if (index>=0) {
            users.splice(index, 1);

            chat.client.allUsers(users);

            chat.client.logMessage("User '" + userName + "' has been removed");
            chat.client.chatMessage("SYSTEM", "User '"+userName+"' has left");
        }

    };

    return this.mockHub;
}


////var mockSignalRHub = (function () {

////    var mockHub = {};

////    var chat = {};

////    //definitions
////    mockHub.connection = {};
////    mockHub.connection.hub = {};


////    chat.server = {};
////    chat.client = {};

////   //data
////    var users = [{ name: 'user1' }, { name: 'user2' }];

////    mockHub.connection.hub.start = function () {
////        return {
////            done: function (callback) {
////                callback();
////            }
////        };
////    };


////    mockHub.connection.chatHub = chat;



////    chat.server.newClient = function () {


////        chat.client.allUsers(users);
////    };


////    chat.server.registerUser = function (userName) {
////        var user = { name: userName };

////        chat.client.userRegistered(user);
////        chat.client.newUser(user);
////        chat.client.chatMessage("SYSTEM", "User 'foo1' has joined the chat");
////        chat.client.logMessage("User 'foo1' added");
////    };



////}());