/** @format */

import React, { useState, useRef } from "react";
import { format } from "date-fns";
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
  XIcon,
} from "lucide-react";

interface ExpandedRowDetailsProps {
  deal: any;
  onActivityAdd?: (dealId: string, activity: any) => void;
  onFileUpload?: (dealId: string, file: File) => void;
}

export const ExpandedRowDetails: React.FC<ExpandedRowDetailsProps> = React.memo(
  ({ deal, onActivityAdd, onFileUpload }) => {
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);
    const [activityForm, setActivityForm] = useState({
      type: "email",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const activityTypes = [
      { value: "email", label: "Email", icon: MessageSquareIcon },
      { value: "call", label: "Call", icon: ActivityIcon },
      { value: "meeting", label: "Meeting", icon: CalendarIcon },
      { value: "note", label: "Note", icon: FileTextIcon },
    ];

    const handleActivitySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (activityForm.description.trim()) {
        const newActivity = {
          id: Date.now(),
          ...activityForm,
          user: "Current User",
          icon:
            activityTypes.find((t) => t.value === activityForm.type)?.icon ||
            ActivityIcon,
        };

        if (onActivityAdd) {
          onActivityAdd(deal.id, newActivity);
        }

        setActivityForm({
          type: "email",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        setShowActivityModal(false);
      }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onFileUpload) {
        onFileUpload(deal.id, file);
      }
      setShowFileModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleFileButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <>
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
                      <p className="text-foreground font-medium">
                        {deal.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Close Date
                      </p>
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
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Stage</p>
                      <p className="text-foreground font-medium">
                        {deal.stage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <p className="text-foreground font-medium">
                        {deal.priority}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
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
                    <p className="text-sm text-muted-foreground">Source</p>
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
                    onClick={() => setShowActivityModal(true)}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowActivityModal(true)}
                >
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFileButtonClick}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                />
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
                      <p className="text-xs text-muted-foreground">
                        {file.size}
                      </p>
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

        {/* Add Activity Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-card/90 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-border animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="p-4 sm:p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Add Activity
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowActivityModal(false)}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <form
                onSubmit={handleActivitySubmit}
                className="p-4 sm:p-6 space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Activity Type
                  </label>
                  <select
                    value={activityForm.type}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={activityForm.description}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe the activity..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={activityForm.date}
                    onChange={(e) =>
                      setActivityForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowActivityModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Add Activity
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }
);

ExpandedRowDetails.displayName = "ExpandedRowDetails";
