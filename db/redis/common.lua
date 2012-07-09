function GetTabs()
    tabs = 
    { 
        {index=1, title="home", content="home content"},
        {index=2, title="play", content="play content"},
        {index=3, title="login", content="login content"}
    }

    json_text = cjson.encode(tabs);
    return json_text;
end

function GetUsers(email)
    local userInfo = redis.call("HMGET", userInfoId, "Email", "Login", "Password");
    return cjson.encode({Email = email, Login = userInfo[2], SessionId = sessionId});

    json_text = cjson.encode(tabs);
    return json_text;
end