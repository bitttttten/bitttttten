import * as log from "https://deno.land/std/log/mod.ts"
import { readFileStr } from "https://deno.land/std@0.61.0/fs/mod.ts"
import { writeFileStr } from "https://deno.land/std@0.61.0/fs/write_file_str.ts"
import { Markdown } from "https://deno.land/x/deno_markdown/mod.ts"
import type { LocalArtist, RecentlyPlayedTracksItem } from "../types/types.d.ts"
import { getEggs } from "./github.ts"
import {
	getArtistById,
	getRecentlyLovedTracks,
	getRecentlyPlayedTracks,
	getTopArtists,
} from "./spotify.ts"

const trimString = (str: string) =>
	str.length <= 30 ? str : `${str.slice(0, 29)}…`
const generateHeader = (artist: LocalArtist) =>
	`[${artist.name}](${artist.url})`
const generateImage = (artist: LocalArtist) =>
	`[<img src="${artist.image}" width="320" height="auto">](${artist.url})`

interface GenerateTemplateProps {
	recentlyListening: string
	topArtists: string
	recentlyLoved: string
	eggs: string
}

const generateTemplate: (
	data: GenerateTemplateProps
) => Promise<void> = async ({
	recentlyListening,
	topArtists,
	recentlyLoved,
	eggs,
}) => {
	const template = await readFileStr("./README.template.md")

	const readme = template
		.replace("<!-- topartists -->", topArtists)
		.replace("<!-- recentlylistening -->", recentlyListening)
		.replace("<!-- recentlyloved -->", recentlyLoved)
		.replace("<!-- eggs -->", eggs)

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
		name: trimString(data.name),
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
		const artists = trimString(
			data.track.album.artists.map((artist) => artist.name).join(", ")
		)
		const trackName = trimString(`${data.track.name}`)
		const fullName = `${trackName}<br />${artists}`

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

const getRecentlyPlayedTracksContent = async () => {
	const response = await getRecentlyPlayedTracks()

	// only fetches the first artist in the list, so this doesn't account for collabs but i don't mind that here
	const getArtist = (data: RecentlyPlayedTracksItem) => data.track.artists[0]

	// find unique 4 artists by getting 4 unique first artists by id
	const unique4 = response.items.reduce<RecentlyPlayedTracksItem[]>(
		(acc, curr) => {
			const ids = acc.map((item) => getArtist(item).id)
			if (!ids.includes(getArtist(curr).id)) {
				acc.push(curr)
			}
			return acc
		},
		[]
	)

	// if 4 unique artists were not found, then just use the unique4 and stitch on the response items
	const items =
		unique4.length >= 4 ? unique4 : [...unique4, ...response.items]

	// spotify doesn't return the artist image in recently listened to, so when we build the object
	// we need to fetch the artist too
	const itemsData = items.slice(0, 4).map(async (data) => {
		const artists = trimString(
			data.track.artists.map((artist) => artist.name).join(", ")
		)
		const trackName = trimString(`${data.track.name}`)
		const fullName = `${trackName}<br />${artists}`

		const artistData = await getArtistById(getArtist(data).id)

		return {
			name: fullName,
			url: data.track.external_urls.spotify,
			image:
				artistData.images
					.sort((a, b) => a.width - b.width)
					.find((image) => image.height > 320)?.url ||
				artistData.images[0]?.url ||
				"",
		}
	})

	const data = await Promise.all(itemsData)

	const table = await generateTable(data)

	return table
}

const getEggsContent = async () => {
	const eggs = await getEggs()

	const images = eggs
		.map(
			(egg) =>
				`<a href="${egg.url}"><img src="${egg.avatarUrl}" width="30" height="30" />`
		)
		.join("")

	return images
}

const magic = async () => {
	const topArtists = await getTopArtistsContent()
	const recentlyLoved = await getRecentlyLovedContent()
	const recentlyPlayed = await getRecentlyPlayedTracksContent()
	const eggs = await getEggsContent()

	try {
		await generateTemplate({
			topArtists,
			recentlyListening: recentlyPlayed,
			recentlyLoved,
			eggs,
		})
	} catch (e) {
		log.error(
			`Big oof.. something went wrong when writing to the template: ${e}`
		)
	}
}

magic()
