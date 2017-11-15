//===========================
//     SPOTITY functions 
//===========================
var printTracks = function(err, data, loop){

	// if single-track JSON response
	if (single === true) {
		console.log(
			"==================================" +
			"\n" + "Song: " + data.name +
			"\n" + "Artists: " + data.artists[0].name +
			"\n" + "Album: " + data.album.name +
			"\n" + "Preview: " + data.preview_url +
			"\n" +
			"=================================="
		);

	// if multiple-track JSON response
	} else {
		console.log(
			"\n" + "Song: " + data.tracks.items[0].name +
			"\n" + "Artists: " + data.tracks.items[0].artists[0].name +
			"\n" + "Album: " + data.tracks.items[0].album.name +
			"\n" + "Preview: " + data.tracks.items[loop].preview_url +
			"\n" 
		);
	}
}

//===========================
//     MOVIE functions 
//===========================
var printMovie = function(err, response, body){
	console.log(
		"\n==================================" +
		"\n" + "Title: " +  JSON.parse(body).Title +
		"\n" + "Year: " + JSON.parse(body).Year + 
		"\n" + "Country: " + JSON.parse(body).Country +
		"\n" + "Language: " + JSON.parse(body).Language + 
		"\n" + "Plot: " + JSON.parse(body).Plot +
		"\n" + "Actors: " + JSON.parse(body).Actors +
		"\n=================================="
	);
}

//=============================


var moment = require('moment'); // Twitter returns: Mon Nov 13 03:38:37 +0000 2017



// TWITTER || "my-tweets"
if (process.argv[2] === "my-tweets") {

	// key & npm used
	var key = require("./keys.js"); 

	// API call; searches tweets vs. timeline
	key.get('search/tweets',
		{q: 'fjnw_test'}, 
	   function(error, tweets, response) {

		// if API returns
		if (!error) {

			// stored to shorten code in for-loop
			var obj = tweets.statuses 

			console.log("\n==================================");

			// loop through each object (tweets) and print specific info
			for (i=0; i<obj.length && i <=20; i++) {

				// return: display name + twittle handle + date + tweet
				console.log(
					"\n" + obj[i].user.name + " (@" + obj[i].user.screen_name + ") " + moment(new Date(obj[i].created_at)).format('LLLL') +
					"\n" + "Tweet #" + (parseInt([i])+1) + ": " + obj[i].text
				);

			};

			console.log("\n==================================");
			console.log("\nThe first 20 available Tweets are displayed in reverse chronological order.\n");
		
		// error condition
		} else {
			console.log("Twitter error occured: " + error);
		}

	});

// SPOTIFY || "spotify-this-song"
} else if (process.argv[2] === "spotify-this-song") {

	// key used
	var key = require("./keys.js"); 

	var single;

		// if user searches without track title (blank & returned as undefined): provide default song
		if (process.argv[3] == undefined) {

			// sets printTracks() to 
			single = true;

			// API call;  searches specific track by ID
			key.request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc').then(function(data) {
				
				// returns:  song name + artists + album name + preview URL
				printTracks("",data)				

			// error condition
			}).catch(function(err) {
				console.error('Error occurred: ' + err); 
			});

		// if user provides track title to search
		} else {

			// sets printTracks to choose different console.log
			single = false;

			// API call:  search by track in argv[3], limit of 5 returns
			key.search({
				type: 'track',
				query: "'" + process.argv[3] + "'",
				limit: 5
			}, 

			function(err, data) {

				// if API returns at least 1 song
				if (data.tracks.items.length != 0) {

					// if API returns succesfully
					if (!err) {

						console.log("==================================");

						// each track return: song title + artists + album name + preview URL
						for (i=0; i<data.tracks.items.length && i <=5; i++) {

							// return song #
							console.log("Song #" + (parseInt([i])+1) + ": ");
							
							// return:  song name + artists + album + preview URL
							printTracks(err, data, i);

						};

						console.log("\n==================================");
						console.log("\nHere are the top 5 songs that returned.\n");

					// error condition
					} else {
						return console.log('Spotify error occurred: ' + err);
				   }
				}
			})
		}

// OMDB || argv[2] === "movie-this"
} else if (process.argv[2] === "movie-this") {

	// key used
	// var request = require('./keys.js');

	// npm used
	var request = require('request');

	// if user provides title name to search, search it
	if (process.argv[3] != undefined) {

		// API query parameter
		var queryUrl = "http://www.omdbapi.com/?t=" + process.argv[3] + "&y=&plot=short&apikey=40e9cece";

		// API call
		request(queryUrl, function (error, response, body) {

			// if API returns
			if (!error) {

				// return:  title + year + country+ language + plot + actors
				printMovie(error, response, body);

			// error condition	
			} else {
				console.log('OMDB error:', error);
				console.log('statusCode:', response && response.statusCode); 
			}

		});

	// if no title provided by user (blank): return default movie
	} else {

		// API call to specific movie
		request("http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=40e9cece", function (error, response, body) {
			
			// if return without error
			if (!error) {

				// return:  title + year + country+ language + plot + actors
				printMovie(error, response, body);

			// error condition
			} else {
				console.log('OMDB error:', error);
				console.log('statusCode:', response && response.statusCode); 
			}

		});
	}

// SPOTIFY from .txt file || argv[2] === "my-tweets"
} else if (process.argv[2] === "do-what-it-says") {

	// npm used
	var fs = require("fs");

	// extract text from .txt file
	fs.readFile("random.txt", "utf8", function(error, data) {

		// error response 
		if (error) {
			return console.log(error);

		// response without error
		} else {

			// key used
			var key = require("./keys.js");

			// split text to get multiple arguments
			var textSplit = data.split(",")

			// API call with argument in .txt file
			key.search({type: 'track', query: textSplit[1]}, function(err,data) {

				// return:  song name + artists + album + preview URL
				printTracks(err, data, 0)

			})

		}
	})
}




