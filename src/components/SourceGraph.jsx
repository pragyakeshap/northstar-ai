import { FileText, FolderSearch, Library, ShieldCheck } from "lucide-react";

const iconByCategory = {
  knowledge: Library,
  policy: ShieldCheck,
  product: FolderSearch,
  compliance: FileText
};

export function SourceGraph({ sources }) {
  return (
    <section className="source-graph">
      <h3>Trusted internal sources</h3>
      <div className="source-card-grid">
        {sources.map((source, index) => {
          const Icon = iconByCategory[source.category] ?? FileText;

          return (
            <article
              key={source.sourceId}
              className="source-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="source-icon">
                <Icon size={18} />
              </div>
              <div>
                <strong>{source.label}</strong>
                <span>{source.category} · refreshed {source.freshnessDays}d ago</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
