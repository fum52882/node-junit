var 
junit = require("../lib/junit"),
should = require("should");

describe("junit.runTest", function() {
	it("runs the test", function(done) {
		var testPath = __dirname + "/fixtures/test/";
		var testName = "CheckCharsTest";
		var testedClassesPath = __dirname + "/fixtures/src/";
		junit.runTest({ path: testPath, name: testName }, testedClassesPath, function(error, result) {
			should.not.exist(error);
			should.exist(result);
			done();
		});
	});
});