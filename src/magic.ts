import * as log from "https://deno.land/std/log/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { UserGetWeeklyAristChart } from "../types/types.d.ts";
import { fetchJson } from "./utils.ts";

const { LAST_FM_API_KEY, LAST_FM_USER } = config()

const magic = async () => {
	const top8 = await fetchJson<UserGetWeeklyAristChart>(`http://ws.audioscrobbler.com/2.0/?method=user.getWeeklyArtistChart&user=${LAST_FM_USER}&api_key=${LAST_FM_API_KEY}&format=json`)

	log.info(top8.weeklyartistchart)
}

magic()