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

export interface ExternalUrls {
	spotify: string
}

export interface AlbumArtist {
	external_urls: ExternalUrls
	href: string
	id: string
	name: string
	type: string
	uri: string
}

export interface SavedTracksAlbumExternalUrls {
	spotify: string
}

export interface AlbumImage {
	height: number
	url: string
	width: number
}

export interface Album {
	album_type: string
	artists: AlbumArtist[]
	available_markets: string[]
	external_urls: SavedTracksAlbumExternalUrls
	href: string
	id: string
	images: AlbumImage[]
	name: string
	type: string
	uri: string
}

export interface SavedTracksArtistExternalUrls {
	spotify: string
}

export interface SavedTracksArtist {
	external_urls: SavedTracksArtistExternalUrls
	href: string
	id: string
	name: string
	type: string
	uri: string
}

export interface SavedTracksExternalUrls {
	spotify: string
}

export interface Track {
	album: Album
	artists: SavedTracksArtist[]
	available_markets: string[]
	disc_number: number
	duration_ms: number
	explicit: boolean
	external_urls: SavedTracksExternalUrls
	name: string
	uri: string
}

export interface SavedTracksItem {
	added_at: Date
	track: Track
}

export interface SavedTracksResponse {
	href: string
	items: SavedTracksItem[]
	limit: number
	next: string
	offset: number
	previous?: any
	total: number
}
