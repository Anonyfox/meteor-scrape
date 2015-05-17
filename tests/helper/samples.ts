/// <reference path="../test-definitions.ts" />

module UnitTests.Samples {
	
	/**
	 * The Samples helper module is responsible for loading the 
	 * required test data from the `sampledata` folder.
	 * 
	 * Therefore, a collection of shorthand load functions is defined here
	 */
	
	export function site(fileName: string): string {
		return loadFile(fullPath("sites", fileName));
	}
	
	export function feed(fileName: string): string {
		return loadFile(fullPath("feeds", fileName));
	}
	
	/**
	 * The following functions are helpers containing the required logic. 
	 */
	
	function fullPath(folder: string, fileName: string): string {
		var path = Npm.require("path");
		var root = path.join(path.resolve("."), "assets", "packages");
		var pkg = path.join(root, "local-test_anonyfox_scrape", "tests");
		var path = path.join(pkg, "sampledata", folder, fileName);
		return path;
	}
	
	function loadFile(path: string): string {
		var fs = Npm.require("fs");
		return fs.readFileSync(path, {encoding: "utf-8"});
	}
}