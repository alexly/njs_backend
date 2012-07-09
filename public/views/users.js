
$(document).ready(function() {

    try {
      
        //var users_template = Handlebars.compile($('#users_list').html());
        
        //Ember.TEMPLATES['users_list'] = Ember.Handlebars.compile('users_list');

        App.UsersTab = Em.View.extend({   
            //trmplateName: "users_list", //Ember.Handlebars.compile('users_list'),
            template : Handlebars.compile($('#users_list').html()),
            didInsertElement: function() {
                var self = this;
                console.log('App.UsersTab.didInsertElement');
            }
        });


        App.UsersTabState =  Em.ViewState.extend({
            viewClass: App.UsersTab.create({})
        });


        //var states = App.Mgr.get('states');
        //console.log(states);
        //states['PageUsers'] = App.UsersTabState.extend();

    //states.push({PageUsers:App.UsersTabState.create()});


        Ember.setPath(App.Mgr, 'states.PageUsers', App.UsersTabState.create({
            /*
            enter: function() {
                this._super();
                console.log('hello dynamic world');
            }
            */
        }));
            
       console.log("App.Mgr.goToState('PageUsers')");
       //alert();
       
       //App.Mgr.goToState("PageUsers");
    }
    catch(e) {
        consile.log(e);
    }

    
      
     
    //
});


