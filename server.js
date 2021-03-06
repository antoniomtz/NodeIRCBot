#!/bin/env node
/* IRC bot behavior */
var irc = require('irc');

var ircConfig = {
	channels: ["#lolmvc"],
	server: "irc.freenode.net",
	botName: "lolmvcbot",	
};

var owners = new Array();

//Connection
var bot = new irc.Client(ircConfig.server, ircConfig.botName, {
    channels: ircConfig.channels,
	userName: 'lolmvcbot',
    realName: 'lolmvc Framework',
    port: 8001,
    debug: true
});

//Authenticate by PM
bot.addListener('pm', function (from, message) {
	if(message.indexOf('lolpass') > -1){
		owners.push(from);
		bot.say(from, "You are my owner now");
	}
});

//Op and deop  e.g. !op antoniomtz
bot.addListener('message', function(from, to, message) {
    if(owners.indexOf(from) > -1){
		var rePattern = new RegExp(/(?:!op|!deop) (.*?)$/);		
		arrMatches = message.match(rePattern);
		if(arrMatches!==null){
		
			if( message.indexOf('!op')> -1)  			
				bot.send('MODE', ircConfig.channels[0], '+o', arrMatches[1]);
		
			if( message.indexOf('!deop')> -1)  
				bot.send('MODE', ircConfig.channels[0], '-o', arrMatches[1]);	
		}		
	}
});


//Set topic to channel
bot.addListener('message', function(from, to, message) {
    if(owners.indexOf(from) > -1){
		var rePattern = new RegExp(/!topic (.*?)$/);		
		arrMatches = message.match(rePattern);
		if(arrMatches!==null){		
			if( message.indexOf('!topic')> -1)  			
				bot.send('TOPIC', ircConfig.channels[0], arrMatches[1]);		
		}		
	}
});

//Say hello to owner
bot.addListener('message', function(from, to, message) {
    if(  message.indexOf('!say hello')> -1 && owners.indexOf(from) > -1)  {
        bot.say(ircConfig.channels[0], 'Hello my owner '+ from +', How can I help you?');
    }
});

// Welcome message
bot.addListener("join", function(channel, who) {
	if(owners.indexOf(who) > -1)
		bot.say(channel, "Welcome to my master "+ who +" !");
	else
		bot.say(channel, who + " welcome to lolMVC Channel!");
});
/* END IRC bot behavior */


/*
 DON NOT MODIFY THE CODE BELOW
*/

var express = require('express');
var fs      = require('fs');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_INTERNAL_IP;
        self.port      = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_INTERNAL_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        // Routes for /health, /asciimo and /
        self.routes['/health'] = function(req, res) {
            res.send('1');
        };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

