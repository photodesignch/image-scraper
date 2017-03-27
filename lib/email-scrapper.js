
//var Promise = require('bluebird');
var url = require('url');
var cheerio = require('cheerio');
var emailParser = require('./email-parser.js');
var http = require('http');

var fs = require('fs');
var destPath =  "./saved-images/";
var badLinks = [];

var EmailScrapper = function(filePath, idx) {
  this.path = filePath;
  this.$ = this.loadParser();
  this.badLinks = badLinks;

  this.imageScrapper(filePath, idx);
};

EmailScrapper.prototype.loadParser = function() {
  // Generate an HTML string from an email.
  var email = emailParser.parse(this.path);


  return email.then(function(email) {
    var parser = cheerio.load(email.html);
    return parser;
  });
}

EmailScrapper.prototype.imageScrapper = function(filePath, idx) {
  return this.$.then(function($) {
  	// working on the locale output for email
  	var locale = $('span').toString().match('-loc');
  	var images = $('img');

  	if (locale != null) {
  		console.log(locale);
  	}
  	console.log('Email file: %s. #%s-%s'.white.bold.bgCyan, filePath, idx);

		$('img').map(function(i,e) {
			extractImg(e.attribs.src); // extract all links in email HTML
		});
    return 0;
  });
}

function extractImg(src) {
	var hostname = url.parse(src).hostname;
	var filepath = url.parse(src).pathname;
	var filename = filepath.replace(/(.+\/)+w*/igm, '');

	var options = {
		host: hostname,
		port: 80,
		path: filepath
	};

// determine if image is a pixel tracking image or not.
	if (filename.match(/\..+/igm)) {
		// determine if file already exists on the local file system
		if(hostname == "images.trvl-media.com") {
			console.log('✅  ' + filename + ' is already on'.gray + ' images.trvl-media.com'.bold + ' image server. No action is needed!'.gray);
		} else if (!fileExists(destPath + filename)) {
			requestCall(options, filename);
		}

	}
}

function requestCall(options, filename) {
	var request = http.get(options, function(res){
		var imageData = '';
		res.setEncoding('binary');

		res.on('data', function(chunk){
			imageData += chunk;
		});

		res.on('end', function(){
			if (!fileExists(destPath + filename)) {
				fs.writeFile(destPath + filename, imageData, 'binary', function(err){
					if (err) throw '🚫  ' + err
					console.log('🔔  ' + options.host + options.path + ' saved to '.gray + destPath + filename);
				});
			}
		});
	});
}

function fileExists(file) {
	if (fs.existsSync(file)) {
		console.log('😄  ' + file + " already exist on your local drive".gray);
		return true;
	}
	return false;
}

module.exports = EmailScrapper;

