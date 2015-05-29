/// <reference path="../../lib/definitions/scrape.ts" />

module Parse.Feed {
	
	var cheerio = Npm.require("cheerio");
	
	/**
	 * Shorthand Constructors
	 */
	 
	export function fromString(str: string): IFeed {
		return new FeedObject(str);
	}
		
	export function fromUrl(url: string): IFeed {
		return new FeedObject(url);
	}
	 
	/**
	 * The returned Class
	 */
	 
	export class FeedObject implements IFeed {
		public title: string;
		public url: string;
		public description: string;
		public language: string;
		public pubDate: Date;
		public lastBuildDate: string;
		public docs: string;
		public managingEditor: string;
		public webMaster: string;
		public items: FeedItem[] = [];
		private $: CheerioStatic;
		
		constructor(private str: string) {
			this.$ = cheerio.load(str, {xmlMode: true});
			this.title = Extract.Title(this.$);
			this.description = Extract.Description(this.$);
			this.url = Extract.Link(this.$);
			this.pubDate = Extract.PubDate(this.$);
			this.language = Calculate.Language(this.title + " " + this.description);
			this.extractLastBuildDate();
			this.extractDocs();
			this.extractManagingEditor();
			this.extractWebMaster();
			this.extractItems();
		}
		 
		private extractLastBuildDate(): void {
			this.lastBuildDate = this.$('lastBuildDate').first().text();
			// TODO: date parsing
		}
		
		private extractDocs(): void {
			this.docs = this.$("docs").first().text();
			// TODO: is this really neccessary?
		}
		
		private extractManagingEditor(): void {
			this.managingEditor = this.$("managingEditor").first().text();
			// TODO: string cleaning
		}
		
		private extractWebMaster(): void {
			this.webMaster = this.$("webMaster").first().text();
			// TODO: string cleaning
		}
		
		private extractItems(): void {
			this.$("item,entry").each((i,e) => {
				this.items.push(new FeedItem(cheerio.load(e, {xmlMode: true})));
			});
		}
		 
	}
}