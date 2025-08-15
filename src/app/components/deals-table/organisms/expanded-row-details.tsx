/** @format */

import React from "react";
import {
  FileTextIcon,
  UserIcon,
  MessageSquareIcon,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";
import type { Deal } from "../types";

export const ExpandedRowDetails: React.FC<{ deal: Deal }> = React.memo(
  ({ deal }) => {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <div className="p-6 border-l-4 border-l-slate-500 dark:border-l-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Deal Details Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Deal Details
              </h4>
              {deal.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {deal.description}
                </p>
              )}
              {deal.contact && (
                <div className="bg-card dark:bg-slate-800 rounded-lg border border-border">
                  <div className="flex items-center gap-2 p-4">
                    <UserIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-medium text-foreground">
                      {deal.contact.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-4 border-t border-border">
                    <MessageSquareIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {deal.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-4 border-t border-border">
                    <ClockIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {deal.contact.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Timeline Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {deal.activities?.slice(0, 3).map((activity, idx) => (
                  <div
                    key={idx}
                    className="bg-card dark:bg-slate-800 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3 p-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <MessageSquareIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {activity.type}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {format(new Date(activity.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* Files Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Files ({deal.files?.length || 0})
              </h4>
              <div className="space-y-2">
                {deal.files?.map((file, idx) => (
                  <div
                    key={idx}
                    className="bg-card dark:bg-slate-800 rounded-lg border border-border hover:border-border dark:hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-3 p-3">
                      <FileTextIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span className="text-sm text-foreground flex-1 truncate">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                        {file.size}
                      </span>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No files attached
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ExpandedRowDetails;
