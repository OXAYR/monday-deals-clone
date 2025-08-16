/** @format */

// components/molecules/TotalsBar.tsx
import React from "react";

type Stat = {
  label: string;
  value: number | string;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "%"
  className?: string; // custom color styling (primary, emerald, red, etc.)
  format?: "number" | "currency" | "percent"; // optional formatting
};

interface TotalsBarProps {
  stats: Stat[];
}

const TotalsBar: React.FC<TotalsBarProps> = ({ stats }) => {
  const formatValue = (value: number | string, format?: Stat["format"]) => {
    if (typeof value !== "number") return value;

    switch (format) {
      case "currency":
        return `$${value.toLocaleString()}`;
      case "percent":
        return `${Math.round(value)}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-background/95 border-t border-border px-4 py-4 sm:px-8 shadow-inner">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div
              className={`text-2xl font-bold drop-shadow-sm ${
                stat.className ?? "text-foreground"
              }`}
            >
              {stat.prefix ?? ""}
              {formatValue(stat.value, stat.format)}
              {stat.suffix ?? ""}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalsBar;
