/**
 * External Libraries
 */
/// <reference path="meteor.d.ts" />
/// <reference path="cheerio.d.ts" />
/// <reference path="sugar.d.ts" />
/// <reference path="underscore.d.ts" />
/// <reference path="node.d.ts" />
/// <reference path="moment.d.ts" />

/**
 * Calculations: 
 * The actual number crunching modules.
 */
/// <reference path="../modules/calculate/language.ts" />

/**
 * Extractors: 
 * Retrieve precise data from strings or DOM objects
 */
/// <reference path="../modules/extract/title.ts" />
/// <reference path="../modules/extract/description.ts" />
/// <reference path="../modules/extract/pubdate.ts" />
/// <reference path="../modules/extract/image.ts" />
/// <reference path="../modules/extract/favicon.ts" />
/// <reference path="../modules/extract/link.ts" />
/// <reference path="../modules/extract/fulltext.ts" />
/// <reference path="../modules/extract/feeds.ts" />
/// <reference path="../modules/extract/tags.ts" />
/// <reference path="../modules/extract/references.ts" />

/**
 * Models: 
 * Instantiate representations of real world data sources, 
 * either by URL or by text string.
 */
/// <reference path="../parser/website.ts" />
/// <reference path="../parser/article.ts" />
/// <reference path="../parser/feed_item.ts" />
/// <reference path="../parser/feed.ts" />

/**
 * Untyped libraries: 
 * 
 * TODO -> find/create *.d.ts definitions
 */
declare var Yaki;
declare var franc;

/**
 * Parser: 
 * 
 * the heart of this library. It is possible to parse Feeds (Atom/RSS),
 * Websites and Wikipedia Articles. 
 * 
 * Every Parser has two shorthand constructors: `fromString()` and 
 * `fromUrl()`.
 * 
 * The interfaces below are used for the internal classes of
 * these modules, whose instances are finally returned.
 */

module Parse {
	
	export interface BasicInfo {
		title: string;
		name: string; //alias for title
		url: string;
		link: string; // alias for url
		description: string;
		summary: string; // alias for description
		language: string;
		pubDate: Date;
		image: string;
	}
	
	export interface FeedInfo {
		lastBuildDate: string;
		docs: string;
		managingEditor: string;
		webMaster: string;
		items: Parse.Feed.FeedItem[];
	}
	
	export interface WebsiteInfo {
		favicon: string;
		references: string[];
		feeds: string[];
	}
	
	export interface ArticleInfo {
		references: string[];
	}
	
	export interface Tagged {
		tags: string[];
		keywords: string[]; // alias for tags
		nativeTags: string[];
		nativeKeywords: string[]; // alias for nativeTags
	}
	
	// old interfaces below
	
	export interface IFeed {
		title: string;
		url: string;
		description: string;
		language: string;
		pubDate: Date;
		lastBuildDate: string;
		docs: string;
		managingEditor: string;
		webMaster: string;
		items: Parse.Feed.FeedItem[];
	}
	
	export interface IWebsite {
		title: string;
		name: string; //alias for title
		description: string;
		summary: string; // alias for description
		url: string;
		link: string; // alias for url
		image: string;
		language: string;
		favicon: string;
		references: string[];
		feeds: string[];
	}
	
	export interface IArticle {
		title: string;
		name: string; //alias for title
		description: string;
		summary: string; // alias for description
		fullText: string;
		url: string;
		link: string; // alias for url
		image: string;
		language: string;
		references: string[];
		tags: string[];
		keywords: string[]; // alias for tags
		nativeTags: string[];
		nativeKeywords: string[]; // alias for nativeTags
	}
}