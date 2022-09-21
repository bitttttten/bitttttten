import * as log from "https://deno.land/std/log/mod.ts"
import { config } from "https://deno.land/x/dotenv/mod.ts"
import type { GithubRepository } from "../types/types.d.ts"

config({ export: true })

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN")
const Authorization = `Bearer ${GITHUB_TOKEN}`

const query = `
query {
  user(login: "bitttttten") {
    followers(first: 100) {
      edges {
        node {
          name
          avatarUrl(size: 90)
          url
        }
      }
    }
  }
}
`

export const getEggs = async () => {
	try {
		const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization,
			},
			body: JSON.stringify({ query }),
		})

		const json = (await response.json()) as GithubRepository.Followers

		log.info(`Response from Github was ${response.status} with ${response.statusText}`)
		log.info(`${json}`)

		return json.data.user.followers.edges.map(({ node }) => node)
	} catch (e) {
		log.error(`Could not fetch data from Github: ${e}`)
		return []
	}
}
