var db          = require("./dbaccess");
var UserSession = require("./wsusersession");
var utils       = require("./utils");

// Returns from google 
/*
var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;

var SignIn                  = new LuaScript("return SignIn(ARGV[1], ARGV[2]);");


UserSession.prototype.DoSignIn = function(userInfo, callback) {
passport.use(new OpenIDStrategy({
    returnURL: 'http://localhost/index.html',
    realm: 'https://www.google.com/accounts/IssuedAuthSubTokens'
  },
  
  function(identifier, done) {
      console.log("OpenIDStrategy:", identifier);
    //User.findOrCreate({ openId: identifier }, function (err, user) {
      //done(err, user);
    //});
  }
));
}
*/

UserSession.prototype.DoSignIn = function(userInfo, callback) {
     if(this.IsSignedIn()) {
            this.Session.Send(Events.SignIn, self.userInfo);
            callback(this);
     }
     else {
        var self = this;
        if(this.socket && userInfo && userInfo.Email && userInfo.Pwd) {
            db.RedisMaster().EvalSmart(SignIn, [], [userInfo.Email, userInfo.Pwd], function (err, userInfoWithSessionId) {
                
                if(err || !userInfoWithSessionId) {
                    console.log("SignIn error:", err, " ", userInfoWithSessionId);
                    self.SendError(Events.SignIn , Errors.WrongSingInData);
                    callback({ErrorCode: Errors.WrongRegData});
                }
                else {
                    console.log("SignIn reason:", userInfoWithSessionId);
                    self.userInfo = JSON.parse(userInfoWithSessionId);
                    self.Send(Events.SignIn, self.userInfo);
                    callback({});
                }
            });
        }
        else {
            this.SendError(Events.SignIn, Errors.WrongSingInData);
        }   
     }
}

UserSession.prototype.SignOut = function() {
}
