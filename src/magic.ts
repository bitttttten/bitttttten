import { readFileStr } from "https://deno.land/std/fs/mod.ts"
import { writeFileStr } from "https://deno.land/std/fs/write_file_str.ts"
import { Markdown } from "https://deno.land/x/deno_markdown/mod.ts"
import { LocalArtist } from "../types/types.d.ts"
import { getTopArtists } from "./spotify.ts"

const markdown = new Markdown()

const generateHeader = (artist: LocalArtist) =>
	`[${artist.name}](${artist.url})`
const generateImage = (artist: LocalArtist) =>
	`[<img src="${artist.image}" width="320" height="auto">](${artist.url})`

const generateTemplate: (data: {
	recentlyListening: string
}) => Promise<void> = async ({ recentlyListening }) => {
	const template = await readFileStr("./README.template.md")

	const readme = template.replace(
		"<!-- recentlylistening -->",
		recentlyListening
	)

	await writeFileStr("./README.md", readme)
}

const generateTable = async (data: LocalArtist[]) => {
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
			data.images.find((image) => image.height === 320)?.url ||
			data.images[0]?.url ||
			"",
	}))

	const table = await generateTable(data)

	return table
}

const magic = async () => {
	const topArtists = await getTopArtistsContent()

	await generateTemplate({ recentlyListening: topArtists })
}

magic()
