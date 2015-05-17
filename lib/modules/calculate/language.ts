/// <reference path="../../definitions/scrape.ts" />

module Calculate.Language {
	
	/**
	 * Shorthand Constructors
	 */
	
	export function fromString(str: string) {
		return new LanguageObject(str);
	}
	
	// franc: https://github.com/wooorm/franc 
	var franc = Npm.require("franc");
	
	/**
	 * Returned Class
	 */
	
	export class LanguageObject implements ILanguage {
		
		// the scrape module is currently restricted to "mainstream" languages.
		private whiteList: string[] = [
			"deu","eng","spa","pol","ita","por","nld","ukr","jpn","swh","und"
		];
		
		// the two-letter code is way more useful, for example when trying to
		// scrape wikipedia! (the three letter codes are more exact, though)
		private twoLetterCodes = {
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
		
		private data: string;
		
		constructor(private str: string) {
			this.data = franc(str, {whitelist: this.whiteList})  
		}
		
		code(format?: string) {
			if (format) {
				// TODO: return the wanted ISO formatted code
			} else {
				var twoLetter: string;
				twoLetter = this.twoLetterCodes[this.data];
				if (!twoLetter) {
					twoLetter = "en"; // fallback
				}
				return twoLetter;
			}
		}
		
	}
}