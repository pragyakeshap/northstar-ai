import React from 'react';
import { useEffect, useMemo, useState } from "react";
import { USMap } from "./components/USMap.jsx";
import { ChatPanel } from "./components/ChatPanel.jsx";
import { SourceGraph } from "./components/SourceGraph.jsx";
import { MetricsBar } from "./components/MetricsBar.jsx";
import { SceneTabs } from "./components/SceneTabs.jsx";
import { loadDemoData } from "./utils/dataLoader.js";

const SCENES = [
  {
    id: 0,
    title: "Client activity across the U.S.",
    caption: "Client questions appear as regional activity pulses."
  },
  {
    id: 1,
    title: "Requests routed to advisor hubs",
    caption: "Digital request flows connect client regions to distributed advisor teams."
  },
  {
    id: 2,
    title: "Internal assistant retrieves trusted knowledge",
    caption: "The assistant searches approved internal knowledge sources."
  },
  {
    id: 3,
    title: "Trusted answers at national scale",
    caption: "Representatives receive fast, source-backed guidance."
  }
];

export default function App() {
  const [data, setData] = useState(null);
  const [scene, setScene] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    loadDemoData().then(setData).catch((error) => {
      console.error("Failed to load demo data", error);
    });
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = window.setInterval(() => {
      setScene((current) => (current + 1) % SCENES.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [autoPlay]);

  const activeQuery = useMemo(() => {
    if (!data?.queries?.length) return null;
    return data.queries[scene % data.queries.length];
  }, [data, scene]);

  if (!data) {
    return (
      <main className="app-shell loading">
        <div className="loading-card">Loading sample animation data...</div>
      </main>
    );
  }

  const showRoutes = scene >= 1;
  const showSources = scene >= 2;
  const finalMode = scene === 3;

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">NorthStar AI · Advisor Knowledge Platform</p>
          <h1>Advisor AI Knowledge Flow</h1>
          <p className="hero-copy">
            From client question to trusted guidance, using internal source-backed answers.
          </p>
        </div>

        <button
          className="play-toggle"
          onClick={() => setAutoPlay((value) => !value)}
          aria-label="Toggle autoplay"
        >
          {autoPlay ? "Pause animation" : "Play animation"}
        </button>
      </header>

      <SceneTabs
        scenes={SCENES}
        activeScene={scene}
        onSelect={(nextScene) => {
          setScene(nextScene);
          setAutoPlay(false);
        }}
      />

      <section className={`stage scene-${scene}`}>
        <div className="stage-header">
          <span className="scene-number">{scene + 1}</span>
          <div>
            <h2>{SCENES[scene].title}</h2>
            <p>{SCENES[scene].caption}</p>
          </div>
        </div>

        <div className={`stage-grid ${finalMode ? "final-mode" : ""}`}>
          <div className="map-card">
            <USMap
              clientActivity={data.clientActivity}
              hubs={data.hubs}
              routes={data.routes}
              showRoutes={showRoutes}
              showHubs={showRoutes || finalMode}
              compact={showSources}
            />
          </div>

          <aside className={`insight-panel ${showSources ? "visible" : ""}`}>
            {showSources ? (
              <>
                <SourceGraph sources={data.sources} />
                <ChatPanel query={activeQuery} sources={data.sources} />
              </>
            ) : scene === 0 ? (
              <div className="activity-feed-panel">
                <h3>Live client activity</h3>
                <div className="activity-feed-list">
                  {data.clientActivity.map((item, i) => (
                    <div className="activity-feed-item" key={item.locationId} style={{ animationDelay: `${i * 0.1}s` }}>
                      <span className="feed-dot" />
                      <div>
                        <div className="feed-region">{item.region}</div>
                        <div className="feed-topic">{item.topCategory}</div>
                      </div>
                      <div className="feed-volume">{item.volume}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="routing-stats-panel">
                <h3>Routing overview</h3>
                <div className="routing-stat-grid">
                  <div className="routing-stat-card">
                    <strong>{data.routes.length}</strong>
                    <span>Active routes</span>
                  </div>
                  <div className="routing-stat-card">
                    <strong>{data.hubs.length}</strong>
                    <span>Advisor hubs</span>
                  </div>
                  <div className="routing-stat-card">
                    <strong>{data.routes.reduce((s, r) => s + r.volume, 0).toLocaleString()}</strong>
                    <span>Total volume</span>
                  </div>
                  <div className="routing-stat-card">
                    <strong>1:42</strong>
                    <span>Avg. response time</span>
                  </div>
                </div>
                <div className="routing-hub-list">
                  {data.hubs.map((hub, i) => {
                    const hubVolume = data.routes.filter(r => r.toHubId === hub.hubId).reduce((s, r) => s + r.volume, 0);
                    const maxVol = Math.max(...data.hubs.map(h => data.routes.filter(r => r.toHubId === h.hubId).reduce((s, r) => s + r.volume, 0)));
                    const pct = maxVol ? Math.round((hubVolume / maxVol) * 100) : 0;
                    return (
                      <div className="routing-hub-row" key={hub.hubId} style={{ animationDelay: `${i * 0.1}s` }}>
                        <span className="routing-hub-name">{hub.hubName}</span>
                        <div className="routing-hub-bar-wrap">
                          <div className="routing-hub-bar" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="routing-hub-pct">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>

        {finalMode && (
          <MetricsBar
            hubCount={data.hubs.length}
            questionCount={24532}
            averageTime="1:42"
            sourceBacked="100%"
          />
        )}
      </section>
    </main>
  );
}
