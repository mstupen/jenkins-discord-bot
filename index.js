// Import modules
var restify = require('restify');
var discord = require('discord.js');

// Discord bot
var bot    = new discord.Client({autoReconnect:true});
var token  = "";
var secret = "";

// Create and configure server
var server = restify.createServer({name: 'Discord Jenkins Notify'});

server.pre(restify.CORS());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Start server and Discord bot
server.listen(8082, function()
{
    console.log('%s listening at %s', server.name, server.url);
    
    // Login
    bot.login(token)
    .then(console.log('Bot Logged in.'))
    .catch(
        error => console.log(error)
    );
});

// General endpoint for browsers
server.get('/', function (req, res, next)
{
    res.send("This address is not meant to be accessed by a web browser.")
})

// Endpoint for the Jenkins Notification plugin
server.post('/jenkins', function (req, res, next)
{
    try
    {
        var job       = req.body.name;
        var build     = req.body.build.number;
        var reqsecret = req.query.secret;

        // Set build status
        if (req.body.build.status == "SUCCESS")
        {
            var status = "passed";
        }
        else
        {
            var status = "failed";
        } 
    }
    catch (err) {
        console.log(err);
    }

    // Check secret
    if (secret != reqsecret)
    {
        res.send(403, "Unauthorized");
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

    res.send("message delivered");
});