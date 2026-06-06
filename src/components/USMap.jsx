import { Building2 } from "lucide-react";
import { projectUSPoint } from "../utils/projection.js";

/**
 * Lightweight SVG U.S. map visualization.
 *
 * This intentionally uses a simplified abstract U.S. silhouette instead of a
 * vendor map API, so the demo can run without API keys or external map tiles.
 */
export function USMap({
  clientActivity,
  hubs,
  routes,
  showRoutes,
  showHubs,
  compact
}) {
  const hubById = Object.fromEntries(hubs.map((hub) => [hub.hubId, hub]));
  const activityById = Object.fromEntries(
    clientActivity.map((activity) => [activity.locationId, activity])
  );

  return (
    <div className={`us-map-wrap ${compact ? "compact" : ""}`}>
      <svg viewBox="0 0 1000 620" className="us-map" role="img">
        <defs>
          <radialGradient id="activityGlow">
            <stop offset="0%" stopColor="#78d6ff" stopOpacity="1" />
            <stop offset="45%" stopColor="#1aa7ff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1aa7ff" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="routeGradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#1aa7ff" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#31f7ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1aa7ff" stopOpacity="0.15" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1000" height="620" rx="28" className="map-bg" />

        <path
          className="usa-shape"
          d="M137 228 L193 195 L262 178 L345 181 L427 167 L506 177 L583 173 L644 192 L701 195 L750 217 L812 232 L858 267 L879 320 L846 365 L786 386 L719 392 L659 415 L590 420 L518 403 L444 410 L377 396 L314 411 L245 387 L181 366 L132 330 Z"
        />

        <path
          className="state-grid"
          d="M210 205 V372 M300 185 V405 M390 181 V402 M480 174 V405 M570 175 V414 M660 190 V405 M750 222 V382 M160 270 H855 M145 325 H870 M190 380 H790"
        />

        {clientActivity.map((activity, index) => {
          const point = projectUSPoint(activity.lat, activity.lon);
          const radius = Math.max(18, Math.min(58, activity.volume / 8));

          return (
            <g key={activity.locationId} className="activity-point">
              <circle
                cx={point.x}
                cy={point.y}
                r={radius}
                fill="url(#activityGlow)"
                className="activity-halo"
                style={{ animationDelay: `${index * 0.35}s` }}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                className="activity-core"
              />
              <text x={point.x + 9} y={point.y - 10} className="map-label">
                {activity.region}
              </text>
            </g>
          );
        })}

        {showRoutes &&
          routes.map((route, index) => {
            const from = activityById[route.fromLocationId];
            const to = hubById[route.toHubId];
            if (!from || !to) return null;

            const start = projectUSPoint(from.lat, from.lon);
            const end = projectUSPoint(to.lat, to.lon);
            const midX = (start.x + end.x) / 2;
            const midY = Math.min(start.y, end.y) - 90 - index * 3;

            return (
              <path
                key={route.routeId}
                d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                className="route-line"
                style={{
                  animationDelay: `${index * 0.22}s`,
                  strokeWidth: Math.max(1, Math.min(3.5, route.volume / 45))
                }}
              />
            );
          })}

        {showHubs &&
          hubs.map((hub) => {
            const point = projectUSPoint(hub.lat, hub.lon);

            return (
              <g key={hub.hubId} className="hub-node" filter="url(#glow)">
                <circle cx={point.x} cy={point.y} r="25" className="hub-ring" />
                <circle cx={point.x} cy={point.y} r="15" className="hub-core" />
                <foreignObject x={point.x - 9} y={point.y - 9} width="18" height="18">
                  <Building2 size={18} color="#dff7ff" />
                </foreignObject>
                <text x={point.x + 30} y={point.y - 2} className="hub-label">
                  {hub.hubName}
                </text>
                <text x={point.x + 30} y={point.y + 16} className="hub-sub-label">
                  {hub.city}, {hub.state}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
}
