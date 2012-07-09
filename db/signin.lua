local email = ARGV[1];
local password = ARGV[2];

local userInfoId = "users:"..email;

if(redis.call("exists", userInfoId) == 1) then

    local userInfo = redis.call("HMGET", userInfoId, "Email", "Login", "Password");
    local pass = userInfo[3];

    if(pass == password) then
        local sessionId = redis.sha1hex(email..password);
        redis.call("SETEX", "sessions_to_users:"..sessionId, email,  1 * 60 * 60);
        return cjson.encode({Email = email, Login = userInfo[2], SessionId = sessionId});
    end

    return false;
end

return false;