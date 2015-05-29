/// <reference path="../../definitions/scrape.ts" />

module Calculate {
	
	var franc = Npm.require("franc");
	
	// the scrape module is currently restricted to "mainstream" languages.
	var whiteList= [
		"deu","eng","spa","pol","ita","por","nld","ukr","jpn","swh"
	];
	
	// the two-letter code is way more useful, for example when trying to
	// scrape wikipedia! (the three letter codes are more exact, though)
	var twoLetterCodes = {
		"deu": "de",
		"eng": "en",
		"cmn": "zh",
		"spa": "es",
		"arb": "ar",
		"pol": "pl",
		"ita": "it",
		"por": "pt",
		"nld": "nl",
		"ukr": "uk",
		"jpn": "jp",
		"swh": "sw",
		"und": "en"
	};
	
	/**
	 * Just apply the algorithms from franc.js on a text string
	 */
	
	export function Language(str: string): string {
		var lang = franc(str, {whitelist: whiteList});
		var code = twoLetterCodes[lang];
		if (!code || code === "und") {
			code = "en"; // fallback
		}
		return code;
	}
	
}