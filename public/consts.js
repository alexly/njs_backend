if(!this.Cookies) Cookies = {};
//Cookies
Cookies.FuguSessionIdKey            = "FuguSessionId";
Cookies.ActiveTab                   = "FuguActiveTab";

if(!this.Events) Events = {};
// Socket io events
Events.SignIn                       = "signIn";
Events.RegisterUser                 = "registerUser";
Events.Connect                      = "connect";
Events.Connection                   = "connection";
Events.Disconnect                   = "disconnect";
Events.Authorization                = "authorization";

if(!this.Errors) Errors = {};
// Error codes
Errors.WrongSingInData                  = 0x1;
Errors.PasswordsNotEqual                = 0x2;
Errors.WrongRegData                     = 0x3;
Errors.EmailAlreadylExists              = 0x4;
Errors.LoginAlreadylExists              = 0x5;
Errors.Internal                         = 0x6;