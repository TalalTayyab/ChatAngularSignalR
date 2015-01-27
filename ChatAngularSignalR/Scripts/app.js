/// <reference path="angular.js" />


(function () {


    var app = angular.module('chatApp', ['luegg.directives']);
    app.value('$', $);

    //when the window unloads - send a logout click event
    window.onbeforeunload = function () {
        $("#btnLogOut").click();
    };


    app.controller("chatCtrl", function ($, $scope) {

        $scope.name = null;
        $scope.text = null;

        //chat messages
        $scope.messages = [];

        //log messages
        $scope.logMessages = [];

        //registered users
        $scope.users = [];

        //set to true if user has been registered
        $scope.isUserRegistered = false;


        //get the  hub
        var chat = $.connection.chatHub;


        //init at the end - so tests can run properly - the chat object has definition of the functions.



        //recieve a chat message
        chat.client.chatMessage = function (name, text) {

            $scope.$apply(function () {

                $scope.messages.push({ name: name, text: text });

            });

        };

        //recieve message - to get details of all users
        chat.client.allUsers = function (users) {

            $scope.$apply(function () {
                if (users !== null || users.length >= 0) {
                    $scope.users = users;
                }
                else {
                    $scope.users = [];

                };


            });
        };

        //recieve - new user is registered.
        chat.client.newUser = function (user) {
            $scope.$apply(function () {
                $scope.users.push(user);
            });
        };

        //recieve - log message
        chat.client.logMessage = function (msg) {

            $scope.$apply(function () {

                //before adding new message, see if its a duplicate
                var newMessage = true;
                angular.forEach($scope.logMessages, function (item) {
                    //if message found, increment the count
                    if (item.msg === msg) {
                        item.count++;
                        newMessage = false;
                    };
                });

                //if new message add it
                if (newMessage) {
                    $scope.logMessages.push({ msg: msg, count: 1 });
                }


            });

        };


        //recieve message - user has been registered.
        chat.client.userRegistered = function (user) {

            $scope.$apply(function () {
                $scope.isUserRegistered = true;
            });
        };



        //send message to server.
        $scope.sendMessage = function () {
            chat.server.send($scope.name, $scope.text);
            $scope.text = "";
        };

        //send message -register a new user
        $scope.registerUser = function () {
            chat.server.registerUser($scope.name);
        }

        //send message - logout
        $scope.logOut = function () {
            chat.server.logOut($scope.name);

            $scope.isUserRegistered = false;
            //refresh users list from the server
            chat.server.newClient();
        }



        
        //start the connection
        $.connection.hub.start().done(function () {
            chat.server.newClient();
        });




    });//controller



    //register a directive

    app.directive('validUserName', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attr, ngModel) {
                function isValid(value) {

                    var isValid = true;

                    value = value || "";
                    value = value.trim();

                    var re = /^[a-z0-9]+$/i;
                    isValid = re.test(value);
                    return isValid;
                }
                //value changed
                ngModel.$parsers.unshift(function (value) {
                    ngModel.$setValidity('validUserName', isValid(value));
                    return value;
                });
                //initial load
                ngModel.$formatters.unshift(function (value) {
                    ngModel.$setValidity('validUserName', isValid(value));
                    return value;
                });
            }
        }
    });






}());