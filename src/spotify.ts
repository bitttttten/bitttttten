import { Base64 } from "https://deno.land/x/bb64/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import {
	SpotifyTopArtistsResponse,
	SavedTracksResponse,
} from "../types/types.d.ts"
import * as log from "https://deno.land/std/log/mod.ts"

config({ export: true })

const SPOTIFY_CLIENT_ID = Deno.env.get("SPOTIFY_CLIENT_ID")
const SPOTIFY_REFRESH_TOKEN = Deno.env.get("SPOTIFY_REFRESH_TOKEN")
const SPOTIFY_CLIENT_SECRET = Deno.env.get("SPOTIFY_CLIENT_SECRET")

log.info(
	SPOTIFY_CLIENT_ID
		? `Has SPOTIFY_CLIENT_ID`
		: `Does not have SPOTIFY_CLIENT_ID`
)
log.info(
	SPOTIFY_REFRESH_TOKEN
		? `Has SPOTIFY_REFRESH_TOKEN`
		: `Does not have SPOTIFY_REFRESH_TOKEN`
)
log.info(
	SPOTIFY_CLIENT_SECRET
		? `Has SPOTIFY_CLIENT_SECRET`
		: `Does not have SPOTIFY_CLIENT_SECRET`
)

const token = Base64.fromString(
	`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString()
const Authorization = `Basic ${token}`

const AUTH_ENDPOINT = `https://accounts.spotify.com/api/token`
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=4`
const SAVED_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/tracks?limit=4`

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

export const getTopArtists: () => Promise<
	SpotifyTopArtistsResponse
> = async () => {
	const Authorization = await getAuthorizationToken()
	const response = await fetch(TOP_ARTISTS_ENDPOINT, {
		headers: {
			Authorization,
		},
	})

	const { status } = response

	log.info(`Status for top artists: ${status}`)

	if (status === 204) {
		return {}
	} else if (status === 200) {
		const data = await response.json()
		return data
	}
}

export const getRecentlyLovedTracks: () => Promise<
	SavedTracksResponse
> = async () => {
	const Authorization = await getAuthorizationToken()
	const response = await fetch(SAVED_TRACKS_ENDPOINT, {
		headers: {
			Authorization,
		},
	})

	const { status } = response

	log.info(`Status for recently loved: ${status}`)

	if (status === 204) {
		return {}
	} else if (status === 200) {
		const data = await response.json()
		return data
	}
}
