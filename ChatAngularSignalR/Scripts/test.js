/// <reference path="angular.js" />
/// <reference path="jasmine-2.1.3/jasmine.js" />
/// <reference path="angular-mocks.js" />


describe("chatApp", function () {


    beforeEach(module('chatApp'));

    var ctrlFactory;

    beforeEach(inject(function ($controller) {
        ctrlFactory = $controller;
    }));


    describe("creates chatCtrl", function () {

        var mockHub, ctrl, mockScope;

        beforeEach(function () {

            mockScope = {};
            mockHub = new mockSignalRHub();

            mockScope.$apply = function (callback) {
                callback();
            }

            ctrl = ctrlFactory("chatCtrl", { $: mockHub, $scope: mockScope });
        });

        it('user length should be 2', function () {


            expect(mockScope.users.length).toBe(2);
           

        });//it

        it("last user should be user1", function () {
            expect(mockScope.users[0].name).toBe('user1');
        });

        describe("register a user foo1", function () {

            beforeEach(function () {
                //Arrange
                mockScope.name = 'foo1';


                //Act
                mockScope.registerUser();
            });

           
            //Assert
            it("user registered true", function () {
                expect(mockScope.isUserRegistered).toBe(true);
            });

            it("user length = 3", function () {
                expect(mockScope.users.length).toBe(3);
            });

            it("last user should be foo", function () {
                expect(mockScope.users[2]).toEqual({ name: 'foo1' });
            });

            it("chat message should be 1", function () {
                expect(mockScope.messages.length).toBe(1);
            });

            it("chat message should announce user foo1 has joined", function () {
                expect(mockScope.messages[0]).toEqual({ name: 'SYSTEM', text: "User 'foo1' has joined the chat" });
            });

            it("log messages length to be 1", function () {
                expect(mockScope.logMessages.length).toBe(1);
            });

            it("log message to say user foo1 has been added", function () {
                expect(mockScope.logMessages[0]).toEqual({ msg: "User 'foo1' added", count: 1 });
            });

            describe("register a duplicate user foo1", function () {

                beforeEach(function () {
                    mockScope.name = "foo1";
                    mockScope.registerUser();
                });

               

                it("user registered true", function () {
                    expect(mockScope.isUserRegistered).toBe(true);
                });

                it("user length = 3", function () {
                    expect(mockScope.users.length).toBe(3);
                });

                it("last user should be foo", function () {
                    expect(mockScope.users[2]).toEqual({ name: 'foo1' });
                });

                it("chat message should be 1", function () {
                    expect(mockScope.messages.length).toBe(1);
                });

                it("chat message should announce user foo1 has joined", function () {
                    expect(mockScope.messages[0]).toEqual({ name: 'SYSTEM', text: "User 'foo1' has joined the chat" });
                });

                it("log messages length to be 2", function () {
                    expect(mockScope.logMessages.length).toBe(2);
                });

                it("log message to say user foo1 already exists", function () {
                    expect(mockScope.logMessages[1]).toEqual({ msg: "User 'foo1' already exists", count: 1 });
                });


            });
         

            describe("user log out", function () {

                beforeEach(function () {
                    mockScope.logOut();
                });

                it("user lenght = 2", function () {
                    expect(mockScope.users.length).toBe(2);
                });

                it("chat message should be 2", function () {
                    expect(mockScope.messages.length).toBe(2);
                });

                it("chat message should announce user foo1 has left", function () {
                    expect(mockScope.messages[1]).toEqual({ name: 'SYSTEM', text: "User 'foo1' has left" });
                });

                it("log messages length to be 2", function () {
                    expect(mockScope.logMessages.length).toBe(2);
                });

                it("log message to say user foo1 has been removed", function () {
                    expect(mockScope.logMessages[1]).toEqual({ msg: "User 'foo1' has been removed", count: 1 });
                });
            });


        });



       


       


        describe("Test sending two chat message", function () {


            beforeEach(function () {
                //Arrange & Act
                mockScope.name = 'foo1';
                mockScope.registerUser();

                mockScope.name = 'foo2';
                mockScope.registerUser();
            });


            it("user length should be 4", function () {
                expect(mockScope.users.length).toBe(4);


            });

            it("user foo1 should exist", function () {
                expect(mockScope.users[2]).toEqual({ name: 'foo1' });
            });

            it("user foo2 should exist", function () {
                expect(mockScope.users[3]).toEqual({ name: 'foo2' });
            });

            describe("send message from foo1 - Hello there all", function () {

                beforeEach(function () {
                    mockScope.name = "foo1";
                    mockScope.text = "Hello there all";
                    mockScope.sendMessage();
                });
                

                it("message length to be 3", function () {
                    expect(mockScope.messages.length).toBe(3);
                   
                });

                it("last message should be Hello there all", function () {
                    expect(mockScope.messages[2]).toEqual({ name: "foo1", text: "Hello there all" });
                });
            });

        });


    });//chatctrl


});//chatapp