import { useState, useEffect } from "react";
import { Bot, UserRound, ExternalLink } from "lucide-react";

function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export function ChatPanel({ query, sources }) {
  const sourceMap = Object.fromEntries(sources.map((source) => [source.sourceId, source]));
  const { displayed, done } = useTypewriter(query.answer);

  return (
    <section className="chat-panel">
      <div className="panel-title">
        <Bot size={18} />
        <span>Internal Assistant</span>
        <span className="online-dot" />
        <small>Online</small>
      </div>

      <div className="message rep">
        <div className="avatar">
          <UserRound size={16} />
        </div>
        <div>
          <strong>Representative</strong>
          <p>{query.question}</p>
        </div>
      </div>

      <div className="message assistant">
        <div className="avatar bot">
          <Bot size={16} />
        </div>
        <div>
          <strong>Assistant</strong>
          <div>
            <p>
              {displayed}
              {!done && <span className="typewriter-cursor" />}
            </p>

            {done && (
              <div className="sources-list">
                <span className="sources-heading">Sources</span>
                {query.sourceIds.map((sourceId, index) => {
                  const source = sourceMap[sourceId];
                  return (
                    <div
                      key={sourceId}
                      className="source-row"
                      style={{ animation: `cardIn 350ms ease ${index * 0.12}s both` }}
                    >
                      <span>{index + 1}</span>
                      <p>{source?.label ?? sourceId}</p>
                    </div>
                  );
                })}
                <button className="view-sources">
                  View source trail <ExternalLink size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
