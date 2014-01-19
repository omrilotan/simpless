var fs = require("fs"),
    less = require("less"),
    parser = new less.Parser(),

    outputName = "output",

    helpers = {
        
        // Reads a file, returns the string to a callback
        readFile: function (file, callback) {
            fs.readFile(file, "utf8", function (error, result) {
                if (error) {
                    console.log("'helpers readFile' Error: " + error + "\n");
                } else {
                    callback(result);
                }
            });
        },

        // Writes a file, calls the callback
        writeFile: function (destination, content, callback) {
            fs.writeFile(destination, content, function (error) {
                if (error) {
                    console.log("'helpers writeFile' Error: " + error + "\n");
                } else {
                    callback();
                }
            });
        },

        // Concatenates files in a certain order, returns the conjoined string to a callback
        concatFiles: function (files, callback) {
            files = typeof files === "string" ? JSON.parse(files) : files;
            var count = files.length,
                collection = [];
            files.forEach(function (item, index) {
                helpers.readFile(item, function (result) {
                    collection[index] = result;
                    if (--count === 0) {
                        callback(collection.join("\r\n"));
                    }
                });
            });
        },

        parseLessString: function (string, callback) {
            parser.parse(string, function (obj, result) {
                callback(result.toCSS());
            });
        }
    },

    Queue = function () {
        this.waitingList = [];
    },
    myParserQueue;

Queue.prototype.wait = function (fn) {
    this.waitingList.push(fn);
};
Queue.prototype.begin = function (incoming) {
    if (this.waitingList.length) {
        var that = this;
        var callback = function (result) {
            that.begin(result);
        };
        this.waitingList.shift()(incoming, callback);
    }
};

process.argv.forEach(function(val, index, array) {
    if (index === 2) {
        outputName = val;
    }
});

myParserQueue = new Queue();
myParserQueue.wait(helpers.readFile);
myParserQueue.wait(helpers.concatFiles);
myParserQueue.wait(helpers.parseLessString);
myParserQueue.wait(function (string) {
    helpers.writeFile(outputName + ".css", string, function () {
        console.log("\n\n-------------------------------------\n       File added: " + outputName + ".css \n-------------------------------------\n");
    });
});
myParserQueue.begin("./list.json");

