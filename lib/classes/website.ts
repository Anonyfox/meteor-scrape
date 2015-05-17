/// <reference path="../../lib/definitions/scrape.ts" />

module Parse.Website {
	
	var cheerio = Npm.require("cheerio");
	
	/**
	 * Shorthand Constructors
	 */
	 
	export function fromString(str: string): IWebsite {
		return new WebsiteObject(str);
	}
		
	export function fromUrl(url: string): IWebsite {
		return new WebsiteObject(url);
	}
	 
	/**
	 * The returned Class
	 */
	 
	export class WebsiteObject implements IWebsite {
		
		public title: string;
		public name: string; //alias for title
		public description: string;
		public summary: string; // alias for description
		public url: string;
		public link: string; // alias for url
		public image: string;
		public language: string;
		public favicon: string;
		public references: string[] = [];
		public feeds: string[] = [];
		private $: CheerioStatic;
		
		constructor(private str: string) {
			this.$ = cheerio.load(str, {xmlMode: true});
			this.extractBasicData();
			this.extractAdvancedData();
		}
		
		private extractBasicData(): void {
			this.title = Extract.Title(this.$);
			this.url = Extract.Link(this.$);
			this.feeds = Extract.Feeds(this.$);
			this.description = Extract.Description(this.$);
		}
		
		private extractAdvancedData(): void {
			var inspectableText = (this.title + " " + this.description);
			this.language = Calculate.Language.fromString(inspectableText).code();
		}
	}
}