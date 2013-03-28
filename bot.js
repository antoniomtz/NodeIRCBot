var config = {
	channels: ["#testingantonio"],
	server: "irc.freenode.net",
	botName: "lolB0t",
	owner: "antoniomtz"
};


// Get the lib
var irc = require("irc");

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
	channels: config.channels,
	port: 8001
});

// Listen for joins
bot.addListener("join", function(channel, who) {
	// Welcome them in!
	bot.say(channel, who + "...dude...welcome back!");
});

bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!say hello')> -1 && from == config.owner)  {
        bot.say(config.channels[0], 'Hello my owner Antonio!. How can I help you?');
    }
});
// Listen for any message, say to him/her in the room
//bot.addListener("message", function(from, to, text, message) {
//	bot.say(config.channels[0], "¿Public que?");
//});