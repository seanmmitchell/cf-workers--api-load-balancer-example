import { RoutingDetails } from './worker'

export default {
    async GetRoutingDetails(env: Env, routingKey: string, key: string): Promise<RoutingDetails | undefined> {
        console.debug("kv | Getting routing details from KV for \"" + routingKey + "\" = \"" + key + "\"")
        let details = await env.tlb.get(key).catch(err => {
            console.error("kv | Failed to get routing details from KV for \"" + routingKey + "\" = \"" + key + "\". Error: " + String(err))
            return undefined
        })

        if (details === null) {
            console.error("kv | Failed to get location data key from KV.")
            return undefined
        }
        console.debug("kv | Location data pulled.")
    
        console.debug("kv | Parsing location data pulled from KV...")
        details = String(details)
        let data:RoutingDetails = JSON.parse(details)
        console.debug("kv | Parsed location data pulled from KV.")

        return data
    }
}