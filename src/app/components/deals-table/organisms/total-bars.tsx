/** @format */

interface TotalsData {
  totalDeals: number;
  totalAmount: number;
  weightedAmount: number;
  avgProbability: number;
  stageBreakdown: Record<string, number>;
}

interface TotalsBarProps {
  totals: TotalsData;
}

const STAGE_COLORS = {
  Won: "bg-green-500",
  Lost: "bg-red-500",
  Negotiation: "bg-orange-500",
  Proposal: "bg-blue-500",
  Qualified: "bg-purple-500",
  New: "bg-gray-500",
};

export function TotalsBar({ totals }: TotalsBarProps) {
  return (
    <div className="border-t border-border bg-muted/20 p-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Main metrics */}
        <div className="grid grid-cols-2 lg:flex lg:items-center gap-4 lg:gap-6 text-sm w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              Total Deals:
            </span>
            <span className="text-primary font-semibold">
              {totals.totalDeals}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              Total Value:
            </span>
            <span className="text-green-600 font-semibold">
              ${totals.totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              Weighted Value:
            </span>
            <span className="text-blue-600 font-semibold">
              ${Math.round(totals.weightedAmount).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-muted-foreground">
              Avg Probability:
            </span>
            <span className="text-orange-600 font-semibold">
              {totals.avgProbability.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(totals.stageBreakdown).map(([stage, count]) => (
            <div key={stage} className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  STAGE_COLORS[stage as keyof typeof STAGE_COLORS] ||
                  "bg-gray-400"
                }`}
              />
              <span className="text-muted-foreground">
                {stage}: {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
