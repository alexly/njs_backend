local email = ARGV[1];
local login = ARGV[2];
local password = ARGV[3];

local userInfoKey = "users:"..email;
local loginKey = "login_to_emails:"..login;

if(redis.call("exists", userInfoKey) == 1) then
    return cjson.encode({err="Email: "..email.." already exists"});
end

if(redis.call("exists", loginKey) == 1) then
    return cjson.encode({err="Login: "..login.." already exists"});
end

redis.call("HMSET", "users:"..email, "Email", email, "Login", login, "Password", password);

return true;