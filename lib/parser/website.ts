/// <reference path="../../lib/definitions/scrape.ts" />

module Parse.Website {
	
	var cheerio = Npm.require("cheerio");
	
	/**
	 * Shorthand Constructors
	 */
	 
	export function fromString(str: string): WebsiteObject {
		return new WebsiteObject(str);
	}
		
	export function fromUrl(url: string): WebsiteObject {
		return new WebsiteObject(url);
	}
	 
	/**
	 * The returned Class
	 */
	 
	export class WebsiteObject implements BasicInfo, WebsiteInfo {
		
		public title: string;
		public name: string; //alias for title
		public description: string;
		public summary: string; // alias for description
		public url: string;
		public link: string; // alias for url
		public image: string;
		public language: string;
		public favicon: string;
		public pubDate: Date;
		public references: string[] = [];
		public feeds: string[] = [];
		private $: CheerioStatic;
		
		constructor(private str: string) {
			this.$ = cheerio.load(str, {xmlMode: true});
			this.extractBasicInfo();
			this.extractWebsiteInfo();
		}
		
		private extractBasicInfo(): void {
			this.title = Extract.Title(this.$);
			this.name = this.title;
			this.url = Extract.Link(this.$);
			this.link = this.url;
			this.description = Extract.Description(this.$);
			this.summary = this.description;
			var inspectableText = (this.title + " " + this.description);
			this.language = Calculate.Language(inspectableText);
			this.pubDate = Extract.PubDate(this.$);
		}
		
		private extractWebsiteInfo(): void {
			this.feeds = Extract.Feeds(this.$);
			this.references = Extract.References(this.$);
			this.favicon = Extract.Favicon(this.$);
		}
	}
}