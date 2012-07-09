// socket.io user session
var utils   = require("./utils");
var db      = require("./dbaccess");
var io = require('socket.io').listen(8001);

var GetUserInfoBySessionId  = new LuaScript("return GetUserInfoBySessionId(ARGV[1]);");
var sessionCreated = null;

module.exports = function UserSession(userInfo, socket) {
    this.userInfo = userInfo;
    this.socket = socket;
}

module.exports.prototype.AssignSocket = function(socket) {
    this.socket = socket;
}

module.exports.prototype.IsSignedIn = function() {
    return this.userInfo != null;
}

module.exports.prototype.Send = function(event, data) {    
    this.socket.emit(event, data);
}


module.exports.prototype.Close = function() {    
    this.socket.server.close();
}

module.exports.prototype.SendError = function(event, errorCode) {
    this.socket.emit(event, {ErrorCode:errorCode });
}

module.exports.prototype.OnEvent = function(type, callback) {
    if(this.socket) {
        this.socket.on(type, callback);
    }
}

module.exports.OnNewSession = function(callback) {
    sessionCreated = callback;
}

function GetUserInfoBySessionId(sessionId, callback) {
    db.RedisMaster().EvalSmart(GetUserInfoBySessionId, [], [sessionId], function (err, session) {
        if(err) {
            console.error("GetSessionById error: ", err);
            callback(null);
        }
        else {
            console.error("GetSessionById session: ", session);
            callback(session);
        }
    });        
}

io.set(Events.Authorization, function (handshake, accept) {
    var sessionId = utils.ParseCookies(handshake.headers.cookie).FuguSessionID;
    var self = this;
    if(sessionId) {    
        GetUserInfoBySessionId(sessionId, function(userInfo) {
            if(userInfo) {
                
                handshake.Session = new UserSession(userInfo, null);
                if(sessionCreated) {
                    sessionCreated(handshake.Session);
                }
            }
            
            return accept(null, true);
        });
    }
    else return accept(null, true);//accept(new Error('no cookie sent'));
});

io.sockets.on(Events.Connection, function (socket) {
    console.log('A socket with ID ' , socket.id , ' connected!');
    
    var sock = socket;
    var session = null;
    
    if(sock.handshake.Session) {
        sock.handshake.Session.AssignSocket(socket);
    }
    else {
        sock.handshake.Session = new module.exports(null, socket);
    }

    session = sock.handshake.Session;

    if(sessionCreated) {
        sessionCreated(session);
    }
           
   

});
