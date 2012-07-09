local sessionId = ARGV[1];

local email = redis.call("get", "sessions_to_emails:"..sessionId);
if(email) then
    local userInfo = redis.call("HMGET", "users:"..email, "Login");
    return cjson.encode({Email = email, Login = userInfo[2], SessionId = sessionId});
end