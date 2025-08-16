/** @format */

import { SearchIcon, PlusIcon } from "lucide-react";
import { Button } from "../atoms/button";

interface NoDealsFoundProps {
  filters: {
    searchTerm: string;
    stages: string[];
    priorities: string[];
  };
  onCreateDeal: () => void;
}

export function NoDealsFound({ filters, onCreateDeal }: NoDealsFoundProps) {
  const hasActiveFilters =
    filters.searchTerm ||
    filters.stages.length > 0 ||
    filters.priorities.length > 0;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <SearchIcon className="h-12 w-12 mb-4 text-muted-foreground" />

      <h3 className="text-lg font-medium text-foreground mb-2">
        No deals found
      </h3>

      <p className="text-sm text-muted-foreground text-center max-w-md">
        {hasActiveFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Get started by creating your first deal."}
      </p>

      <Button
        variant="default"
        size="sm"
        className="mt-4 shadow-md"
        onClick={onCreateDeal}
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Create Deal
      </Button>
    </div>
  );
}
