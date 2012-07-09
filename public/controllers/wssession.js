// web sockets implementation

window.WebSocket = window.WebSocket || window.MozWebSocket;

App.SessionController = Ember.Object.create({

    socket: null,
    signedIn: false,
    connected:false,
    triesConnections: 0,
    rememberMe:false,
    signInCallback: null,
    registerCallback: null,
    eventsMap: {},
    
    OnEvent: function(type, callback) {
        if(!this.eventsMap[type]) {
            this.eventsMap[type] = callback;
        }
    },
    
    Connect: function() {  
        if(this.socket == null) {
            var socket = new WebSocket('ws://127.0.0.1:8001');
            this.socket = socket;
            
            this.OnEvent(Events.RegisterUser, this.RegisterUserHandler.Bind(this));
            this.OnEvent(Events.SignIn, this.SignInHandler.Bind(this));
            
            socket.onopen = function () {
                console.log("connection is opened and ready to use");
                this.connected = true;
            }.Bind(this);

            socket.onerror = function (error) {
                console.log("an error occurred when sending/receiving data: ", error);
            }.Bind(this);

            socket.close = function (error) {
                console.log("connection is closed:", error);
                this.Connect();
            }.Bind(this);
            
            socket.onmessage = function (message) {
                // try to decode json (I assume that each message from server is json)
                try {
                    var json = JSON.parse(message.data);
                    //console.log("message: ", json);
                    
                    
                    if(json.Event) {
                        var callback = this.eventsMap[json.Event];
                        callback(json); //json.ErrorCode || json.Data
                    }
                    
                    
                } catch (e) {
                    console.log('This doesn\'t look like a valid JSON: ', json);
                    return;
                }
                // handle incoming message
            }.Bind(this);
            /*
            this.socket.on(Events.Connect, function() {
                this.connected = true;
                if(this.triesConnections == 0) {
                    this.socket.on(Events.RegisterUser, this.RegisterUserHandler.Bind(this));
                    this.socket.on(Events.SignIn, this.SignInHandler.Bind(this));   
                }
                this.triesConnections++;
            }.Bind(this));
            
            this.socket.on(Events.Disconnect, function() {
                this.connected = false;
            }.Bind(this));
            */
        }
    },
    
    IsConnected: function() {
        return this.connected;
    },
    
    IsSignedIn: function() {
        return this.signedIn;
    },
    
    SignIn: function(userInfo, callback) {
        this.Connect();
        this.signInCallback = callback;
        this.rememberMe = userInfo.RememberMe;
        userInfo.Event = Events.SignIn;
        this.socket.send(JSON.stringify(userInfo));
    },

    RegsiterUser: function(userInfo, callback) {
        this.Connect();
        this.registerCallback = callback;
        userInfo.Event = Events.RegisterUser;
        this.socket.send(JSON.stringify(userInfo));
    },
    
    SignInHandler: function(reason) {
        if(reason == null || reason.ErrorCode) {
            reason.Error = "Wrong email or password";
            this.signedIn = false;
            
            if(this.signInCallback)
                this.signInCallback(reason); 

            if(App.Mgr.getPath('currentState.name') != "SignIn")
                App.Mgr.goToState("SignIn");
        }
        else {
            this.signedIn = true;

            if(this.signInCallback)
                this.signInCallback(reason);   

            if(this.rememberMe)
                App.Cookies.Set(Cookies.FuguSessionIdKey, reason.SessionId, 3);  
        }
    },
    
    RegisterUserHandler: function(reason) {
        if(this.registerCallback)
            this.registerCallback(reason.ErrorCode);
    }
});
