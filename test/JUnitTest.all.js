var 
fs = require("fs"),
path = require("path"),
JUnitTest = require("../").JUnitTest,
should = require("should"),
FIXTURES_PATH = __dirname + "/fixtures/";

describe("JUnitTest", function() {
	var test = null;
	var testName = "CheckCharsTest";
	var testPath = FIXTURES_PATH + "test/";
	var testedClassesPath = FIXTURES_PATH + "src/";
	var expectedResultFilePath = testedClassesPath + testName + ".json";

	beforeEach(function() {
		test = new JUnitTest(testPath, testName);
	});

	describe("ctor", function() {
		it("creates an instance of JUnitTest", function() {
			test.should.be.an.instanceOf(JUnitTest);
		});
	});

	describe("#_resultFilePath", function() {
		it("returns the correct result file path", function() {
			var resultFilePath = test._resultFilePath(testedClassesPath)
			resultFilePath.should.equal(expectedResultFilePath);
		});
	});

	describe("#_buildClassPaths", function() {
		it("returns the correct classpaths array", function() {
			var classPaths = test._buildClassPaths(testedClassesPath);
			classPaths.should.include(testedClassesPath);
			classPaths.should.include(testPath);
			classPaths.should.include(path.normalize(__dirname + "/../lib/jars/junit.jar"));
			classPaths.should.include(path.normalize(__dirname + "/../lib/jars/org.hamcrest.core.jar"));
			classPaths.should.include(path.normalize(__dirname + "/../lib/jars/JsonTestRunner.jar"));
		});
	});

	describe("#_buildCommand", function() {
		it("returns the correct command", function() {
			var command = test._buildCommand(testedClassesPath);
			var classPaths = testedClassesPath + ":";
			classPaths += path.normalize(__dirname + "/../lib/jars/junit.jar") + ":";
			classPaths += path.normalize(__dirname + "/../lib/jars/org.hamcrest.core.jar") + ":";
			classPaths += path.normalize(__dirname + "/../lib/jars/JsonTestRunner.jar") + ":";
			classPaths += testPath;
			command.should.equal("java -classpath " + classPaths + 
				" JsonTestRunner " + 
				testedClassesPath + testName + ".json " + 
				testName);
		});
	});

	describe("#run", function() {
		it("runs the test and creates the result file", function(done) {
			removeOldResultFile(function(err) {
				should.not.exist(err);
				test.run(testedClassesPath, function(error, result) {
					should.not.exist(error);
					existsResultFile(function(exists) {
						exists.should.be.true;
						done();
					});
				});
			});
		});
	});

	var removeOldResultFile = function(callback) {
		fs.unlink(expectedResultFilePath, callback);
	}

	var existsResultFile = function(callback) {
		fs.exists(expectedResultFilePath, callback);
	}
});