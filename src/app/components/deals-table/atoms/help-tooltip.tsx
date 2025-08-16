/** @format */

// components/HelpTooltip.tsx
import React from "react";

type Section = {
  title: string;
  items: string[];
};

interface HelpTooltipProps {
  sections: Section[];
  position?: string; // e.g. "bottom-4 right-4"
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  sections,
  position = "bottom-4 right-4",
}) => {
  return (
    <div className={`fixed ${position} z-30 hidden md:block`}>
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs text-muted-foreground">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-2 last:mb-0">
            <div className="font-semibold mb-1">{section.title}</div>
            {section.items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpTooltip;
