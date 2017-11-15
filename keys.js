console.log('keys.js loaded succesfully');

// Twitter
if (process.argv[2] === "my-tweets") {
	
	var Twitter = require('twitter');
	 
	var client = new Twitter({
	  consumer_key: 'VpZhsK8IAZKEsiATMIOPTzGzu',
	  consumer_secret: 'AbloE2bXeOFdA6GnlHcPxJMTZibc0aeQWntDOjzSggKnNJfUcA',
	  access_token_key: '929915695365853189-8ni8VO8d7cTtwX8XAZz2qdxyh0xNDHl',
	  access_token_secret: 'De3aFAYS3DaG0v6yVRSfXBg2wsAZa2onha1NDrKbOwtrw'
	});

	module.exports = client;

// SPOTIFY  && SPOTIFY by .txt argument
} else if (process.argv[2] === "spotify-this-song" || process.argv[2] === "do-what-it-says") {

	// Spotify
	var Spotify = require('node-spotify-api');
	 
	var spotify = new Spotify({
	  id: 'dc0d98aa2a86451baa66a3f1b6401645',
	  secret: '16ec7e15fbdc454881c72ec153f0b1f3' 
	});

	module.exports = spotify;

// OMDB
} else if (process.argv[2] === "movie-this") {

	var Request = require('request');

	var request = new Request({apikey: '40e9cece'});

	module.exports = request;

}

