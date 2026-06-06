function parsePipeDelimited(text) {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.startsWith("#"));

  const headers = lines[0].split("|").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split("|").map((value) => value.trim());
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

async function loadTextFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}`);
  }
  return response.text();
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export async function loadDemoData() {
  const [
    clientActivityText,
    hubsText,
    routesText,
    sourcesText,
    queriesText
  ] = await Promise.all([
    loadTextFile("/sample-data/client_activity.txt"),
    loadTextFile("/sample-data/advisor_hubs.txt"),
    loadTextFile("/sample-data/request_routes.txt"),
    loadTextFile("/sample-data/knowledge_sources.txt"),
    loadTextFile("/sample-data/sample_queries.txt")
  ]);

  const clientActivity = parsePipeDelimited(clientActivityText).map((row) => ({
    locationId: row.location_id,
    region: row.region,
    lat: toNumber(row.lat),
    lon: toNumber(row.lon),
    volume: toNumber(row.volume),
    topic: row.topic
  }));

  const hubs = parsePipeDelimited(hubsText).map((row) => ({
    hubId: row.hub_id,
    hubName: row.hub_name,
    city: row.city,
    state: row.state,
    lat: toNumber(row.lat),
    lon: toNumber(row.lon)
  }));

  const routes = parsePipeDelimited(routesText).map((row) => ({
    routeId: row.route_id,
    fromLocationId: row.from_location_id,
    toHubId: row.to_hub_id,
    volume: toNumber(row.volume),
    avgLatencySec: toNumber(row.avg_latency_sec)
  }));

  const sources = parsePipeDelimited(sourcesText).map((row) => ({
    sourceId: row.source_id,
    label: row.label,
    category: row.category,
    freshnessDays: toNumber(row.freshness_days)
  }));

  const queries = parsePipeDelimited(queriesText).map((row) => ({
    queryId: row.query_id,
    repRegion: row.rep_region,
    question: row.question,
    answer: row.answer,
    sourceIds: row.sources.split(",").map((sourceId) => sourceId.trim())
  }));

  return {
    clientActivity,
    hubs,
    routes,
    sources,
    queries
  };
}
