/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * Use different extraction algorithms, dependend on the
	 * input. 
	 * 
	 * For a url-string, check the correctness and return. For 
	 * a Cheerio DOM element, search in the DOM for relevant tags
	 * that may contain the desired URL.
	 */
	
	export function Link(input: string | CheerioStatic): string {
		if (!input) {
			return "";
		}
		if (_.isString(input)) {
			return fromString(<string>input);
		} else {
			return fromCheerio(<CheerioStatic>input);
		}
	}
	
	/**
	 * Just check that the given string represents a valid URL.
	 */
	
	function fromString(str: string): string {
		// TODO: parse the damn thing, actually
		// Npm.require("url") ...
		return str;
	}
	
	/**
	 * First, look for a valuable canonical tag in the DOM, use 
	 * it if exists. 
	 * 
	 * When not, try to find a link from other usual tags, 
	 * mostly used in XML feeds and stuff like that.
	 */
	
	function fromCheerio($: CheerioStatic): string {
		var canonical = $("link[rel='canonical']").attr("href");
		if (canonical) {
			return canonical;
		} else {
			var url = $("link").first();
			if (url.attr("href")) {
				return url.attr("href");
			} else {
				return url.text();
			}
		}
	}
	
}