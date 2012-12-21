module.exports = (function() {
	var
	JUnitTest = require("./JUnitTest"),

	runTest = function(test, testedClassesPath, callback) {
		var junitTest = new JUnitTest(test.path, test.name);
		junitTest.run(testedClassesPath, callback);
	};

	return {
		runTest: runTest
	}
}());