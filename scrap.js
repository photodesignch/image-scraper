'use strict';

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var path = require('path');
var colors = require('colors');
var EmailScrapper = require('./lib/email-scrapper.js');

var emailDirectory = './emails/';

var emails = fs.readdirAsync(emailDirectory).filter(isEMLFile)
  .catch(Error, function(e) {
    if (e.code === 'ENOENT') {
      return console.log('Folder does no exist:', emailDirectory);
    }

    throw e;
  })

emails.then(function(result) {

  if (result.length < 1) {
    return console.log('No emails found in the directory:', emailDirectory)
  }

  emails.map(renameTestSend);
})

function renameTestSend(fileName, index) {
  var scrapper = new EmailScrapper(emailDirectory + fileName, index+1);
}

function isEMLFile(fileName) {
  return (/\.(eml)$/i).test(fileName);
}
