import { useEffect, useState } from "react";
import { Building2, MessageSquareText, ShieldCheck, Timer } from "lucide-react";

function AnimatedCounter({ target, duration = 1400 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const isNumber = typeof target === "number";
    if (!isNumber) { setValue(target); return; }

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{typeof target === "number" ? value.toLocaleString() : value}</span>;
}

export function MetricsBar({ hubCount, questionCount, averageTime, sourceBacked }) {
  const items = [
    { label: "Advisor hubs",          value: hubCount,       icon: Building2,         numeric: true  },
    { label: "Questions routed",      value: questionCount,  icon: MessageSquareText,  numeric: true  },
    { label: "Avg. time to answer",   value: averageTime,    icon: Timer,              numeric: false },
    { label: "Source-backed answers", value: sourceBacked,   icon: ShieldCheck,        numeric: false },
  ];

  return (
    <section className="metrics-bar">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div className="metric" key={item.label}>
            <Icon size={24} />
            <strong>
              <AnimatedCounter target={item.value} />
            </strong>
            <span>{item.label}</span>
          </div>
        );
      })}
    </section>
  );
}
