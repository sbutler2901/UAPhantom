'use strict';

var fs = require('fs');
var readline = require('readline');
var https = require('https');
var htmlparser = require('htmlparser');
var UAParser = require('ua-parser-js');


//********************* Local Variables *********************

let uaFilePath = "useragents.txt";
let uaJSFilePath = "defaultUserAgents.js";
//let uaJSFilePath = "../helpers/defaultUserAgents.js";
let uaRawHTMLPath = "useragents.html";

var parser = new UAParser();
var uajsonarr = [];
var id = 0;


//********************* Init *********************

init();


//********************* Function Declarations *********************

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
            console.log("Error creating " + uaJSFilePath + ": " + err);
        } else {
            console.log(uaJSFilePath + " has been created");
        }
    });
}

// Performs parsing of user agent file
function createUAJS() {
    var lineReader = readline.createInterface({
      input: fs.createReadStream(uaFilePath)
    });

    lineReader.on('line', lineReaderLine);
    lineReader.on('close', lineReaderClose);
}

// Performs the https request getting html containing user agents and extracts them
function getUserAgents(callback) {
    var options = {
      host: 'techblog.willshouse.com',
      port: 443,
      path: '/2012/01/03/most-common-user-agents/'
    };

    var handler = new htmlparser.DefaultHandler(function (err, dom) {
        if (err)
            console.log("Error parsing html: " + err);
        else {
            var uaListClass = htmlparser.DomUtils.getElements({ class: "get-the-list" }, dom);
            fs.writeFile(uaFilePath, uaListClass[0].children[0].data, (err) => {
                if (err) 
                    console.log("Error writing " + uaFilePath + ": " + err.message);
                else {
                    console.log(uaFilePath + " has been created");
                    callback();
                }
            });
        }
    });

    // Uncomment these to write the intermediate HTML file
    //var uaRawHtml = fs.createWriteStream(uaRawHTMLPath);

    var parser = new htmlparser.Parser(handler);

    https.get(options, function(resp) {
        resp.setEncoding('utf8');
        resp.on('data', function(chunk) {
            parser.parseChunk(chunk);
            //uaRawHtml.write(chunk);
        });
        resp.on('end', function () {
            //uaRawHtml.close();
            parser.done();
        });
    }).on("error", function (err) {
        console.log("Error getting user agents using HTTPS: " + err.message);
    });
}

function init() {
    getUserAgents(function () {
        createUAJS();
    });
}
