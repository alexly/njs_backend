App.AuthState = Ember.ViewState.extend({
    view: App.DialogView.create({
        templateName: "auth_view",
        SignInTitle: "SignIn",
        RegistrationTitle: "Registration",
        FogotPassTitle: "Fogot password",
        
        didInsertElement: function() {
            this.$().tabs({
                selected:0,
                select: this.doTabChanged.Bind(this)
            });
            
            this._super();
            this.setupSignIn();
            this.$().siblings('div.ui-dialog-titlebar').remove();
        },
        
        doTabChanged: function(event, ui) {
            switch(ui.tab.hash){
                case "#singIn":this.setupSignIn();break;
                case "#fogotpass":this.setupFogotPassword();break;    
                case "#registration":this.setupRegistration();break;
            }
        },
        
        setupSignIn :function() {
            var self = this;
            this.$().dialog({
                buttons: {
                    "Guest": function() {
                        App.Mgr.goToState("PageUsers");
                        //App.Mgr.goToState("SignedIn");
                    },
                    "SignIn":    function() {                    
                        App.Mgr.send("doSignIn", 
                            {Email: this.get('email'), 
                                Pwd: this.get('password'), 
                                RememberMe: this.get('rememberMe') 
                            });
                    }.Bind(this)
                }
            });
        },
        
        setupFogotPassword :function() {
            var self = this;
            this.$().dialog({
                buttons: {
                    "Fogot": function() {                    

                    }
                }
            });
        },

        setupRegistration :function() {
            this.$().dialog({
                buttons: {
                    "Registration": function() {                    
                        App.Mgr.send("doRegister", 
                            {Email: this.get('email'), 
                                Login: this.get('login'), 
                                Pwd: this.get('password'),
                                RepeatPwd: this.get('repeat_password')
                            })
                    }.Bind(this)
                }
            }); 
        }
    }),

    doSignIn: function(sm, userInfo) {
        if(!App.SessionController.IsConnected()) {
            alert("Connection is lost!");
            return;
        }
        
        //$.blockUI({ message: null, baseZ: 2000 });
        
        App.SessionController.SignIn(userInfo, function(reason) {
            if(reason && reason.Error)
                ShowMessage("<p>" + reason.Error + "<p/>");    
            else {
                //App.Mgr.goToState("SignedIn");
                App.Mgr.goToState("SignedIn");
            }
                //$.unblockUI();
        });
    },
   
    doRegister: function(sm, userInfo) {
        if(!App.SessionController.IsConnected()) {
            alert("Connection is lost!");
            return;
        }
        
        //$.blockUI({ message: null, baseZ: 2000 });
        
        App.SessionController.RegsiterUser(userInfo, function(reason) {
            //if(reason)
                ShowMessage("<p>" + reason.toString() + "<p/>");
            
            //$.unblockUI();
        });
    }
});
