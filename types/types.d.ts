export interface Image {
	height: number
	url: string
	width: number
}

export interface Item {
	images: Image[]
	name: string
	external_urls: ExternalUrls
}

export interface ExternalUrls {
	spotify: string
}

export interface SpotifyTopArtistsResponse {
	items: Item[]
	total: number
}

export interface LocalArtist {
	name: string
	image: string
	url: string
}
