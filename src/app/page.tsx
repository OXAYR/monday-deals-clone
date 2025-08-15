/** @format */

import { DealsTable } from "./components/deals-table";

export default function Home() {
  return (
    <div className="min-h-screen bg-white/90 dark:bg-slate-900/90">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold  text-slate-900 dark:text-slate-100">
            Deals Dashboard
          </h1>
          <p className=" mt-2 text-slate-900 dark:text-slate-100">
            Manage your sales pipeline with advanced table features
          </p>
        </div>
        <DealsTable />
      </div>
    </div>
  );
}
