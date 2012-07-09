require("./public/consts");
var utils = require("./utils");
var UserSession = require("./wsusersession.js");
require("./authorization");
require("./registration");

UserSession.OnNewSession(function(s) {
   console.log("New session ");
   
   var session = s;
   
   session.OnEvent(Events.SignIn, function(userInfo) {

            //console.log("session: ", session);
            //if(session.DoSignIn) {
                console.log("OnEvent SignIn: ", userInfo);
                session.DoSignIn(userInfo, function(reason) {
                    //console.log("SignIn check reason: ", reason);
                });
                /*
            }
            else {
                console.log("SignIn guest: ");
                session.userInfo = {Email:"", Guest:true, Login:"guest"};
                session.Send(Events.SignIn, session.userInfo);                             
            }
            */
   });
    
    session.OnEvent(Events.Disconnect, function(reason) {
        console.log("User session disconnect reason: ", reason);
    });
   
});