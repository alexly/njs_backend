$(document).ready(function() {
    App.Mgr = Ember.StateManager.create({
        initialState: function() {
            return App.Cookies.Has(Cookies.FuguSessionIdKey) ? "SignedIn" : "SignIn";
        }.property()

        ,

        states: {
                SignIn: App.AuthState.create(),
                SignedIn: App.PagesState  
            }
    });

    App.SessionController.Connect(); 
    
});

function ShowMessage(message) {
    var el = $("#message");
    el.html(message);
    el.show("blind", {}, 500);
}

Ember.Handlebars.registerHelper('echo', function(propertyName, options) {
    return propertyName;//Ember.getPath(options.contexts[0], propertyName);
});