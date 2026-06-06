# NorthStar AI

A U.S. map-based animation prototype that shows how an internal advisor AI assistant routes client questions to representatives and retrieves trusted, source-backed answers at national scale.

This repo intentionally avoids real company names, client data, internal URLs, and proprietary terminology.

## What it shows

The animation tells a four-part story:

1. **Client activity across the U.S.**  
   A U.S. map lights up with regional client question activity.

2. **Requests routed to advisor hubs**  
   Animated arcs show requests flowing from client regions to advisor/service hubs.

3. **Internal assistant retrieves trusted knowledge**  
   The advisor asks an internal assistant a question. The assistant retrieves from sample internal knowledge sources.

4. **Trusted answers at national scale**  
   The final dashboard view combines the national activity map, chatbot response, source references, and operational metrics.

## Tech stack

- React
- Vite
- SVG/CSS animation
- Text-file sample data
- No map API key required
- No external data service required

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL in your browser.

## Sample data files

The demo reads data from:

```text
public/sample-data/client_activity.txt
public/sample-data/advisor_hubs.txt
public/sample-data/request_routes.txt
public/sample-data/knowledge_sources.txt
public/sample-data/sample_queries.txt
```

The files are pipe-delimited text files. Replace them with sanitized exports from logs later.

## Data privacy notes

For real logs, do **not** use precise client addresses, account identifiers, names, emails, IP addresses, device identifiers, or any other personally identifiable information.

Recommended production-safe approach:

- Aggregate client location to state, region, metro, or coarse geohash.
- Aggregate activity volume by time window.
- Use anonymized advisor hub names.
- Use only approved source labels, not internal URLs.
- Keep query text sanitized or categorize it by topic.

## Suggested repo description

> U.S. map-based animation prototype showing how an internal advisor AI assistant routes client questions to representatives and retrieves trusted source-backed answers.

## Suggested anonymous product names

- AdvisorConnect AI
- Trusted Guidance Assistant
- Internal Knowledge Assistant
- Advisor Knowledge Copilot
- Client Guidance Assistant

## Important

All data in this repo is fictional and for visualization only.
