/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * Use different extraction algorithms, dependend on the 
	 * input. 
	 * 
	 * For a given text-string, apply the algorithms of the 
	 * Yaki lib to get a clean array of keywords. If input is 
	 * a Cheerio DOM element, search for the "native" meta
	 * keywords tag and use it's content.
	 */
	
	export function Tags(input: string | CheerioStatic): string [] {
		if (!input) {
			return [];
		}
		if (_.isString(input)) {
			return fromString(<string>input);
		} else {
			return fromCheerio(<CheerioStatic>input);
		}
	}
	
	/**
	 * Just use Yaki on a text string. 
	 */
	
	function fromString(str: string): string[] {
		var language = Calculate.Language(str);
		var tags: string[] = Yaki(str, {language: language}).extract();
		return tags;
	}
	
	/**
	 * Find the native keywords from the DOM and return them
	 * (cleaned).
	 */
	
	function fromCheerio($: CheerioStatic): string[] {
		var str = $("meta[name='keywords']").attr("content");
		if (str) {
			var language = Calculate.Language(str);
			var tags: string[];
			if (/;/.test(str)) {
				tags = str.split(";");
			} else {
				tags = str.split(",");
			}
			return Yaki(tags).clean();
		} else {
			return []
		}
		
	}

}