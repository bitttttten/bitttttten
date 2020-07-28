import * as log from "https://deno.land/std/log/mod.ts"
import { GithubRepository } from "../types/types.d.ts"

const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN")
const Authorization = `Bearer ${GITHUB_TOKEN}`

const query = `
query {
    repository(owner: "bitttttten", name: "bitttttten") {
      issue(number: 1) {
        reactions(first: 100) {
          edges {
            node {
              user {
                avatarUrl(size: 90) 
                url
              }
            }
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

		const json = (await response.json()) as GithubRepository.Response

		return json.data.repository.issue.reactions.edges.map(
			(edge) => edge.node.user
		)
	} catch (e) {
		log.error(`Could not fetch data from Github: ${e}`)
		return []
	}
}
