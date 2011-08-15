var express = require('express');

function initSessionStore() {
    var RedisStore = require('connect-redis')(express);
    var env = require('env');
    return env.isCloud
            ? new RedisStore({
        host : env.redisHost,
        port : env.redisPort,
        db : 'connect-redis',
        pass : env.redisPassword
    }) : new RedisStore;
}

var server = express.createServer();

server.configure(function() {
    server.use(express.logger());
    server.use(express.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({store : initSessionStore(), secret:"keyboard cat"}));
    server.use(require('acl').aclMiddleWare('/index.html', '/acl/login.go', '/favicon.ico'));
    server.use(server.router);
    server.use(express.static(__dirname));
});

server.configure('development', function() {
    server.use(express.errorHandler({showStack:true, dumpExceptions:true}));
});

server.configure('production', function() {
    server.use(express.errorHandler());
});

var dispatcher = require('./dispatcher');
dispatcher.mapUrl(server);


var port = (process.env.VCAP_APP_PORT || 80);
server.listen(port);

require('./init')(function(){
    require('douban').startJob();
});
