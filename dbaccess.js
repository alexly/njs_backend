var crypto      = require("crypto");
var fs          = require("fs");
var redis       = require("redis");
var redisDb     = redis.createClient();
var LuaScripts  = [];

LuaScript = function (script) {
    // Source of the lua script
    this.Source = script
    //sha1 hash of the script
    this.Hash = crypto.createHash('sha1').update(script).digest("hex");
}

function LoadScripts() {
    var files = fs.readdirSync("./db/redis");
    for(var i =0; i< files.length;i++) {
        var script = fs.readFileSync("./db/redis/" + files[i]).toString();
        LuaScripts[i] = script;
    }   
}

redisDb.EvalSmart = function(script, keys, values, callback) {
    
    var compiliedScript     = (typeof(script)== "object");
    var sha1                = compiliedScript ? 
                                script.Hash : crypto.createHash('sha1').update(script).digest("hex");
    var self                = this;
    
    self.evalsha(sha1, keys, values, function (err, reply) {
        
        console.log(err);
        
        if (err) {// && err.Error.matches("(?i).*NOSCRIPT.*")) {
            
            self.eval(compiliedScript ?  script.Source : script, 
                        keys, values, callback);
        }
        else 
            if(callback) callback(err, reply);
    });
}

redisDb.on("connect", function(err) {
    console.log("node.js connected to redis server 127.0.0.1:6379");
    
    for(var i =0; i< LuaScripts.length;i++) {
        this.eval(LuaScripts[i], [], 0, [], function(err, reply) {
            if(err) console.log("Error during loading common scripts: " + err);
        });
    }
});

redisDb.on("close", function(err) {
    console.log("node.js disconnected from redis server 127.0.0.1:6379");
});

redisDb.on("error", function(err) {
    console.log("redis error occurred: " + err);
});

exports.RedisMaster = function() {
    return redisDb;
}

exports.RedisSlave = function() {
    return redisDb;
}

LoadScripts();