/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * Use different extraction algorithms, dependend on the input.
	 * 
	 * For a given url-string, check if it is valid and may actually
	 * refer to an image. For a given Cheerio DOM element, look for
	 * promising tags and use their values.
	 */
	
	export function Image(input: string | CheerioStatic): string {
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
	 * Return the given URL string after a validation check
	 */
	
	function fromString(str: string): string {
		// TODO: url parsing...
		return str;
	}
	
	/**
	 * Check for common tags and return the "best" one's content. 
	 */
	function fromCheerio($: CheerioStatic): string {
		var selectors: string[] = [
			"meta[property='og:image']",
			"meta[name='twitter:image']"
		]
		var list = []; 
		$(selectors.join(",")).each((i,e) => {
			list.push($(e).attr("content"));
		})
		return fromString(list.compact().first());
	}

}