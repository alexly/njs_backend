var db          = require("./dbaccess");
var UserSession = require("./usersession");

var RegisterUser      = new LuaScript("return RegisterUser(ARGV[1], ARGV[2], ARGV[3]);");

UserSession.prototype.RegisterUser = function(userInfo, callback) {
    var self = this;
    console.log(this.socket);
    console.log(userInfo.Email);
    console.log(userInfo.Pwd);
    console.log(userInfo.RepeatPwd);
    console.log(userInfo.Login);
    if(this.socket && userInfo && userInfo.Email 
        && userInfo.Pwd && userInfo.RepeatPwd && userInfo.Login) {
     
        if(userInfo.Pwd != userInfo.RepeatPwd) {
            this.SendError(Events.RegisterUser, Errors.PasswordsNotEqual);
            callback({ErrorCode:Errors.PasswordsNotEqual});
            return;
        }
        
        db.RedisMaster().EvalSmart(RegisterUser, [], [userInfo.Email, userInfo.Login, userInfo.RepeatPwd], function (err, reply) {
            if(err) {
                    console.log("RegisterUser error: ", err);
                    self.SendError(Events.RegisterUser, Errors.Internal);
                    callback(error);
                }
                else {
                    console.log("RegisterUser success: ", reply);
                    self.Send(Events.RegisterUser, {ErrorCode:reply});
                    callback(reply);
                }
        });
        return;
    }
    
    this.SendError(Events.RegisterUser, Errors.WrongSingInData);
    callback({ErrorCode:Errors.WrongSingInData});
}