App.PagesState = Em.ViewState.create({
   view: Em.View.extend({
        classNames: ['pages'],
        templateName: 'pages_view',

        pages: [
            {Title: "Home", HasPermisions: true, Content: "Home content"},
            {Title: "Login", HasPermisions: true, Content: "Login content"},
            {Title: "Support", HasPermisions: true, Content: "Support content"},
            {Title: "Users", HasPermisions: true, Content: "Users content"}
        ],
        
        didInsertElement: function() {
            this.$().tabs({
                select: this.doPageChanged.Bind(this)
            });
            
            var selectedTab = App.Cookies.Get(Cookies.ActiveTab);

            this.$().tabs('select', 3);
            //App.Mgr.goToState("PageUsers");
            if(selectedTab) {
                this.$().tabs('select', parseInt(selectedTab));
            }
        },

        doPageChanged: function(event, ui) {
            App.Cookies.Set(Cookies.ActiveTab, ui.index);
            
        },
        

        //PageUsers: App.UsersTabState.create()
        
    })
});

/*

 */