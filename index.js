// Import modules
var restify = require('restify');
var discord = require('discord.js');

// Create server
var server = restify.createServer({
    name: 'Discord Jenkins Notify'
});

// Configure restify
restify.CORS.ALLOW_HEADERS.push('authorization');
server.pre(restify.CORS());
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Discord bot
var bot = new discord.Client({autoReconnect:true});
bot.login("token");

server.post('/', function (req, res, err)
{
    console.log(req.body);
    var job    = req.body.name;
    var build  = req.body.build.number;

    if (req.body.build.status == "SUCCESS")
    {
        var status = "passed";
    }
    else
    {
        var status = "failed";
    }
    
    // Get all channels where 
    var channels = bot.channels;
    
    channels.forEach(function (channel, id)
    {
        if (channel.type == "text" && channel.name == "general")
        {
            channel.sendMessage("The build " + job + "#" + build + " " + status);
        }
    })

    next();
});

// Start server and listen to port 8082
server.listen(8082, function() {
  console.log('%s listening at %s', server.name, server.url);
});
