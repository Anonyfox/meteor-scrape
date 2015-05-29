/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * Find the best looking favicon from the page
	 */
	
	export function Favicon($: CheerioStatic): string {
		var selectors = [
			"link[rel='apple-touch-icon']",
	        "link[rel='shortcut icon']",
	        "link[rel='icon']"
		]
		return $(selectors.join(",")).attr("href");
	}
	
}