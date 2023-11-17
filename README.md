# Cloudflare Workers API Load Balancer Example
This project demonstrates how you can ingest API traffic to a Cloudflare Worker, then re-route the traffic based on the JSON payload and a KV store for routing details. You'll also see it referred to in code as TLB or "The Load Balancer"..

**Does Not Support:**
- Cloudflare Workers' fetch does not support Direct IP Access.
- Cloudflare Workers' fetch does not support `host` header overrides on the given origin URL and is subject to your WAF.

## License
This work is licensed under the MIT License.  
Please review [LICENSE](LICENSE.md) (LICENSE.md) for specifics.
