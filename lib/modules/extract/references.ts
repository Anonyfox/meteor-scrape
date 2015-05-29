/// <reference path="../../definitions/scrape.ts" />

module Extract {
	
	/**
	 * References are outgoing links on the page, simple as that.
	 * 
	 * Calculations can later decide which of them are actually 
	 * relevant.
	 */
	
	export function References($: CheerioStatic): string[] {
		var links: string[] = [];
		$("a").each((i,e) => {
			// TODO: test links
			links.push($(e).attr("href"));
		});
		return links;
	}
	
}