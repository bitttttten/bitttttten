import { Base64 } from "https://deno.land/x/bb64/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import { SpotifyTopArtistsResponse } from "../types/types.d.ts"

const {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_REFRESH_TOKEN,
	SPOTIFY_CLIENT_SECRET,
} = config()

const token = Base64.fromString(
	`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString()
const Authorization = `Basic ${token}`

const AUTH_ENDPOINT = `https://accounts.spotify.com/api/token`
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=4`

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
	if (status === 204) {
		return {}
	} else if (status === 200) {
		const data = await response.json()
		return data
	}
}
