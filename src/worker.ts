import kv from "./kv";

import { Router } from 'itty-router';

const routingKey = "model"

export default {
	// Handle Incoming Requests
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const router = Router();

		router.post('/api/tlb', async (request, ...args) => {
			// Check the Input is Application JSON
			const contentType = request.headers.get("content-type");
			if (!contentType.includes("application/json")) {
			  return new Response("Invalid content type. Expecting JSON.")
			}

			// Parse JSON
			var json = await request.json();

			// Fetch KV Routing Details
			var routingDetails = await kv.GetRoutingDetails(env, routingKey, json[routingKey])
			if (routingDetails == undefined) {
				return new Response("Failed to determine request destination.", { status: 502 })
			}

			// Doesn't work as host header overrides seemingly are unsupported, but we can try. 🤷‍♂️
			// https://community.cloudflare.com/t/allow-direct-ip-access-from-workers-and-all-headers-with-fetch/48240/2
			const newHeaders = new Headers(request.headers);
			if (routingDetails.host != undefined) {
				console.log(JSON.stringify(newHeaders, null, 2));
				
				newHeaders.set('Host', routingDetails.host);
			}

			// Set Existing Request
			const newRequest = new Request(routingDetails.origin, {
				method: request.method,
				headers: newHeaders,
				body: JSON.stringify(json),
				redirect: request.redirect
			});

			// Perform the Subrequest
			const result = await fetch(newRequest);
			return result;

			//var result = await fetch(request.request).catch(err => {
			//	return new Response("Failed to request from origin.", { status: 502 })
			//})
		});

		// Default Route Handlers
		router.get('*', async (request, ...args) => {
			return new Response("Forbidden. A GET request to an unexpected path was made.")
		});
		router.post('*', async (request, ...args) => {
			return new Response("Forbidden. A POST request to an unexpected path was made.")
		});

		// Pass the Request to the Router
		return router.handle(request)
	}
};

declare global {
	const ADMIN_API_KEY: string
}

export type RoutingDetails = {
	origin: string
	host: string | undefined
}
