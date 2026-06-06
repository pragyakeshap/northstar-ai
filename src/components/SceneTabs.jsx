export function SceneTabs({ scenes, activeScene, onSelect }) {
  return (
    <nav className="scene-tabs" aria-label="Animation scenes">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          className={scene.id === activeScene ? "active" : ""}
          onClick={() => onSelect(scene.id)}
        >
          <span>{scene.id + 1}</span>
          {scene.title}
        </button>
      ))}
    </nav>
  );
}
