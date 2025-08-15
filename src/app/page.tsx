/** @format */

import { DealsTable } from "@/components/deals-table";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Deals Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your sales pipeline with advanced table features
          </p>
        </div>
        <DealsTable />
      </div>
    </div>
  );
}
