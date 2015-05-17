/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * It only makes sense to use this Extractor on DOM elements,
	 * That's why there are no specific sub-functions.
	 * 
	 * Just look through the DOM for typical tags that may contain
	 * URLs to RSS/Atom-Feeds.
	 */
	
	export function Feeds($: CheerioStatic): string[] {
		if (!$) {
			return [];
		}
		var selectors = [
			"link[type='application/rss+xml']",
    		"link[type='application/atom+xml']",
    		"link[rel='alternate']"
		]
		var list: string[] = [];
		$(selectors.join(",")).each((i,e) => {
			var url = $(e).attr("href");
			list.push(url);
		});
		// TODO: parse and autocorrect the actual URLs
		return list.compact().unique();
	}
	
}