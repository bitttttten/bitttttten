export interface ArtistAttr {
	rank: string;
}

export interface Artist {
	"@attr": ArtistAttr;
	mbid: string;
	playcount: string;
	name: string;
	url: string;
}

export interface WeeklyArtistChartResponseAttr {
	user: string;
	from: string;
	to: string;
}

export interface WeeklyArtistChartResponse {
	artist: Artist[];
	"@attr": WeeklyArtistChartResponseAttr;
}

export interface UserGetWeeklyAristChart {
	weeklyartistchart: WeeklyArtistChartResponse;
}

