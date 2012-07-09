var App = Em.Application.create();

if (!Function.prototype.Bind) { // check if native implementation available
  Function.prototype.Bind = function() { 
	var fn = this, args = Array.prototype.slice.call(arguments),
	object = args.shift(); 
	return function() { 
		return fn.apply(object, args.concat(Array.prototype.slice.call(arguments))); 
	}; 
  };
}

App.DialogView = Em.View.extend({
    didInsertElement: function() {
        this.$().dialog({
            show: {effect: 'fade', duration: 700},
            dialogClass:    "login_dialog",
            closeOnEscape:  false,
            resizable:      false,
            width:          600,
			modal:          true,
            draggable:      false,
            stack:          false,
            //position:       [350,300]
        });
    },
    
    willDestroyElement: function() {
        this.$().dialog("destroy");
    }
});