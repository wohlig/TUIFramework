#!/usr/bin/env node

//all dependencies
var _ = require("lodash")
var program = require("commander")
var chalk = require("chalk")
var async = require("async")
var fs = require("fs")
var downloadGit = require("download-github-repo")

//colored console
global.blue = function(data) {
    console.log(chalk.blue(data))
}
global.red = function(data) {
    console.log(chalk.red(data))
}
global.green = function(data) {
    console.log(chalk.green(data))
}
global.log = function(data) {
    console.log(data)
}

program
    .version("0.0.17")
    .option("-n, --new [foldername]", "Generate New  Framework")
    .option("-g, --generate [foldername]", "Generate Frontend Framework")
    .parse(process.argv)

if (program.generate) {
    if (program.generate === true) {
        console.log("Please provide a name for the Controller and Service")
    } else {
        console.log("Copying the Content")
        var apiName = _.upperFirst(program.generate)
        var controller = fs.readFileSync(__dirname + "/lib/Controller.js")
        fs.exists("controllers", function(isExist) {
            if (isExist) {
                fs.exists(
                    "./controllers/" + apiName + "Controller.js",
                    function(isExist) {
                        if (isExist) {
                            console.log(
                                "Controller " + apiName + " already exist"
                            )
                        } else {
                            controller = _.replace(
                                controller,
                                new RegExp("NewController", "g"),
                                apiName
                            )
                            controller = _.replace(
                                controller,
                                new RegExp("NewModel", "g"),
                                apiName + "Model"
                            )
                            var write = fs.writeFileSync(
                                "controllers/" + apiName + "Controller.js",
                                controller
                            )
                            console.log("Controller " + apiName + " Generated")
                        }
                    }
                )
            } else {
                console.log("Controller Folder not found")
            }
        })

        var mongooseModel = fs.readFileSync(__dirname + "/lib/MongooseModel.js")
        fs.exists("./mongooseModel", function(isExist) {
            if (isExist) {
                fs.exists("./mongooseModel/" + apiName + ".js", function(
                    isExist
                ) {
                    if (isExist) {
                        console.log(
                            "Mongoose Model " + apiName + " already exists"
                        )
                    } else {
                        mongooseModel = _.replace(
                            mongooseModel,
                            new RegExp("NewMongooseModel", "g"),
                            apiName
                        )
                        var write = fs.writeFileSync(
                            "mongooseModel/" + apiName + ".js",
                            mongooseModel
                        )
                        console.log("Mongoose Model " + apiName + " Generated")
                    }
                })
            } else {
                console.log("Mongoose Model Folder not found")
            }
        })

        var model = fs.readFileSync(__dirname + "/lib/Model.js")
        fs.exists("./models", function(isExist) {
            if (isExist) {
                fs.exists("./models/" + apiName + "Model.js", function(
                    isExist
                ) {
                    if (isExist) {
                        console.log("Model " + apiName + " already exists")
                    } else {
                        model = _.replace(
                            model,
                            new RegExp("NewModel", "g"),
                            apiName
                        )
                        var write = fs.writeFileSync(
                            "models/" + apiName + "Model.js",
                            model
                        )
                        console.log("Model " + apiName + " Generated")
                    }
                })
            } else {
                console.log("Model Folder not found")
            }
        })

        //unit testing
        var api = fs.readFileSync(__dirname + "/lib/api.js")
        var test = fs.readFileSync(__dirname + "/lib/test.js")
        var fileName = apiName + "/" + apiName + "Api.js"
        fs.exists("./test", function(isExist) {
            if (isExist) {
                fs.exists("./test/" + apiName, function(isExist) {
                    if (isExist) {
                        console.log(
                            "Test cases for " + apiName + " api already exists"
                        )
                    } else {
                        fs.mkdirSync("./test/" + apiName)
                        api = _.replace(api, new RegExp("New", "g"), apiName)
                        var write = fs.writeFileSync("test/" + fileName, api)
                        var appenddata =
                            '\nrequire("./' +
                            apiName +
                            "/" +
                            apiName +
                            "Api.js" +
                            '")'
                        fs.appendFileSync("test/test.js", appenddata)
                        console.log("Test cases for " + apiName + " generated")
                    }
                })
            } else {
                fs.mkdirSync("./test")
                fs.mkdirSync("./test/" + apiName)
                api = _.replace(api, new RegExp("New", "g"), apiName)
                var write = fs.writeFileSync("test/" + fileName, api)
                var write = fs.writeFileSync("test/test.js", test)
                var appenddata =
                    'require("./' + apiName + "/" + apiName + "Api.js" + '")'
                fs.appendFileSync("test/test.js", appenddata)
                console.log("Test cases for " + apiName + " generated")
            }
        })
    }
}

if (program.new) {
    if (program.new === true) {
        red("Please provide a Folder Name")
    } else {
        var folderName = program.new
        async.waterfall(
            [
                function(callback) {
                    // Downloading file
                    console.log("Downloading from Github")
                    downloadGit(
                        "WohligTechnology/nodeFramework",
                        folderName,
                        callback
                    )
                }
            ],
            function(err) {
                if (err) {
                    red("Error Occured ")
                    console.error(err)
                } else {
                    green(
                        "Your New New Framework is Ready in Folder " +
                            folderName
                    )
                }
            }
        )
    }
}
