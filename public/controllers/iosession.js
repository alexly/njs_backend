// socket.io implementation

App.SessionController = Ember.Object.create({

    socket: null,
    signedIn: false,
    connected:false,
    triesConnections: 0,
    rememberMe:false,
    signInCallback: null,
    registerCallback: null,
    
    Connect: function() {
        if(this.socket == null) {
            this.socket = io.connect("http://localhost:90");
            
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
        this.socket.emit(Events.SignIn, userInfo);
    },

    RegsiterUser: function(userInfo, callback) {
        this.Connect();
        this.registerCallback = callback;
        this.socket.emit(Events.RegisterUser, userInfo);
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
