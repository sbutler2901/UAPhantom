var UAParser = require('ua-parser-js');
var fs = require('fs');
var readline = require('readline');

let uaFilePath = "useragents.txt";
let uaJSFilePath = "../helpers/defaultUserAgents.js";

var parser = new UAParser();
var uajsonarr = [];
var id = 0;

var lineReader = readline.createInterface({
  input: fs.createReadStream(uaFilePath)
});

// Called each time a line is read
lineReader.on('line', function (line) {
    //console.log('Line from file:', line);
    var uaresult = parser.setUA(line).getResult()
    uajsonarr.push({
        id: id++,
        ua: line,
        os: uaresult.os,
        browser: uaresult.browser
    });
});

// Called when the file has finished being read
lineReader.on('close', function () {
    /*uajsonarr.forEach( function (item) {
        console.log(item.browser.name);
        //console.log(item.browser.name);
    });*/
    var fileString = "defaultUAs = " + JSON.stringify(uajsonarr) +  ";";
    fs.writeFile(uaJSFilePath, fileString, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Success writing file!");
        }
    });
});
