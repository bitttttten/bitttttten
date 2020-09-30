import { Base64 } from "https://deno.land/x/bb64/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import type {
	SpotifyTopArtistsResponse,
	SavedTracksResponse,
	RecentlyPlayedTracksResponse,
	ArtistByIdResponse,
} from "../types/types.d.ts"
import * as log from "https://deno.land/std/log/mod.ts"

config({ export: true })

const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID")
const SPOTIFY_REFRESH_TOKEN = Deno.env.get("SPOTIFY_REFRESH_TOKEN")
const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET")

// debugging
for (const [key, value] of Object.entries({
	SPOTIFY_CLIENT_ID,
	SPOTIFY_REFRESH_TOKEN,
	SPOTIFY_CLIENT_SECRET,
})) {
	log.info(value ? `Has ${key}` : `Does not have ${key}`)
}

const token = Base64.fromString(
	`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString()
const Authorization = `Basic ${token}`

const AUTH_ENDPOINT = `https://accounts.spotify.com/api/token`
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=4`
const SAVED_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/tracks?limit=4`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played`
const ARTIST_BY_ID_ENDPOINT = `https://api.spotify.com/v1/artists/{id}`

const fetcher: <T>(url: string) => Promise<T> = async (url) => {
	const Authorization = await getAuthorizationToken()
	const response = await fetch(url, {
		headers: {
			Authorization,
		},
	})

	const { status } = response

	log.info(`Status for ${url}: ${status}`)

	if (status === 204) {
		return {}
	}

	if (status === 200) {
		const data = await response.json()
		return data
	}

	throw new Error(`Unknown status for ${url}: ${status}`)
}

export async function getAuthorizationToken() {
	const response = await fetch(AUTH_ENDPOINT, {
		method: "POST",
		headers: {
			Authorization,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: `grant_type=refresh_token&refresh_token=${SPOTIFY_REFRESH_TOKEN}`,
	})

	const data = await response.json()

	return `Bearer ${data.access_token}`
}

export const getTopArtists = async () =>
	fetcher<SpotifyTopArtistsResponse>(TOP_ARTISTS_ENDPOINT)

export const getRecentlyLovedTracks = async () =>
	fetcher<SavedTracksResponse>(SAVED_TRACKS_ENDPOINT)

export const getRecentlyPlayedTracks = async () =>
	fetcher<RecentlyPlayedTracksResponse>(RECENTLY_PLAYED_ENDPOINT)

export const getArtistById = async (id: string) =>
	fetcher<ArtistByIdResponse>(ARTIST_BY_ID_ENDPOINT.replace("{id}", id))
