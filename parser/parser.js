'use strict';

var UAParser = require('ua-parser-js');
var fs = require('fs');
var readline = require('readline');
var https = require('https');


//********************* Local Variables *********************

let uaFilePath = "useragents.txt";
let uaJSFilePath = "../helpers/defaultUserAgents.js";
let uaRawHTMLPath = "useragents.html";

var parser = new UAParser();
var uajsonarr = [];
var id = 0;


//********************* Init *********************

init();


//********************* Function Declarations *********************


function extractUserAgents(callback) {

}

function getUserAgents(callback) {
    var options = {
      host: 'techblog.willshouse.com',
      port: 443,
      path: '/2012/01/03/most-common-user-agents/'
    };

    var uaRawHtml = fs.createWriteStream(uaRawHTMLPath);

    https.get(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(chunk) {
            uaRawHtml.write(chunk);
        });
        resp.on('end', function () {
            uaRawHtml.close();
            callback();
        });
    }).on("error", function(e){
        console.log("Error getting user agents " + e.message);
    });
}

// Called each time a line is read
function lineReaderLine(line) {
    //console.log('Line from file:', line);
    var uaresult = parser.setUA(line).getResult()
    uajsonarr.push({
        id: id++,
        ua: line,
        os: uaresult.os,
        browser: uaresult.browser
    });
}

// Called when the file has finished being read
function lineReaderClose() {
    var fileString = "defaultUAs = " + JSON.stringify(uajsonarr) +  ";";
    fs.writeFile(uaJSFilePath, fileString, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Success writing file!");
        }
    });
}

// Performs parsing of user agent file
function lineReader() {
    var lineReader = readline.createInterface({
      input: fs.createReadStream(uaFilePath)
    });

    lineReader.on('line', lineReaderLine);
    lineReader.on('close', lineReaderClose);
}

function init() {
    getUserAgents(function () {
        extractUserAgents(function () {
            lineReader();
        });
    });
}
