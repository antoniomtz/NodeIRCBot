 NodeIRCBot
==========

Node.js IRC BOT ready to work with openshift.

##Setting up Openshift.com

Go to your application panel and create a Node.js app. Then clone your app to your local and install
the irc module
	
	$ npm install irc -S


##Configuration

### Modify the server.js file

Modify the variables. 

	var ircConfig = {
	channels: ["#yourchannel"],
	server: "irc.freenode.net",
	botName: "BotNickHere",	
	};
	
###Pushing changes to openshift

	$ git add *
	$ git commit -am 'First changes'
	$ git push 
	
##Commands

After pushing your changes, your bot will be online in a couple minutes.

### Authentication
The first thing you need to do is to authenticate with the bot as the owner. Just type 'lolpass' to your bot as a private message.

### Welcome messages
The bot will say a welcome message to new users joining the channel.

### Greeting
Simple greeting

	!say hello	

### Op & Deop
Op and Deop usage. (Bot must have op)

	!op <nick>
	!deop <nick>

### Topic
Set a new topic to the channel (Bot must be op)

	!topic <new Topic>
	
Of course this is just a simple bot. The purpose is to give you an idea how to implement and improve it.

## Source

- https://www.openshift.com/blogs/building-social-irc-bots-with-nodejs-part-1
	
##Contact

Jose Antonio Martinez
	
- http://www.jantoniomartinez.org
- http://twitter.com/antoniomtz

##License

[MIT](http://opensource.org/licenses/MIT) license.



	
	



	

