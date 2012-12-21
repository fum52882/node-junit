var
fs = require("fs"),
exec = require("child_process").exec,
CommandBuilder = require("commandline-utils").CommandBuilder;

module.exports = JUnitTest;

function JUnitTest(path, name) {
	this.path = path;
	this.name = name;
	this.classPaths = [
		__dirname + "/jars/" + "junit.jar",
		__dirname + "/jars/" + "org.hamcrest.core.jar",
		__dirname + "/jars/" + "JsonTestRunner.jar",
		path
	];
}

JUnitTest.prototype.run = function(testedClassesPath, callback) {
	var command = this._buildCommand(testedClassesPath);

	var that = this;
	exec(command, { timeout: 60000 }, function(error, stdout, stderr) {
		if (error) {
			return callback(error, null);
		}
		callback(null, that._loadTestResult(testedClassesPath));
	})
}

JUnitTest.prototype._buildCommand = function(testedClassesPath) {
	var command = new CommandBuilder("java");
	return command.set("classpath", this._buildClassPaths(testedClassesPath), ":")
		.append("JsonTestRunner")
		.append(this._resultFilePath(testedClassesPath))
		.append(this.name)
		.build();
}

JUnitTest.prototype._buildClassPaths = function(testedClassesPath) {
	return [testedClassesPath].concat(this.classPaths);
}

JUnitTest.prototype._resultFilePath = function(testedClassesPath) {
	return testedClassesPath + this.name + ".json";
}

JUnitTest.prototype._loadTestResult = function(testedClassesPath) {
	var testResult = JSON.parse(fs.readFileSync(this._resultFilePath(testedClassesPath)));
	testResult.testName = this.name;
	return testResult;
}