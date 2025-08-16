/** @format */

import React from "react";
import { format } from "date-fns";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import {
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  DollarSignIcon,
  FileTextIcon,
  MessageSquareIcon,
  ActivityIcon,
  DownloadIcon,
  PlusIcon,
} from "lucide-react";

interface ExpandedRowDetailsProps {
  deal: any;
}

export const ExpandedRowDetails: React.FC<ExpandedRowDetailsProps> = React.memo(
  ({ deal }) => {
    // Mock activity data
    const activities = [
      {
        id: 1,
        type: "email",
        description: "Follow-up email sent to prospect",
        date: "2024-01-15",
        user: "John Doe",
        icon: MessageSquareIcon,
      },
      {
        id: 2,
        type: "call",
        description: "Discovery call completed",
        date: "2024-01-14",
        user: "Jane Smith",
        icon: ActivityIcon,
      },
      {
        id: 3,
        type: "meeting",
        description: "Product demo scheduled",
        date: "2024-01-13",
        user: "Mike Johnson",
        icon: CalendarIcon,
      },
    ];

    // Mock files data
    const files = [
      { id: 1, name: "Proposal.pdf", size: "2.4 MB", type: "pdf" },
      { id: 2, name: "Contract.docx", size: "1.1 MB", type: "doc" },
      { id: 3, name: "Presentation.pptx", size: "5.2 MB", type: "ppt" },
    ];

    return (
      <div className="bg-card/50 border-t border-border">
        <div className="p-6 border-l-4 border-l-primary">
          {/* Main Deal Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Deal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Deal Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Owner</p>
                    <p className="text-foreground font-medium">
                      {deal.owner.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BuildingIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="text-foreground font-medium">
                      {deal.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-foreground font-medium">{deal.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Close Date</p>
                    <p className="text-foreground font-medium">
                      {format(new Date(deal.closeDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Progress */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Status & Progress
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Stage</p>
                  <Badge variant="secondary" className="text-sm">
                    {deal.stage}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Priority</p>
                  <Badge variant="outline" className="text-sm">
                    {deal.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Probability
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${deal.probability}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8 text-right">
                      {deal.probability}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Source</p>
                  <p className="text-foreground font-medium">{deal.source}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <MessageSquareIcon className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Create Proposal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ActivityIcon className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ActivityIcon className="h-5 w-5" />
                Recent Activity
              </h3>
              <Button variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(activity.date), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.user}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Files Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                Files & Documents
              </h3>
              <Button variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ExpandedRowDetails.displayName = "ExpandedRowDetails";
