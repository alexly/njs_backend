--[[
    sessions_to_emails: mapping sessions to user emails
    login_to_emails: mapping logins to user emails
    users:email hash contains user info
    
]]--

function GetUserInfoBySessionId(sessionId)
    local email = redis.call("get", "sessions_to_emails:"..sessionId);
    if(email) then
        local userInfo = redis.call("HMGET", "users:"..email, "Login");
        return cjson.encode({Email = email, Login = userInfo[2], SessionId = sessionId});
    end

    return false;
end

function SignIn(email, password)
    local userInfoId = "users:"..email;

    if(redis.call("exists", userInfoId) == 1) then

        local userInfo = redis.call("HMGET", userInfoId, "Email", "Login", "Password");
        local pass = userInfo[3];

        if(pass == password) then
            local sessionId = redis.sha1hex(email..password);
            redis.call("SETEX", "sessions_to_users:"..sessionId, email, 1 * 60 * 60);
            return cjson.encode({Email = email, Login = userInfo[2], SessionId = sessionId});
        end

        return false;
    end

    return false;
end

function RegisterUser(email, login, password)
    local userInfoKey = "users:"..email;
    local loginKey = "login_to_emails:"..login;

    if(redis.call("exists", userInfoKey) == 1) then
        return 0x4;--emai already exists
    end

    if(redis.call("exists", loginKey) == 1) then
        return 0x5;--login already exists
    end

    redis.call("HMSET", "users:"..email, "Email", email, "Login", login, "Password", password);
    redis.call("set", loginKey, email);

    return 0;
end