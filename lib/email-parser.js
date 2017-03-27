'use strict';

/**
  Parse mime encoded e-mail messages.
*/

var Promise = require("bluebird"),
    MailParser = require('mailparser').MailParser,
    fs = require('fs');

function parse(path) {

  var mailParser = new MailParser();

  return new Promise(function(resolve, reject) {

    fs.createReadStream(path)
      .on('open', function () {
        this.pipe(mailParser);
      })
      .on('error', reject)

    mailParser.on('end', function(email) {
      if (!email || !email.html) {
        return reject('🚫  Failed to parse HTMl from the email.');
      }

      resolve({
        subjectline: email.subject,
        from: email.from,
        html: email.html
      });
    });
  })
}

module.exports = {
  parse: parse
};
