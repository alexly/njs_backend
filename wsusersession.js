var utils   = require("./utils");
var db      = require("./dbaccess");
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var everyauth = require('http');
var oauthSecrets = JSON.parse(fs.readFileSync('./secrets.json', 'utf-8'));
var Oauth2 = require('./oauth2.js');

var GetUserInfoBySessionId  = new LuaScript("return GetUserInfoBySessionId(ARGV[1]);");
var sessionCreated = null;

module.exports = function UserSession(socket) {
    this.socket = socket;
    this.eventsMap = {};
}

module.exports.OnNewSession = function(callback) {
    sessionCreated = callback;
}


module.exports.prototype.IsSignedIn = function() {
    return this.userInfo != null;
}

module.exports.prototype.Send = function(event, data) {
    data.Event = event;
    this.socket.send(JSON.stringify(data));
}


module.exports.prototype.Close = function() {    
    //this.socket.server.close();
}

module.exports.prototype.SendError = function(event, errorCode) {
    this.socket.send(JSON.stringify({Event : event, ErrorCode:errorCode }));
}

module.exports.prototype.OnEvent = function(type, callback) {
    if(!this.eventsMap[type]) {
        this.eventsMap[type] = callback;
    }
    
    else throw Error(type, " callbalk already exsists");
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

var server = http.createServer(function(req, res) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});

server.listen(8001, function(e) { 
    
});

var authServer = http.createServer(function(req, res) {
    if(req.path == "/auth/google") {
        var client_id = '582833444971.apps.googleusercontent.com';
        var provider = 'google';
        var redirect_uri = 'http://127.0.0.1:3000/auth/google/callback';

        res.redirect(
            'https://accounts.google.com/o/oauth2/auth?client_id=' + client_id + '&redirect_uri=' + redirect_uri + 
            '&scope=https://www.google.com/m8/feeds/&response_type=code');
    }
});

authServer.listen(7999, function(e) { });


// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin);
    console.log("request: ", request.cookies);
    var session = new module.exports(connection);
    
    //console.log("wsServer.on('request'): ", request);
    //console.log("wsServer connection: ", connection);
    
    sessionCreated(session);
    
    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        
        try {
            
            if (message.type === 'utf8') {
                // process WebSocket message
                var json = JSON.parse(message.utf8Data);
                console.log("message: ", json);
    
                if(json.Event) { // Event type
                    
                    var callback = session.eventsMap[json.Event];
                    if(callback){
                        console.log("Event: ", json.Event);
                        callback(json);
                        
                    }
                        //callback(json); //json.ErrorCode || json.Data
                }
            }

        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', e);
            return;
        }
                

        
        //console.log("wsServer.on('message'): ", message);
        //session.Send("Test", JSON.stringify({ErrorCode:0}));
    });

    connection.on('close', function(connection) {
        console.log("wsServer.on('close'): close user connection");
    });
});


/*
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
*/