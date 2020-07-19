import { readFileStr } from "https://deno.land/std/fs/mod.ts"
import { writeFileStr } from "https://deno.land/std/fs/write_file_str.ts"
import { Markdown } from "https://deno.land/x/deno_markdown/mod.ts"
import { LocalArtist } from "../types/types.d.ts"
import { getTopArtists, getRecentlyLovedTracks } from "./spotify.ts"

const generateHeader = (artist: LocalArtist) =>
	`[${artist.name}](${artist.url})`
const generateImage = (artist: LocalArtist) =>
	`[<img src="${artist.image}" width="320" height="auto">](${artist.url})`

const generateTemplate: (data: {
	recentlyListening: string
	recentlyLoved: string
}) => Promise<void> = async ({ recentlyListening, recentlyLoved }) => {
	const template = await readFileStr("./README.template.md")

	const readme = template
		.replace("<!-- recentlylistening -->", recentlyListening)
		.replace("<!-- recentlyloved -->", recentlyLoved)

	await writeFileStr("./README.md", readme)
}

const generateTable = async (data: LocalArtist[]) => {
	const markdown = new Markdown()

	const table = await markdown.table([
		data.map(generateHeader),
		data.map(generateImage),
	])

	return table.content.trim()
}

const getTopArtistsContent = async () => {
	const response = await getTopArtists()

	const data = response.items.slice(0, 4).map((data) => ({
		name: data.name,
		url: data.external_urls.spotify,
		image:
			data.images
				.sort((a, b) => a.width - b.width)
				.find((image) => image.height > 320)?.url ||
			data.images[0]?.url ||
			"",
	}))

	const table = await generateTable(data)

	return table
}

const getRecentlyLovedContent = async () => {
	const response = await getRecentlyLovedTracks()

	const data = response.items.slice(0, 4).map((data) => {
		const artists = data.track.album.artists
			.map((artist) => artist.name)
			.join(",")
		const fullName = `${data.track.name}<br />${artists}`

		return {
			name: fullName,
			url: data.track.album.external_urls.spotify,
			image:
				data.track.album.images
					.sort((a, b) => a.width - b.width)
					.find((image) => image.height > 320)?.url ||
				data.track.album.images[0]?.url ||
				"",
		}
	})

	const table = await generateTable(data)

	return table
}

const magic = async () => {
	const topArtists = await getTopArtistsContent()
	const recentlyLoved = await getRecentlyLovedContent()

	await generateTemplate({ recentlyListening: topArtists, recentlyLoved })
}

magic()
