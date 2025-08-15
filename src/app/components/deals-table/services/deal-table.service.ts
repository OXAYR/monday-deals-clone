/**
 * Deals Table Service
 * Contains business logic and utilities for filtering, sorting, and totals
 * @format
 */
import type { Deal, ColumnConfig, SortConfig, FilterConfig } from "../types";

export function filterDeals(deals: Deal[], filters: FilterConfig): Deal[] {
  return deals.filter((deal) => {
    // Search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        deal.name.toLowerCase().includes(searchLower) ||
        deal.company.toLowerCase().includes(searchLower) ||
        deal.owner.name.toLowerCase().includes(searchLower) ||
        deal.tags.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }
    // Multi-criteria filtering
    if (filters.stages.length > 0 && !filters.stages.includes(deal.stage))
      return false;
    if (
      filters.priorities.length > 0 &&
      !filters.priorities.includes(deal.priority)
    )
      return false;
    if (filters.owners.length > 0 && !filters.owners.includes(deal.owner.name))
      return false;
    if (filters.sources.length > 0 && !filters.sources.includes(deal.source))
      return false;
    // Amount range filtering
    const amount = Number.parseFloat(deal.amount.replace(/[$,]/g, ""));
    if (amount < filters.amountRange.min || amount > filters.amountRange.max)
      return false;
    return true;
  });
}

export function sortDeals(deals: Deal[], sortConfigs: SortConfig[]): Deal[] {
  if (sortConfigs.length === 0) return deals;
  return [...deals].sort((a, b) => {
    for (const config of sortConfigs) {
      let aVal = a[config.key];
      let bVal = b[config.key];
      if (config.key === "owner") {
        aVal = (a.owner as any).name;
        bVal = (b.owner as any).name;
      }
      if (config.key === "amount") {
        aVal = Number.parseFloat((aVal as string) ?? "0");
        bVal = Number.parseFloat((bVal as string) ?? "0");
      }
      if (config.key === "closeDate") {
        aVal = aVal ? new Date(aVal as string).getTime() : 0;
        bVal = bVal ? new Date(bVal as string).getTime() : 0;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal !== undefined && bVal !== undefined) {
        if (aVal < bVal) return config.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return config.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });
}

export function calculateTotals(deals: Deal[]) {
  const totalValue = deals.reduce(
    (sum, deal) => sum + Number.parseFloat(deal.amount.replace(/[$,]/g, "")),
    0
  );
  const weightedValue = deals.reduce((sum, deal) => {
    const amount = Number.parseFloat(deal.amount.replace(/[$,]/g, ""));
    return sum + (amount * deal.probability) / 100;
  }, 0);
  const avgProbability =
    deals.length > 0
      ? deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length
      : 0;
  return {
    totalDeals: deals.length,
    totalValue,
    weightedValue,
    avgProbability,
    wonDeals: deals.filter((deal) => deal.stage === "Won").length,
    lostDeals: deals.filter((deal) => deal.stage === "Lost").length,
  };
}

export function getUniqueValues(deals: Deal[]) {
  return {
    stages: Array.from(new Set(deals.map((d) => d.stage))),
    priorities: Array.from(new Set(deals.map((d) => d.priority))),
    owners: Array.from(new Set(deals.map((d) => d.owner.name))),
    sources: Array.from(new Set(deals.map((d) => d.source))),
  };
}
