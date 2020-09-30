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

export interface RecentlyPlayedTracksArtistExternalUrls {
	spotify: string
}

export interface RecentlyPlayedTracksArtist {
	external_urls: RecentlyPlayedTracksArtistExternalUrls
	href: string
	id: string
	name: string
	type: string
	uri: string
}

export interface RecentlyPlayedTracksTrackExternalUrls {
	spotify: string
}

export interface RecentlyPlayedTracksTrack {
	artists: RecentlyPlayedTracksArtist[]
	available_markets: string[]
	disc_number: number
	duration_ms: number
	explicit: boolean
	external_urls: RecentlyPlayedTracksTrackExternalUrls
	href: string
	id: string
	name: string
	preview_url: string
	track_number: number
	type: string
	uri: string
}

export interface RecentlyPlayedTracksContextExternalUrls {
	spotify: string
}

export interface RecentlyPlayedTracksContext {
	uri: string
	external_urls: RecentlyPlayedTracksContextExternalUrls
	href: string
	type: string
}

export interface RecentlyPlayedTracksItem {
	track: RecentlyPlayedTracksTrack
	played_at: Date
	context: RecentlyPlayedTracksContext
}

export interface RecentlyPlayedTracksCursors {
	after: string
	before: string
}

export interface RecentlyPlayedTracksResponse {
	items: RecentlyPlayedTracksItem[]
	next: string
	cursors: RecentlyPlayedTracksCursors
	limit: number
	href: string
}

export interface ArtistByIdExternalUrls {
	spotify: string
}

export interface ArtistByIdFollowers {
	href?: any
	total: number
}

export interface ArtistByIdImage {
	height: number
	url: string
	width: number
}

export interface ArtistByIdResponse {
	external_urls: ArtistByIdExternalUrls
	followers: ArtistByIdFollowers
	genres: string[]
	href: string
	id: string
	images: ArtistByIdImage[]
	name: string
	popularity: number
	type: string
	uri: string
}

export namespace GithubRepository {
	export interface User {
		avatarUrl: string
		url: string
	}

	export interface Node {
		user: User
	}

	export interface Edge {
		node: Node
	}

	export interface Reactions {
		edges: Edge[]
	}

	export interface Issue {
		reactions: Reactions
	}

	export interface Stargazers {
		nodes: Node[]
	}

	export interface Repository {
		issue: Issue
		stargazers: Stargazers
	}

	export interface Data {
		repository: Repository
	}

	export interface Response {
		data: Data
	}
}
