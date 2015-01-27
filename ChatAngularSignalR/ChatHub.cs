using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;

namespace ChatAngularSignalR
{
    /// <summary>
    /// Simple chatHub. Communication happens like this
    /// 1. client => NewClient, server => SendAllUsers
    /// 2. client => registerUser, server => UserRegistered, NewUser, Send,SendLogMessage
    /// 3. client => send, server=> chatMessage
    /// 4. client => logOut, server =>SendAllUsers,SendLogMessage,Send
    /// </summary>
    public class ChatHub : Hub
    {
        readonly string SYSTEM_USERNAME = "system";

        public class User
        {
            public string name { get; set; }
        }

        static Object lockObj = new object();

        static private List<User> _users = new List<User>();

        public static List<User> Users
        {
            get
            {

                return _users;
            }

        }


        /// <summary>
        /// Send - chat message
        /// </summary>
        /// <param name="name"></param>
        /// <param name="message"></param>
        public void Send(string name, string message)
        {
            this.Clients.All.chatMessage(name, message);
        }

        /// <summary>
        /// Recieve - register user message
        /// </summary>
        /// <param name="userName"></param>
        public void RegisterUser(string userName)
        {
            string msg = string.Empty;
            bool exists = false;

            User newUser = new User()
            {
                name = userName
            };

            lock (lockObj)
            {
                exists = Users.Exists(x => x.name.Equals(newUser.name, StringComparison.InvariantCultureIgnoreCase));

                //user does not exist, add it before we exit the lock condition
                if (!exists)
                {
                    Users.Add(newUser);
                }
            }//lock


            if (!exists)
            {
                //Send user registered to caller
                UserRegistered(newUser);
                //Tell all clients new user has been added
                NewUser(newUser);
                //Send as  a chat message
                Send(SYSTEM_USERNAME, string.Format("User '{0}' has joined the chat", newUser.name));
                msg = string.Format("User '{0}' added", newUser.name);
            }
            else
            {
                msg = string.Format("User '{0}' already exists", newUser.name);
            }

            //send log message only to the caller
            SendLogMessage(msg);
        }


        // Send - new user message, sent to all clients
        public void NewUser(User u)
        {
            this.Clients.All.newUser(u);
        }


        //Send - when user is succcessfully registered - sent only to the client that requested registeration.
        public void UserRegistered(User u)
        {
            this.Clients.Caller.userRegistered(u);
        }

        /// <summary>
        /// Send - log message
        /// </summary>
        /// <param name="msg"></param>
        public void SendLogMessage(string msg, bool broadcast = false)
        {
            if (broadcast)
            {
                this.Clients.All.logMessage(msg);
            }
            else
            {
                this.Clients.Caller.logMessage(msg);
            }

        }



        /// <summary>
        /// Recieve - new client
        /// </summary>
        public void NewClient()
        {

            SendAllUsers();

        }

        public void LogOut(string name)
        {
            bool exists = false;


            lock (lockObj)
            {
                var user = Users.Where(x => x.name.Equals(name, StringComparison.InvariantCultureIgnoreCase)).FirstOrDefault();

                exists = user != null;

                //user exists, so we should remove it from the collection
                if (exists)
                {
                    Users.Remove(user);
                }

            }//lock

            //if we removed a user, update all the clients
            if (exists)
            {
                SendAllUsers(true);
                SendLogMessage(String.Format("User '{0}' has been removed", name));
                Send(SYSTEM_USERNAME, String.Format("User '{0}' has left", name));
            }

        }

        /// <summary>
        /// Send - all users info
        /// </summary>
        public void SendAllUsers(bool broadcast = false)
        {
            if (broadcast)
            {
                this.Clients.All.allUsers(Users);
            }
            else
            {
                this.Clients.Caller.allUsers(Users);
            }

        }


    }
}