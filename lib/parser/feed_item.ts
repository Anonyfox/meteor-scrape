/// <reference path="../definitions/scrape.ts" />

module Parse.Feed {
	
	var cheerio = Npm.require("cheerio");
	
	export class FeedItem implements BasicInfo, Tagged {
		public title: string;
		public name: string; // alias for title
		public description: string;
		public summary: string; // alias for description
		public url: string;
		public link: string; // alias for url
		public pubDate: Date;
		public image: string;
		public language: string;
		public tags: string[] = [];
    public keywords: string[];
		public nativeTags: string[] = [];
    public nativeKeywords: string[];
		
		constructor(private $: CheerioStatic) {
			this.extractBasicInfo();
			this.extractTaggedInfo();
		}
		
		private extractBasicInfo(): void {
			this.title = Extract.Title(this.$);
      this.name = this.title;
			this.description = Extract.Description(this.$);
      this.summary = this.description;
			this.url = Extract.Link(this.$);
      this.link = this.url;
			this.pubDate = Extract.PubDate(this.$);
      this.language = Calculate.Language(this.title + " " + this.description);
			this.extractImage();
		}
		
		private extractTaggedInfo(): void {
			this.extractNativeTags();
			this.extractTags();
		}
		
		private extractImage(): void {
			var imageSelector: string = "media\\:content, media\\:thumbnail, content";
			var image: string;
			var image: string = this.$("enclosure").attr("url");
			
			if (!image) { // hack! works for now...the line above is buggy!
				// this line alone doubles the algorithm's runtime
				// because basically every feed item is now parsed *twice*
				// must be fixed soon
				image = cheerio.load(this.$.html())("enclosure").attr("url"); 
			}
			
			if (!image) {
				image = this.$(imageSelector).attr("url");
			}
			
			if (!image) {
				try {
					var str: string = this.$.html();
					var regex: RegExp = /\ssrc=["']*(([^'"\s]+)\.(jpe?g)|(png))["'\s]/i;
					var matches: RegExpMatchArray = str.match(regex);
					if (matches) {
						image = matches[1];
					} else {
						image = "";
					}
				}
				catch (e) {
					image = "";
				}
			}
			this.image = image;
			// TODO: test this stuff!!
		}
		
		private extractNativeTags(): void {
			var tagList: string[] = [];
			this.$("category,categories").each((index: number, element: CheerioElement): void => {
				var categoryString: string = cheerio(element).text();
				categoryString.split(/[,;]/).each(function(elm) {
					tagList.push(elm.trim());
				});
			});
			this.nativeTags = tagList;
      this.nativeKeywords = this.nativeTags;
			// TODO: test this stuff!
		}
		
		private extractTags(): void {
			var sampleString: string = this.title + " " + this.description;
			var tags: string[] = Yaki(sampleString, {language: this.language}).extract();
			this.tags = _.union(this.nativeTags, tags);
      this.keywords = this.tags;
		}
	}
	
}





