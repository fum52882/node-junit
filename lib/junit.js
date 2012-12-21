module.exports = (function() {
	var
	_ = require("underscore"),
	fs = require("fs"),
	exec = require("child_process").exec,
	CommandBuilder = require("commandline-utils").CommandBuilder,
	JUNIT_CLASS_PATHS = [
		__dirname + "/jars/" + "junit.jar",
		__dirname + "/jars/" + "org.hamcrest.core.jar",
		__dirname + "/jars/" + "JsonTestRunner.jar"
	],
	resultFilePath = "",
	testName = "",
	testPath = "",
	classPaths = null,

	runTest = function(test, testedClassesPath, callback) {
		var classPaths = [testedClassesPath, test.path].concat(JUNIT_CLASS_PATHS);

		var resultFilePath = testedClassesPath + test.name + ".json";

		var command = new CommandBuilder("java");
		command.set("classpath", classPaths, ":")
			.append("JsonTestRunner")
			.append(resultFilePath)
			.append(test.name)
			.build();

		exec(command, { timeout: 60000 }, function(error, stdout, stderr) {
			var testResult = {
				testName: test.name
			};
			if (error) {
				testResult.successful = false;
				testResult.runCount = 0;
				testResult.failures = [error, error.code, stdout.substr(0, 15), stderr.substr(0, 15)];
			} else {
				_.extend(testResult, loadTestResult(testedClassesPath, test.name));
			}
			callback(error, testResult);
		});
	},

	buildCommand = function(testedClassesPath) {
		var command = new CommandBuilder("java");
		command.set("classpath", classPaths, ":")
			.append("JsonTestRunner")
			.append(resultFilePath)
			.append(testName)
			.build();
	},

	resultFilePath = function(testedClassesPath) {
		return testedClassesPath + testName + ".json");
	},

	loadTestResult = function(resultFilePath) {
		var testResult = JSON.parse(fs.readFileSync(resultFilePath));
		return testResult;
	};

	return {
		runTest: runTest
	}
}());